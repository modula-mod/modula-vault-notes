import {randomUUID} from 'node:crypto'
import {plainTextProjection, validateStructuredDocument} from '../document/index.js'
import {noteEvent, type VaultNotesEventType} from '../events/index.js'
import {exportVaultNotes} from '../export/index.js'
import {projectNoteForSearch} from '../search/index.js'
import {validateVaultNotesSettings, vaultNotesDefaultSettings, type VaultNotesSettings} from '../settings/index.js'
import {VAULT_SYSTEM_TEMPLATES, instantiateVaultTemplate, vaultSystemTemplate} from '../templates/index.js'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  type VaultAttachmentKind,
  type VaultAttachmentRecord,
  type VaultContentFormat,
  type VaultExportFormat,
  type VaultFolderRecord,
  type VaultGraphData,
  type VaultModuleEvent,
  type VaultNoteIntelligencePolicy,
  type VaultNoteLinkRecord,
  type VaultNoteProperty,
  type VaultNoteRecord,
  type VaultNoteSearchQuery,
  type VaultNoteVersionRecord,
  type VaultSavedSearchRecord,
  type VaultStructuredDocument,
  type VaultTagRecord,
  type VaultTemplateRecord,
} from '../types.js'

type ActorContext = {accountId: string; actorId: string; requestId: string; correlationId: string}
type StoredIdempotency = {status: 'completed'; result: unknown}
type NotePatch = {
  title?: string
  document?: VaultStructuredDocument
  contentFormat?: VaultContentFormat
  canonicalBody?: string
  folderId?: string
  tagIds?: string[]
  icon?: string
  coverAttachmentId?: string
  properties?: VaultNoteProperty[]
  attachmentIds?: string[]
  sensitive?: boolean
  intelligencePolicy?: VaultNoteIntelligencePolicy
}

export class VaultNotesError extends Error {
  constructor(readonly code: string, message: string) {
    super(message)
  }
}

export class VaultNotesStore {
  private readonly notes = new Map<string, VaultNoteRecord>()
  private readonly folders = new Map<string, VaultFolderRecord>()
  private readonly tags = new Map<string, VaultTagRecord>()
  private readonly links = new Map<string, VaultNoteLinkRecord>()
  private readonly attachments = new Map<string, VaultAttachmentRecord>()
  private readonly templates = new Map<string, VaultTemplateRecord>(VAULT_SYSTEM_TEMPLATES.map(template => [template.id, structuredClone(template)]))
  private readonly savedSearches = new Map<string, VaultSavedSearchRecord>()
  private readonly versions: VaultNoteVersionRecord[] = []
  private readonly events: VaultModuleEvent[] = []
  private readonly idempotency = new Map<string, StoredIdempotency>()
  private settings: VaultNotesSettings = {...vaultNotesDefaultSettings}
  private failedActions = 0
  private exportFailures = 0

  constructor(private readonly context: ActorContext, private readonly retention = vaultNotesDefaultSettings.versionHistoryRetention) {}

  createNote(input: {
    title: string
    document: VaultStructuredDocument
    folderId?: string
    tagIds?: string[]
    properties?: VaultNoteProperty[]
    attachmentIds?: string[]
    icon?: string
    coverAttachmentId?: string
    sensitive?: boolean
    intelligencePolicy?: VaultNoteIntelligencePolicy
    contentFormat?: VaultContentFormat
    canonicalBody?: string
    templateId?: string
    dailyDate?: string
    idempotencyKey: string
  }) {
    return this.once(input.idempotencyKey, () => {
      this.requireDocument(input.document)
      this.requireFolder(input.folderId)
      this.requireTags(input.tagIds ?? [])
      this.requireProperties(input.properties ?? [])
      this.requireAttachments(input.attachmentIds ?? [])
      if (input.dailyDate && [...this.notes.values()].some(note => note.dailyDate === input.dailyDate && !note.deletedAt)) {
        throw new VaultNotesError('DAILY_NOTE_ALREADY_EXISTS', 'A daily note already exists for this date')
      }
      const now = new Date().toISOString()
      const note: VaultNoteRecord = {
        id: randomUUID(),
        title: input.title.trim() || 'Untitled',
        document: structuredClone(input.document),
        contentFormat: input.contentFormat ?? 'blocks-v1',
        canonicalBody: input.canonicalBody,
        plainTextProjection: plainTextProjection(input.document),
        folderId: input.folderId,
        tagIds: unique(input.tagIds ?? []),
        pinned: false,
        favourite: false,
        archived: false,
        icon: input.icon,
        coverAttachmentId: input.coverAttachmentId,
        properties: {version: '1.0.0', values: structuredClone(input.properties ?? [])},
        attachmentIds: unique(input.attachmentIds ?? []),
        sensitive: input.sensitive ?? false,
        intelligencePolicy: input.sensitive ? 'localOnly' : input.intelligencePolicy ?? this.settings.intelligencePreference,
        templateId: input.templateId,
        dailyDate: input.dailyDate,
        revision: 1,
        createdAt: now,
        updatedAt: now,
        dataSchemaVersion: VAULT_NOTES_DATA_SCHEMA_VERSION,
      }
      this.notes.set(note.id, note)
      this.emit('vault-notes.note.created', note)
      return note
    }) as VaultNoteRecord
  }

  createDailyNote(input: {date?: Date; templateId?: string; idempotencyKey: string}) {
    return this.once(input.idempotencyKey, () => {
      const date = input.date ?? new Date()
      const dailyDate = date.toISOString().slice(0, 10)
      const existing = [...this.notes.values()].find(note => note.dailyDate === dailyDate && !note.deletedAt)
      if (existing) return existing
      const requestedTemplateId = input.templateId ?? (this.settings.newNoteTemplateId === 'system.blank' ? 'system.daily' : this.settings.newNoteTemplateId)
      const template = this.templates.get(requestedTemplateId)
        ?? vaultSystemTemplate('system.daily')!
      const instantiated = instantiateVaultTemplate(template, date)
      return this.createNote({
        ...instantiated,
        folderId: this.settings.defaultFolderId,
        templateId: template.id,
        dailyDate,
        idempotencyKey: `${input.idempotencyKey}:create`,
      })
    }) as VaultNoteRecord
  }

  updateNote(input: {id: string; expectedRevision: number; document: VaultStructuredDocument; idempotencyKey: string} & NotePatch) {
    return this.once(input.idempotencyKey, () => {
      const current = this.requireNote(input.id)
      if (current.revision !== input.expectedRevision) throw new VaultNotesError('NOTE_REVISION_CONFLICT', 'Expected revision is stale')
      const document = input.document ?? current.document
      this.requireDocument(document)
      // Never export an old Markdown body after its structured document changes.
      const documentChanged = JSON.stringify(document) !== JSON.stringify(current.document)
      const contentFormat = input.contentFormat ?? (documentChanged && input.canonicalBody === undefined ? 'blocks-v1' : current.contentFormat ?? 'blocks-v1')
      const canonicalBody = input.canonicalBody !== undefined ? input.canonicalBody : documentChanged ? undefined : current.canonicalBody
      this.requireFolder(input.folderId)
      this.requireTags(input.tagIds ?? current.tagIds)
      this.requireProperties(input.properties ?? current.properties?.values ?? [])
      this.requireAttachments(input.attachmentIds ?? current.attachmentIds ?? [])
      this.snapshot(current, 'manual')
      const sensitive = input.sensitive ?? current.sensitive ?? false
      const updated: VaultNoteRecord = {
        ...current,
        title: input.title?.trim() || current.title,
        document: structuredClone(document),
        contentFormat,
        canonicalBody,
        plainTextProjection: plainTextProjection(document),
        folderId: input.folderId ?? current.folderId,
        tagIds: unique(input.tagIds ?? current.tagIds),
        icon: input.icon ?? current.icon,
        coverAttachmentId: input.coverAttachmentId ?? current.coverAttachmentId,
        properties: {version: '1.0.0', values: structuredClone(input.properties ?? current.properties?.values ?? [])},
        attachmentIds: unique(input.attachmentIds ?? current.attachmentIds ?? []),
        sensitive,
        intelligencePolicy: sensitive ? 'localOnly' : input.intelligencePolicy ?? current.intelligencePolicy ?? this.settings.intelligencePreference,
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
      }
      this.notes.set(updated.id, updated)
      this.emit('vault-notes.note.updated', updated)
      return updated
    }) as VaultNoteRecord
  }

  archiveNote(id: string) { return this.patchFlag(id, {archived: true}, 'vault-notes.note.archived') }
  unarchiveNote(id: string) { return this.patchFlag(id, {archived: false}, 'vault-notes.note.unarchived') }
  pinNote(id: string) { return this.patchFlag(id, {pinned: true}, 'vault-notes.note.updated') }
  unpinNote(id: string) { return this.patchFlag(id, {pinned: false}, 'vault-notes.note.updated') }
  favouriteNote(id: string) { return this.patchFlag(id, {favourite: true}, 'vault-notes.note.updated') }
  unfavouriteNote(id: string) { return this.patchFlag(id, {favourite: false}, 'vault-notes.note.updated') }

  moveNote(id: string, folderId?: string) {
    this.requireFolder(folderId)
    return this.patchFlag(id, {folderId}, 'vault-notes.note.updated')
  }

  softDeleteNote(id: string) {
    const current = this.requireNote(id)
    this.snapshot(current, 'manual')
    const updated = {...current, deletedAt: new Date().toISOString(), revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit('vault-notes.note.deleted', updated)
    return updated
  }

  restoreNote(id: string) {
    const current = this.requireNote(id, true)
    this.snapshot(current, 'restore')
    const updated = {...current, deletedAt: undefined, revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit('vault-notes.note.restored', updated)
    return updated
  }

  permanentlyDeleteNote(id: string, confirm: boolean) {
    if (!confirm) throw new VaultNotesError('CONFIRMATION_REQUIRED', 'Permanent deletion requires confirmation')
    const current = this.requireNote(id, true)
    this.notes.delete(id)
    for (const [linkId, link] of this.links) if (link.sourceNoteId === id || link.targetNoteId === id) this.links.delete(linkId)
    for (const [attachmentId, attachment] of this.attachments) if (attachment.noteId === id) this.attachments.delete(attachmentId)
    // Historical versions hold entire document bodies. They must not survive purge.
    for (let index = this.versions.length - 1; index >= 0; index -= 1) {
      if (this.versions[index]?.noteId === id) this.versions.splice(index, 1)
    }
    // Completed create/update/attachment mutations may also cache private note content.
    for (const [key, operation] of this.idempotency) {
      const result = operation.result
      if (result && typeof result === 'object' && (('id' in result && result.id === id) || ('noteId' in result && result.noteId === id))) {
        this.idempotency.delete(key)
      }
    }
    this.emit('vault-notes.note.permanently-deleted', current)
    return {deleted: true, id}
  }

  duplicateNote(id: string, idempotencyKey: string) {
    return this.once(idempotencyKey, () => {
      const source = this.requireNote(id)
      const copy = this.createNote({
        title: `${source.title} copy`,
        document: source.document,
        contentFormat: source.contentFormat,
        canonicalBody: source.canonicalBody,
        folderId: source.folderId,
        tagIds: source.tagIds,
        properties: source.properties?.values,
        sensitive: source.sensitive,
        intelligencePolicy: source.intelligencePolicy,
        idempotencyKey: `${idempotencyKey}:create`,
      })
      this.emit('vault-notes.note.duplicated', copy)
      return copy
    }) as VaultNoteRecord
  }

  createFolder(name: string, parentFolderId?: string) {
    this.requireFolder(parentFolderId)
    const now = new Date().toISOString()
    const folder: VaultFolderRecord = {id: randomUUID(), name: name.trim(), parentFolderId, position: this.folders.size, createdAt: now, updatedAt: now}
    this.folders.set(folder.id, folder)
    return folder
  }

  renameFolder(id: string, name: string) {
    const folder = this.folders.get(id)
    if (!folder) throw new VaultNotesError('FOLDER_NOT_FOUND', 'Folder not found')
    const updated = {...folder, name: name.trim(), updatedAt: new Date().toISOString()}
    this.folders.set(id, updated)
    return updated
  }

  createTag(name: string) {
    const normalizedName = normalizeTag(name)
    if ([...this.tags.values()].some(tag => tag.normalizedName === normalizedName)) throw new VaultNotesError('TAG_ALREADY_EXISTS', 'Tag already exists')
    const now = new Date().toISOString()
    const tag: VaultTagRecord = {id: randomUUID(), name: name.trim(), normalizedName, createdAt: now, updatedAt: now}
    this.tags.set(tag.id, tag)
    return tag
  }

  assignTag(noteId: string, tagId: string) {
    const current = this.requireNote(noteId)
    if (!this.tags.has(tagId)) throw new VaultNotesError('TAG_NOT_FOUND', 'Tag not found')
    return this.patchFlag(noteId, {tagIds: unique([...current.tagIds, tagId])}, 'vault-notes.note.updated')
  }

  removeTag(noteId: string, tagId: string) {
    const current = this.requireNote(noteId)
    return this.patchFlag(noteId, {tagIds: current.tagIds.filter(id => id !== tagId)}, 'vault-notes.note.updated')
  }

  linkNotes(sourceNoteId: string, targetNoteId: string, linkType: VaultNoteLinkRecord['linkType'] = 'internal') {
    if (sourceNoteId === targetNoteId) throw new VaultNotesError('INVALID_NOTE_LINK', 'A note cannot link to itself')
    this.requireNote(sourceNoteId)
    this.requireNote(targetNoteId)
    const existing = [...this.links.values()].find(link => link.sourceNoteId === sourceNoteId && link.targetNoteId === targetNoteId && link.linkType === linkType)
    if (existing) return existing
    const link: VaultNoteLinkRecord = {id: randomUUID(), sourceNoteId, targetNoteId, linkType, createdAt: new Date().toISOString()}
    this.links.set(link.id, link)
    return link
  }

  backlinks(noteId: string, cursor = 0, limit = 50) {
    this.requireNote(noteId, true)
    const items = [...this.links.values()].filter(link => link.targetNoteId === noteId).slice(cursor, cursor + limit)
    return {items, nextCursor: cursor + limit < [...this.links.values()].filter(link => link.targetNoteId === noteId).length ? String(cursor + limit) : null}
  }

  relatedNotes(noteId: string, limit = 10) {
    const note = this.requireNote(noteId)
    const linked = new Set([...this.links.values()].filter(link => link.sourceNoteId === noteId || link.targetNoteId === noteId).flatMap(link => [link.sourceNoteId, link.targetNoteId]))
    linked.delete(noteId)
    return [...this.notes.values()]
      .filter(candidate => candidate.id !== noteId && !candidate.deletedAt)
      .map(candidate => ({
        note: candidate,
        score: intersection(note.tagIds, candidate.tagIds).length * 4 + (note.folderId && note.folderId === candidate.folderId ? 2 : 0) + (linked.has(candidate.id) ? 8 : 0),
      }))
      .filter(item => item.score > 0)
      .sort((left, right) => right.score - left.score || right.note.updatedAt.localeCompare(left.note.updatedAt))
      .slice(0, limit)
  }

  graphData(includeArchived = false): VaultGraphData {
    const notes = [...this.notes.values()].filter(note => !note.deletedAt && (includeArchived || !note.archived))
    const ids = new Set(notes.map(note => note.id))
    return {
      nodes: notes.map(note => ({id: note.id, title: note.title, folderId: note.folderId, tagIds: note.tagIds, archived: note.archived})),
      edges: [...this.links.values()].filter(link => ids.has(link.sourceNoteId) && ids.has(link.targetNoteId)).map(link => ({...link})),
    }
  }

  attach(input: {noteId: string; assetId: string; name: string; mimeType: string; size: number; kind?: VaultAttachmentKind; durationMs?: number; width?: number; height?: number; checksumSha256?: string; idempotencyKey: string}) {
    return this.once(input.idempotencyKey, () => {
      const note = this.requireNote(input.noteId)
      validateAttachmentInput(input)
      const attachment: VaultAttachmentRecord = {
        id: randomUUID(),
        noteId: input.noteId,
        assetId: input.assetId,
        name: input.name,
        mimeType: input.mimeType,
        size: input.size,
        kind: input.kind ?? attachmentKind(input.mimeType),
        createdAt: new Date().toISOString(),
        durationMs: input.durationMs,
        width: input.width,
        height: input.height,
        checksumSha256: input.checksumSha256,
      }
      this.attachments.set(attachment.id, attachment)
      this.snapshot(note, 'manual')
      this.notes.set(note.id, {...note, attachmentIds: unique([...(note.attachmentIds ?? []), attachment.id]), revision: note.revision + 1, updatedAt: new Date().toISOString()})
      return attachment
    }) as VaultAttachmentRecord
  }

  removeAttachment(noteId: string, attachmentId: string) {
    const note = this.requireNote(noteId)
    const attachment = this.attachments.get(attachmentId)
    if (!attachment || attachment.noteId !== noteId) throw new VaultNotesError('ATTACHMENT_NOT_FOUND', 'Attachment not found')
    this.snapshot(note, 'manual')
    this.attachments.delete(attachmentId)
    const updated = {...note, attachmentIds: (note.attachmentIds ?? []).filter(id => id !== attachmentId), coverAttachmentId: note.coverAttachmentId === attachmentId ? undefined : note.coverAttachmentId}
    this.notes.set(noteId, updated)
    return updated
  }

  restoreRevision(input: {noteId: string; revision: number; expectedCurrentRevision: number; idempotencyKey: string}) {
    return this.once(input.idempotencyKey, () => {
      const current = this.requireNote(input.noteId, true)
      if (current.revision !== input.expectedCurrentRevision) throw new VaultNotesError('NOTE_REVISION_CONFLICT', 'Expected revision is stale')
      const version = this.versions.find(candidate => candidate.noteId === input.noteId && candidate.revision === input.revision)
      if (!version) throw new VaultNotesError('NOTE_VERSION_NOT_FOUND', 'Note version not found')
      const restoredAttachmentIds = unique(version.attachmentIds ?? [])
      for (const attachmentId of restoredAttachmentIds) {
        const attachment = this.attachments.get(attachmentId)
        if (!attachment || attachment.noteId !== current.id) throw new VaultNotesError('NOTE_VERSION_ATTACHMENT_MISSING', 'Revision references a missing attachment')
      }
      this.snapshot(current, 'restore')
      const restored: VaultNoteRecord = {
        ...current,
        title: version.title,
        document: structuredClone(version.document),
        contentFormat: version.contentFormat ?? 'blocks-v1',
        canonicalBody: version.canonicalBody,
        plainTextProjection: version.plainTextProjection ?? plainTextProjection(version.document),
        properties: structuredClone(version.properties ?? {version: '1.0.0', values: []}),
        attachmentIds: restoredAttachmentIds,
        sensitive: version.sensitive ?? false,
        intelligencePolicy: version.sensitive ? 'localOnly' : current.intelligencePolicy,
        deletedAt: undefined,
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
      }
      this.notes.set(restored.id, restored)
      this.emit('vault-notes.note.updated', restored)
      return restored
    }) as VaultNoteRecord
  }

  search(query: string, options: {includeArchived?: boolean; includeDeleted?: boolean; includeSensitive?: boolean} = {}) {
    return this.queryNotes({query, includeDeleted: options.includeDeleted, includeSensitive: options.includeSensitive, filters: {archived: options.includeArchived ? undefined : false}, limit: 100})
      .items
      .map(note => projectNoteForSearch(note, this.context.accountId, note.folderId ? this.folders.get(note.folderId) : undefined, [...this.attachments.values()], {includeSensitiveBody: options.includeSensitive ?? false}))
      .filter(entry => !entry.sensitive || options.includeSensitive)
  }

  queryNotes(input: VaultNoteSearchQuery = {}) {
    const limit = Math.min(Math.max(input.limit ?? 25, 1), 1000)
    const cursor = parseCursor(input.cursor)
    const normalized = input.query?.trim().toLowerCase() ?? ''
    const filters = input.filters ?? {}
    const direction = input.direction === 'asc' ? 1 : -1
    const sort = input.sort ?? 'updatedAt'
    const notes = [...this.notes.values()].filter(note => {
      if (!input.includeDeleted && note.deletedAt) return false
      if (!input.includeSensitive && note.sensitive) return false
      if (filters.archived !== undefined && note.archived !== filters.archived) return false
      if (filters.pinned !== undefined && note.pinned !== filters.pinned) return false
      if (filters.favourite !== undefined && note.favourite !== filters.favourite) return false
      if (filters.sensitive !== undefined && Boolean(note.sensitive) !== filters.sensitive) return false
      if (filters.folderId !== undefined && (note.folderId ?? null) !== filters.folderId) return false
      if (filters.hasAttachment !== undefined && Boolean(note.attachmentIds?.length) !== filters.hasAttachment) return false
      if (filters.tagIds?.length && !filters.tagIds.every(tagId => note.tagIds.includes(tagId))) return false
      if (filters.createdFrom && note.createdAt < filters.createdFrom) return false
      if (filters.createdTo && note.createdAt > filters.createdTo) return false
      if (filters.updatedFrom && note.updatedAt < filters.updatedFrom) return false
      if (filters.updatedTo && note.updatedAt > filters.updatedTo) return false
      if (filters.property) {
        const property = note.properties?.values.find(candidate => candidate.id === filters.property!.id)
        if (!property || (filters.property.value !== undefined && JSON.stringify(property.value) !== JSON.stringify(filters.property.value))) return false
      }
      if (!normalized) return true
      const folder = note.folderId ? this.folders.get(note.folderId)?.name ?? '' : ''
      const tags = note.tagIds.map(tagId => this.tags.get(tagId)?.name ?? tagId).join(' ')
      const properties = (note.properties?.values ?? []).map(property => `${property.name} ${Array.isArray(property.value) ? property.value.join(' ') : String(property.value ?? '')}`).join(' ')
      const attachments = (note.attachmentIds ?? []).map(id => this.attachments.get(id)?.name ?? '').join(' ')
      return `${note.title} ${note.plainTextProjection} ${tags} ${folder} ${properties} ${attachments}`.toLowerCase().includes(normalized)
    }).sort((left, right) => String(left[sort]).localeCompare(String(right[sort])) * direction)
    return {items: notes.slice(cursor, cursor + limit), nextCursor: cursor + limit < notes.length ? String(cursor + limit) : null, total: notes.length}
  }

  saveSearch(input: {name: string; query?: string; filters?: VaultNoteSearchQuery['filters']; sort?: VaultNoteSearchQuery['sort']}) {
    const now = new Date().toISOString()
    const saved: VaultSavedSearchRecord = {id: randomUUID(), name: input.name.trim(), query: input.query ?? '', filters: input.filters ?? {}, sort: input.sort ?? 'updatedAt', createdAt: now, updatedAt: now}
    this.savedSearches.set(saved.id, saved)
    return saved
  }

  export(format: VaultExportFormat) {
    try {
      const result = exportVaultNotes({
        notes: [...this.notes.values()],
        folders: [...this.folders.values()],
        tags: [...this.tags.values()],
        links: [...this.links.values()],
        attachments: [...this.attachments.values()],
        templates: [...this.templates.values()],
        savedSearches: [...this.savedSearches.values()],
        settings: {...this.settings},
        format,
      })
      for (const note of this.notes.values()) this.emit('vault-notes.note.exported', note)
      return result
    } catch (error) {
      this.exportFailures += 1
      throw error
    }
  }

  configure(input: Record<string, unknown>) {
    const result = validateVaultNotesSettings(input)
    if (!result.valid || !result.value) throw new VaultNotesError('INVALID_SETTINGS', result.issues.join(', '))
    this.settings = result.value
    return this.settings
  }

  listNotes(includeDeleted = false) { return [...this.notes.values()].filter(note => includeDeleted || !note.deletedAt) }
  listFolders() { return [...this.folders.values()] }
  listTags() { return [...this.tags.values()] }
  listLinks() { return [...this.links.values()] }
  listAttachments(noteId?: string) { return [...this.attachments.values()].filter(attachment => !noteId || attachment.noteId === noteId) }
  listTemplates() { return [...this.templates.values()] }
  listSavedSearches() { return [...this.savedSearches.values()] }
  listVersions(noteId?: string, cursor = 0, limit = 50) { return this.versions.filter(version => !noteId || version.noteId === noteId).sort((a, b) => b.revision - a.revision).slice(cursor, cursor + limit) }
  listEvents() { return [...this.events] }
  counters() { return {failedActions: this.failedActions, exportFailures: this.exportFailures} }

  private patchFlag(id: string, patch: Partial<VaultNoteRecord>, eventType: VaultNotesEventType) {
    const current = this.requireNote(id, true)
    this.snapshot(current, 'manual')
    const updated = {...current, ...patch, revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit(eventType, updated)
    return updated
  }

  private snapshot(note: VaultNoteRecord, changeSource: VaultNoteVersionRecord['changeSource']) {
    this.versions.push({
      id: randomUUID(),
      noteId: note.id,
      revision: note.revision,
      title: note.title,
      document: structuredClone(note.document),
      contentFormat: note.contentFormat,
      canonicalBody: note.canonicalBody,
      plainTextProjection: note.plainTextProjection,
      properties: structuredClone(note.properties ?? {version: '1.0.0', values: []}),
      attachmentIds: [...(note.attachmentIds ?? [])],
      sensitive: note.sensitive,
      createdAt: new Date().toISOString(),
      createdBy: this.context.actorId,
      changeSource,
    })
    const noteVersions = this.versions.filter(version => version.noteId === note.id).sort((a, b) => b.revision - a.revision)
    for (const obsolete of noteVersions.slice(this.retention)) this.versions.splice(this.versions.findIndex(version => version.id === obsolete.id), 1)
  }

  private requireNote(id: string, includeDeleted = false) {
    const note = this.notes.get(id)
    if (!note || (!includeDeleted && note.deletedAt)) throw new VaultNotesError('NOTE_NOT_FOUND', 'Note not found')
    return note
  }

  private requireFolder(id?: string) {
    if (id && !this.folders.has(id)) throw new VaultNotesError('FOLDER_NOT_FOUND', 'Folder not found')
  }

  private requireTags(ids: string[]) {
    for (const id of ids) if (!/^[A-Za-z0-9._:-]{1,120}$/.test(id)) throw new VaultNotesError('INVALID_TAG_REFERENCE', 'Tag reference is invalid')
  }

  private requireAttachments(ids: string[]) {
    for (const id of ids) if (!/^[A-Za-z0-9._:-]{1,180}$/.test(id)) throw new VaultNotesError('INVALID_ATTACHMENT_REFERENCE', 'Attachment reference is invalid')
  }

  private requireProperties(properties: VaultNoteProperty[]) {
    const ids = new Set<string>()
    for (const property of properties) {
      if (!/^[A-Za-z0-9._:-]{1,120}$/.test(property.id) || ids.has(property.id) || !property.name.trim()) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'Invalid or duplicate note property')
      ids.add(property.id)
      if (property.type === 'number' && typeof property.value !== 'number' && property.value !== null) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'Number property requires a numeric value')
      if (property.type === 'boolean' && typeof property.value !== 'boolean' && property.value !== null) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'Boolean property requires a boolean value')
      if (property.type === 'date' && typeof property.value !== 'string' && property.value !== null) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'Date property requires an ISO date string')
      if (property.type === 'dateTime' && typeof property.value !== 'string' && property.value !== null) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'DateTime property requires an ISO datetime string')
      if (['multiSelect', 'tags'].includes(property.type) && !Array.isArray(property.value) && property.value !== null) throw new VaultNotesError('INVALID_NOTE_PROPERTY', 'Multi-value property requires an array')
    }
  }

  private requireDocument(document: VaultStructuredDocument) {
    const result = validateStructuredDocument(document)
    if (!result.valid) throw new VaultNotesError('INVALID_DOCUMENT', result.issues.join(', '))
  }

  private emit(type: VaultNotesEventType, note: VaultNoteRecord) { this.events.push(noteEvent(type, note, this.context)) }

  private once(key: string, run: () => unknown) {
    if (!key) throw new VaultNotesError('IDEMPOTENCY_REQUIRED', 'Idempotency key is required')
    const existing = this.idempotency.get(key)
    if (existing) return existing.result
    try {
      const result = run()
      this.idempotency.set(key, {status: 'completed', result})
      return result
    } catch (error) {
      this.failedActions += 1
      throw error
    }
  }
}

function normalizeTag(value: string) { return value.trim().toLowerCase().replace(/\s+/g, '-') }
function unique(values: string[]) { return Array.from(new Set(values)) }
function intersection(left: string[], right: string[]) { const set = new Set(right); return left.filter(value => set.has(value)) }
function parseCursor(value?: string) { const parsed = Number(value ?? 0); if (!Number.isInteger(parsed) || parsed < 0) throw new VaultNotesError('INVALID_CURSOR', 'Invalid cursor'); return parsed }

function attachmentKind(mimeType: string): VaultAttachmentKind {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType === 'application/pdf') return 'pdf'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (mimeType.startsWith('text/') || mimeType.includes('document')) return 'document'
  return 'file'
}

function validateAttachmentInput(input: {assetId: string; name: string; mimeType: string; size: number; durationMs?: number; checksumSha256?: string}) {
  if (!/^[A-Za-z0-9._:-]{1,180}$/.test(input.assetId)) throw new VaultNotesError('INVALID_ATTACHMENT_ASSET', 'Attachment asset reference is invalid')
  if (!input.name.trim() || input.name.length > 255 || input.name.includes('/') || input.name.includes('\\')) throw new VaultNotesError('INVALID_ATTACHMENT_NAME', 'Attachment name is invalid')
  if (!/^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(input.mimeType)) throw new VaultNotesError('INVALID_ATTACHMENT_MIME', 'Attachment MIME type is invalid')
  if (!Number.isInteger(input.size) || input.size < 0 || input.size > 1_000_000_000) throw new VaultNotesError('INVALID_ATTACHMENT_SIZE', 'Attachment size is invalid')
  if (input.durationMs !== undefined && (!Number.isInteger(input.durationMs) || input.durationMs < 0 || input.durationMs > 86_400_000)) throw new VaultNotesError('INVALID_ATTACHMENT_DURATION', 'Attachment duration is invalid')
  if (input.checksumSha256 !== undefined && !/^[a-f0-9]{64}$/.test(input.checksumSha256)) throw new VaultNotesError('INVALID_ATTACHMENT_CHECKSUM', 'Attachment checksum is invalid')
}

