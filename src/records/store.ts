import {randomUUID} from 'node:crypto'
import {plainTextProjection, validateStructuredDocument} from '../document/index.js'
import {noteEvent, type VaultNotesEventType} from '../events/index.js'
import {exportVaultNotes} from '../export/index.js'
import {projectNoteForSearch} from '../search/index.js'
import {validateVaultNotesSettings, vaultNotesDefaultSettings, type VaultNotesSettings} from '../settings/index.js'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  type VaultExportFormat,
  type VaultFolderRecord,
  type VaultModuleEvent,
  type VaultNoteRecord,
  type VaultNoteVersionRecord,
  type VaultStructuredDocument,
  type VaultTagRecord,
} from '../types.js'

type ActorContext = {accountId: string; actorId: string; requestId: string; correlationId: string}
type StoredIdempotency = {status: 'completed'; result: unknown}

export class VaultNotesError extends Error {
  constructor(readonly code: string, message: string) {
    super(message)
  }
}

export class VaultNotesStore {
  private readonly notes = new Map<string, VaultNoteRecord>()
  private readonly folders = new Map<string, VaultFolderRecord>()
  private readonly tags = new Map<string, VaultTagRecord>()
  private readonly versions: VaultNoteVersionRecord[] = []
  private readonly events: VaultModuleEvent[] = []
  private readonly idempotency = new Map<string, StoredIdempotency>()
  private settings: VaultNotesSettings = vaultNotesDefaultSettings
  private failedActions = 0
  private exportFailures = 0

  constructor(private readonly context: ActorContext, private readonly retention = vaultNotesDefaultSettings.versionHistoryRetention) {}

  createNote(input: {title: string; document: VaultStructuredDocument; folderId?: string; tagIds?: string[]; idempotencyKey: string}) {
    return this.once(input.idempotencyKey, () => {
      this.requireDocument(input.document)
      const now = new Date().toISOString()
      const note: VaultNoteRecord = {
        id: randomUUID(),
        title: input.title.trim() || 'Untitled',
        document: input.document,
        plainTextProjection: plainTextProjection(input.document),
        folderId: input.folderId,
        tagIds: input.tagIds ?? [],
        pinned: false,
        favourite: false,
        archived: false,
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

  updateNote(input: {id: string; expectedRevision: number; document: VaultStructuredDocument; title?: string; idempotencyKey: string}) {
    return this.once(input.idempotencyKey, () => {
      const current = this.requireNote(input.id)
      if (current.revision !== input.expectedRevision) throw new VaultNotesError('NOTE_REVISION_CONFLICT', 'Expected revision is stale')
      this.requireDocument(input.document)
      this.snapshot(current, 'manual')
      const updated: VaultNoteRecord = {
        ...current,
        title: input.title?.trim() || current.title,
        document: input.document,
        plainTextProjection: plainTextProjection(input.document),
        revision: current.revision + 1,
        updatedAt: new Date().toISOString(),
      }
      this.notes.set(updated.id, updated)
      this.emit('vault-notes.note.updated', updated)
      return updated
    }) as VaultNoteRecord
  }

  archiveNote(id: string) {
    return this.patchFlag(id, {archived: true}, 'vault-notes.note.archived')
  }

  unarchiveNote(id: string) {
    return this.patchFlag(id, {archived: false}, 'vault-notes.note.unarchived')
  }

  pinNote(id: string) {
    return this.patchFlag(id, {pinned: true}, 'vault-notes.note.updated')
  }

  unpinNote(id: string) {
    return this.patchFlag(id, {pinned: false}, 'vault-notes.note.updated')
  }

  favouriteNote(id: string) {
    return this.patchFlag(id, {favourite: true}, 'vault-notes.note.updated')
  }

  unfavouriteNote(id: string) {
    return this.patchFlag(id, {favourite: false}, 'vault-notes.note.updated')
  }

  moveNote(id: string, folderId?: string) {
    return this.patchFlag(id, {folderId}, 'vault-notes.note.updated')
  }

  softDeleteNote(id: string) {
    const current = this.requireNote(id)
    const updated = {...current, deletedAt: new Date().toISOString(), revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit('vault-notes.note.deleted', updated)
    return updated
  }

  restoreNote(id: string) {
    const current = this.requireNote(id, true)
    const updated = {...current, deletedAt: undefined, revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit('vault-notes.note.restored', updated)
    return updated
  }

  permanentlyDeleteNote(id: string, confirm: boolean) {
    if (!confirm) throw new VaultNotesError('CONFIRMATION_REQUIRED', 'Permanent deletion requires confirmation')
    const current = this.requireNote(id, true)
    this.notes.delete(id)
    this.emit('vault-notes.note.permanently-deleted', current)
    return {deleted: true, id}
  }

  duplicateNote(id: string, idempotencyKey: string) {
    return this.once(idempotencyKey, () => {
      const source = this.requireNote(id)
      const copy = this.createNote({title: `${source.title} copy`, document: source.document, folderId: source.folderId, tagIds: source.tagIds, idempotencyKey: `${idempotencyKey}:create`})
      this.emit('vault-notes.note.duplicated', copy)
      return copy
    }) as VaultNoteRecord
  }

  createFolder(name: string, parentFolderId?: string) {
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
    return this.patchFlag(noteId, {tagIds: Array.from(new Set([...current.tagIds, tagId]))}, 'vault-notes.note.updated')
  }

  removeTag(noteId: string, tagId: string) {
    const current = this.requireNote(noteId)
    return this.patchFlag(noteId, {tagIds: current.tagIds.filter(id => id !== tagId)}, 'vault-notes.note.updated')
  }

  search(query: string, options: {includeArchived?: boolean; includeDeleted?: boolean} = {}) {
    const normalized = query.trim().toLowerCase()
    return [...this.notes.values()].filter(note => {
      if (!options.includeDeleted && note.deletedAt) return false
      if (!options.includeArchived && note.archived) return false
      return `${note.title} ${note.plainTextProjection} ${note.tagIds.join(' ')}`.toLowerCase().includes(normalized)
    }).map(note => projectNoteForSearch(note, this.context.accountId, note.folderId ? this.folders.get(note.folderId) : undefined))
  }

  export(format: VaultExportFormat) {
    try {
      const result = exportVaultNotes({notes: [...this.notes.values()], folders: [...this.folders.values()], tags: [...this.tags.values()], format})
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

  listNotes(includeDeleted = false) {
    return [...this.notes.values()].filter(note => includeDeleted || !note.deletedAt)
  }

  listFolders() {
    return [...this.folders.values()]
  }

  listTags() {
    return [...this.tags.values()]
  }

  listVersions() {
    return [...this.versions]
  }

  listEvents() {
    return [...this.events]
  }

  counters() {
    return {failedActions: this.failedActions, exportFailures: this.exportFailures}
  }

  private patchFlag(id: string, patch: Partial<VaultNoteRecord>, eventType: VaultNotesEventType) {
    const current = this.requireNote(id, true)
    const updated = {...current, ...patch, revision: current.revision + 1, updatedAt: new Date().toISOString()}
    this.notes.set(id, updated)
    this.emit(eventType, updated)
    return updated
  }

  private snapshot(note: VaultNoteRecord, changeSource: VaultNoteVersionRecord['changeSource']) {
    this.versions.push({id: randomUUID(), noteId: note.id, revision: note.revision, title: note.title, document: note.document, createdAt: new Date().toISOString(), createdBy: this.context.actorId, changeSource})
    while (this.versions.length > this.retention) this.versions.shift()
  }

  private requireNote(id: string, includeDeleted = false) {
    const note = this.notes.get(id)
    if (!note || (!includeDeleted && note.deletedAt)) throw new VaultNotesError('NOTE_NOT_FOUND', 'Note not found')
    return note
  }

  private requireDocument(document: VaultStructuredDocument) {
    const result = validateStructuredDocument(document)
    if (!result.valid) throw new VaultNotesError('INVALID_DOCUMENT', result.issues.join(', '))
  }

  private emit(type: VaultNotesEventType, note: VaultNoteRecord) {
    this.events.push(noteEvent(type, note, this.context))
  }

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

function normalizeTag(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '-')
}
