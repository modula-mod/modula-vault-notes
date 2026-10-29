import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, it} from 'vitest'
import {validateModulaModuleManifest} from '@modula/module-validator'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  VAULT_NOTES_MODULE_ID,
  VAULT_NOTES_MODULE_VERSION,
  VAULT_NOTES_STANDARD_VERSION,
  VAULT_NOTES_EXTENSION_POINTS,
  VAULT_NOTES_PRODUCT_CAPABILITIES,
  VaultNotesError,
  VaultNotesStore,
  assertLocalIntelligenceAvailable,
  createVaultIntelligenceRequest,
  createDocumentFromText,
  importVaultBackup,
  importVaultText,
  renderBlockPreview,
  validateStructuredDocument,
  vaultNotesDiagnostics,
} from '../src/index.js'

const root = new URL('..', import.meta.url).pathname

describe('Vault Notes Standard 2.1 extensible module manifest', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'modula.module.json'), 'utf8'))

  it('validates through the external Standard 2.1 validator', () => {
    const result = validateModulaModuleManifest(manifest)
    expect(result.valid, result.issues.map(issue => `${issue.code} ${issue.path}`).join('\n')).toBe(true)
  })

  it('declares stable identity and four independent versions', () => {
    expect(manifest.id).toBe(VAULT_NOTES_MODULE_ID)
    expect(manifest.standardVersion).toBe(VAULT_NOTES_STANDARD_VERSION)
    expect(manifest.moduleVersion).toBe(VAULT_NOTES_MODULE_VERSION)
    expect(manifest.manifestSchemaVersion).toBe('2.1.0')
    expect(manifest.dataSchemaVersion).toBe(VAULT_NOTES_DATA_SCHEMA_VERSION)
  })

  it('declares required records, views, actions, functions, permissions, events, settings and search', () => {
    expect(manifest.records.map((record: any) => record.id)).toEqual(expect.arrayContaining([
      'digital.modula.vault-notes.record.note',
      'digital.modula.vault-notes.record.folder',
      'digital.modula.vault-notes.record.tag',
      'digital.modula.vault-notes.record.note-link',
      'digital.modula.vault-notes.record.note-version',
      'digital.modula.vault-notes.record.saved-source',
      'digital.modula.vault-notes.record.attachment',
      'digital.modula.vault-notes.record.template',
      'digital.modula.vault-notes.record.saved-search',
    ]))
    expect(manifest.views).toHaveLength(14)
    expect(manifest.actions).toHaveLength(31)
    expect(manifest.functions).toHaveLength(31)
    expect(manifest.events.map((event: any) => event.type)).toEqual(expect.arrayContaining([
      'vault-notes.note.created',
      'vault-notes.note.updated',
      'vault-notes.note.deleted',
      'vault-notes.note.restored',
      'vault-notes.note.permanently-deleted',
      'vault-notes.folder.created',
    ]))
    expect(manifest.settings[0].defaults.defaultExportFormat).toBe('json')
    expect(manifest.search.map((item: any) => item.projectionHandler.projection.entityType)).toEqual(['note', 'vault-folder'])
    expect(manifest.ai).toEqual([])
    expect(manifest.permissions.some((permission: any) => permission.id.startsWith('ai.'))).toBe(false)
    expect(manifest.extensionProduct).toMatchObject({kind: 'module', targets: [], contributions: []})
    expect(manifest.extensionProduct.extensionPoints.map((point: any) => point.id)).toEqual(VAULT_NOTES_EXTENSION_POINTS.map(point => point.id))
    expect(VAULT_NOTES_PRODUCT_CAPABILITIES).toEqual(expect.arrayContaining(['notes.read', 'notes.editor.contribute', 'notes.events.subscribe']))
  })
})

describe('structured document contract', () => {
  it('accepts supported blocks and produces a plain-text projection', () => {
    const document = createDocumentFromText('Alpha\n\nBeta')
    const result = validateStructuredDocument(document)
    expect(result.valid).toBe(true)
  })

  it('rejects unsafe and unknown blocks without crashing render preview', () => {
    const bad = {schemaVersion: '1.0.0', blocks: [{id: 'bad', type: 'link-preview', url: 'javascript:alert(1)'}]}
    expect(validateStructuredDocument(bad).issues).toContain('BLOCK_0_UNSAFE_URL')
    expect(renderBlockPreview({id: 'future', type: 'future-widget'})).toEqual({kind: 'unsupported', text: 'Unsupported content'})
  })

  it('supports portable tables, note references, audio references, and underline without allowing paths or scripts', () => {
    const document = {
      schemaVersion: '1.0.0' as const,
      blocks: [
        {id: 'table-1', type: 'table' as const, columns: ['Name', 'Status'], rows: [['Vault', 'Ready']]},
        {id: 'note-ref-1', type: 'note-reference' as const, targetNoteId: 'note-2', title: 'Related note'},
        {id: 'audio-1', type: 'audio-reference' as const, attachmentId: 'attachment-1', mimeType: 'audio/mpeg', durationMs: 1000},
        {id: 'paragraph-1', type: 'paragraph' as const, inlines: [{text: 'Important', marks: [{type: 'underline' as const}]}]},
      ],
    }
    expect(validateStructuredDocument(document).valid).toBe(true)
    expect(validateStructuredDocument({schemaVersion: '1.0.0', blocks: [{id: 'audio-2', type: 'audio-reference', sourceRef: '/private/file.wav'}]}).valid).toBe(false)
    expect(validateStructuredDocument({schemaVersion: '1.0.0', blocks: [{id: 'link-1', type: 'link-preview', url: 'javascript:alert(1)'}]}).valid).toBe(false)
  })
})

describe('Vault Notes runtime helpers', () => {
  it('supports create, autosave revision updates, stale rejection, search, delete, restore and export', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-1', correlationId: 'corr-1'})
    const document = createDocumentFromText('First note body')
    const note = store.createNote({title: 'First', document, tagIds: ['alpha'], idempotencyKey: 'create-1'})
    expect(note.revision).toBe(1)

    const updated = store.updateNote({id: note.id, expectedRevision: 1, title: 'First updated', document: createDocumentFromText('Updated body'), idempotencyKey: 'save-1'})
    expect(updated.revision).toBe(2)
    expect(() => store.updateNote({id: note.id, expectedRevision: 1, document, idempotencyKey: 'save-stale'})).toThrow(VaultNotesError)

    expect(store.search('Updated')).toHaveLength(1)
    store.archiveNote(note.id)
    expect(store.search('Updated')).toHaveLength(0)
    store.unarchiveNote(note.id)
    const deleted = store.softDeleteNote(note.id)
    expect(deleted.deletedAt).toBeTruthy()
    expect(store.search('Updated')).toHaveLength(0)
    store.restoreNote(note.id)
    expect(store.search('Updated')).toHaveLength(1)

    const exported = store.export('json')
    expect(exported.manifest.moduleId).toBe(VAULT_NOTES_MODULE_ID)
    expect(exported.manifest.recordCount).toBeGreaterThan(0)
    expect(JSON.stringify(store.listEvents())).not.toContain('Updated body')
  })

  it('creates one daily note from module data and keeps retries duplicate-safe', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-daily', correlationId: 'corr-daily'})
    const date = new Date('2026-10-08T12:00:00.000Z')
    const first = store.createDailyNote({date, idempotencyKey: 'daily-1'})
    const replay = store.createDailyNote({date, idempotencyKey: 'daily-1'})
    const independentRetry = store.createDailyNote({date, idempotencyKey: 'daily-2'})
    expect(first.id).toBe(replay.id)
    expect(first.id).toBe(independentRetry.id)
    expect(first.templateId).toBe('system.daily')
    expect(first.dailyDate).toBe('2026-10-08')
    expect(store.listTemplates().map(template => template.id)).toEqual(expect.arrayContaining(['system.blank', 'system.meeting', 'system.research', 'system.checklist']))
  })

  it('supports typed properties, saved searches, attachment metadata, and rich filters', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-structured', correlationId: 'corr-structured'})
    const folder = store.createFolder('Research')
    const tag = store.createTag('Reference')
    const note = store.createNote({
      title: 'Platform research',
      document: createDocumentFromText('Backlinks and sync'),
      folderId: folder.id,
      tagIds: [tag.id],
      properties: [{id: 'status', name: 'Status', type: 'singleSelect', value: 'active'}],
      idempotencyKey: 'structured-1',
    })
    store.pinNote(note.id)
    const attachment = store.attach({noteId: note.id, assetId: 'asset-pdf-1', name: 'architecture.pdf', mimeType: 'application/pdf', size: 4096, checksumSha256: 'a'.repeat(64), idempotencyKey: 'attach-structured'})
    expect(attachment.kind).toBe('pdf')
    expect(store.queryNotes({query: 'architecture.pdf', filters: {folderId: folder.id, tagIds: [tag.id], pinned: true, hasAttachment: true, property: {id: 'status', value: 'active'}}, includeSensitive: true}).items[0]?.id).toBe(note.id)
    expect(store.saveSearch({name: 'Pinned research', filters: {pinned: true, folderId: folder.id}}).name).toBe('Pinned research')
    expect(() => store.attach({noteId: note.id, assetId: '/private/file', name: '../secret.pdf', mimeType: 'application/pdf', size: 1, idempotencyKey: 'attach-bad'})).toThrow(VaultNotesError)
  })

  it('keeps stable links, backlinks, deterministic related notes, and graph data', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-graph', correlationId: 'corr-graph'})
    const tag = store.createTag('Project')
    const first = store.createNote({title: 'Project Alpha', document: createDocumentFromText('Alpha'), tagIds: [tag.id], idempotencyKey: 'graph-1'})
    const second = store.createNote({title: 'Project Beta', document: createDocumentFromText('Beta'), tagIds: [tag.id], idempotencyKey: 'graph-2'})
    const link = store.linkNotes(first.id, second.id)
    expect(store.linkNotes(first.id, second.id).id).toBe(link.id)
    expect(store.backlinks(second.id).items.map(item => item.sourceNoteId)).toEqual([first.id])
    expect(store.relatedNotes(first.id)[0]).toMatchObject({note: {id: second.id}})
    expect(store.graphData()).toMatchObject({nodes: expect.arrayContaining([expect.objectContaining({id: first.id}), expect.objectContaining({id: second.id})]), edges: [expect.objectContaining({sourceNoteId: first.id, targetNoteId: second.id})]})
  })

  it('restores history by creating a new revision and preserves intervening checkpoints', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-history', correlationId: 'corr-history'})
    const note = store.createNote({title: 'Revision one', document: createDocumentFromText('One'), idempotencyKey: 'history-create'})
    const second = store.updateNote({id: note.id, expectedRevision: 1, title: 'Revision two', document: createDocumentFromText('Two'), idempotencyKey: 'history-2'})
    const third = store.updateNote({id: note.id, expectedRevision: second.revision, title: 'Revision three', document: createDocumentFromText('Three'), idempotencyKey: 'history-3'})
    const restored = store.restoreRevision({noteId: note.id, revision: 1, expectedCurrentRevision: third.revision, idempotencyKey: 'history-restore'})
    expect(restored).toMatchObject({title: 'Revision one', revision: 4})
    expect(store.listVersions(note.id).map(version => version.revision)).toEqual(expect.arrayContaining([1, 2, 3]))
    expect(store.listVersions(note.id).find(version => version.revision === 3)?.changeSource).toBe('restore')
  })

  it('migrates 1.8 notes, imports portable text, and round-trips the versioned backup without data loss', () => {
    const imported = importVaultText({format: 'markdown', id: 'legacy-note', title: 'Legacy', body: '# Legacy\n\n**Portable** body', importedAt: '2026-10-08T00:00:00.000Z'})
    expect(imported).toMatchObject({id: 'legacy-note', contentFormat: 'markdown-v1', dataSchemaVersion: '1.0.0'})
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-export', correlationId: 'corr-export'})
    store.createNote({title: imported.title, document: imported.document, contentFormat: imported.contentFormat, canonicalBody: imported.canonicalBody, idempotencyKey: 'import-create'})
    const exported = store.export('json')
    const restored = importVaultBackup(exported.body as string)
    expect(restored.manifest.formatVersion).toBe('2.0.0')
    expect(restored.notes).toHaveLength(1)
    expect(restored.notes[0]?.plainTextProjection).toContain('Portable')
  })

  it('enforces sensitive-note local-only intelligence and search privacy', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-private', correlationId: 'corr-private'})
    const note = store.createNote({title: 'Private strategy', document: createDocumentFromText('Acquisition plan'), sensitive: true, intelligencePolicy: 'preferLocal', idempotencyKey: 'private-create'})
    expect(store.search('Acquisition')).toHaveLength(0)
    expect(store.search('Acquisition', {includeSensitive: true})).toHaveLength(1)
    const request = createVaultIntelligenceRequest(note, 'intelligence.summarize', {text: note.plainTextProjection})
    expect(request.execution).toBe('localOnly')
    expect(() => assertLocalIntelligenceAvailable(request, false)).toThrow('LOCAL_INTELLIGENCE_UNAVAILABLE')
  })

  it('paginates a realistic library without loading every result', () => {
    const store = new VaultNotesStore({accountId: 'acct-scale', actorId: 'actor-scale', requestId: 'req-scale', correlationId: 'corr-scale'})
    for (let index = 0; index < 1000; index += 1) {
      store.createNote({title: `Fixture ${String(index).padStart(4, '0')}`, document: createDocumentFromText(`Body ${index}`), idempotencyKey: `fixture-${index}`})
    }
    const first = store.queryNotes({query: 'Fixture', limit: 100, sort: 'title', direction: 'asc', includeSensitive: true})
    const second = store.queryNotes({query: 'Fixture', cursor: first.nextCursor ?? undefined, limit: 100, sort: 'title', direction: 'asc', includeSensitive: true})
    expect(first).toMatchObject({total: 1000, nextCursor: '100'})
    expect(second.items[0]?.title).toBe('Fixture 0100')
  })

  it('requires confirmation before permanent delete and keeps diagnostics content-free', () => {
    const store = new VaultNotesStore({accountId: 'acct-1', actorId: 'actor-1', requestId: 'req-2', correlationId: 'corr-2'})
    const note = store.createNote({title: 'Delete me', document: createDocumentFromText('Private body'), idempotencyKey: 'create-delete'})
    expect(() => store.permanentlyDeleteNote(note.id, false)).toThrow(VaultNotesError)
    expect(store.permanentlyDeleteNote(note.id, true)).toEqual({deleted: true, id: note.id})
    const diagnostics = vaultNotesDiagnostics({
      notes: store.listNotes(true),
      folders: store.listFolders(),
      tags: store.listTags(),
      versions: store.listVersions(),
      searchProjectionLagSeconds: 0,
      ...store.counters(),
    })
    expect(JSON.stringify(diagnostics)).not.toContain('Private body')
  })
})

describe('FLAGSHIP-02 privacy and content integrity regressions', () => {
  const context = {accountId: 'acct-private', actorId: 'actor-private', requestId: 'req-private', correlationId: 'corr-private'}

  it('purges note revisions, attachment metadata, and cached note results after permanent deletion', () => {
    const store = new VaultNotesStore(context)
    const first = store.createNote({title: 'Secret', document: createDocumentFromText('Original secret'), idempotencyKey: 'create-secret'})
    store.updateNote({id: first.id, expectedRevision: 1, document: createDocumentFromText('Revised secret'), idempotencyKey: 'update-secret'})
    store.attach({noteId: first.id, assetId: 'asset-one', name: 'secret.pdf', mimeType: 'application/pdf', size: 10, idempotencyKey: 'attach-secret'})
    expect(store.listVersions(first.id).length).toBeGreaterThan(0)
    store.permanentlyDeleteNote(first.id, true)
    expect(store.listVersions(first.id)).toEqual([])
    expect(store.listAttachments(first.id)).toEqual([])
    expect(store.listNotes(true).some(note => note.id === first.id)).toBe(false)
    const recreated = store.createNote({title: 'New', document: createDocumentFromText('New body'), idempotencyKey: 'create-secret'})
    expect(recreated.id).not.toBe(first.id)
    expect(recreated.title).toBe('New')
  })

  it('never reuses stale Markdown source when a structured document changes, and restores original source from revision', () => {
    const store = new VaultNotesStore(context)
    const original = createDocumentFromText('Original')
    const first = store.createNote({title: 'Markdown', document: original, contentFormat: 'markdown-v1', canonicalBody: '**Original**', idempotencyKey: 'create-markdown'})
    const renamed = store.updateNote({id: first.id, expectedRevision: 1, title: 'Renamed', document: original, idempotencyKey: 'rename-markdown'})
    expect(renamed.canonicalBody).toBe('**Original**')
    const rewritten = store.updateNote({id: first.id, expectedRevision: 2, document: createDocumentFromText('Rewritten'), idempotencyKey: 'rewrite-markdown'})
    expect(rewritten.contentFormat).toBe('blocks-v1')
    expect(rewritten.canonicalBody).toBeUndefined()
    const restored = store.restoreRevision({noteId: first.id, revision: 1, expectedCurrentRevision: 3, idempotencyKey: 'restore-markdown'})
    expect(restored.contentFormat).toBe('markdown-v1')
    expect(restored.canonicalBody).toBe('**Original**')
    expect(restored.plainTextProjection).toBe('Original')
  })

  it('rejects malformed rich-text shapes without runtime exceptions', () => {
    const malformed = [
      {schemaVersion: '1.0.0', blocks: {}},
      {schemaVersion: '1.0.0', blocks: [{id: 'a', type: 'paragraph', inlines: [null]}]},
      {schemaVersion: '1.0.0', blocks: [{id: 'a', type: 'paragraph', inlines: [{text: 'hi', marks: 12}]}]},
      {schemaVersion: '1.0.0', blocks: [{id: 'a', type: 'paragraph', inlines: [{text: 'hi', marks: [null]}]}]},
      {schemaVersion: '1.0.0', blocks: [{id: 'a', type: 'table', columns: ['A'], rows: {length: 1}}]},
    ]
    for (const document of malformed) {
      expect(() => validateStructuredDocument(document)).not.toThrow()
      expect(validateStructuredDocument(document).valid).toBe(false)
    }
    const cyclic: Record<string, unknown> = {schemaVersion: '1.0.0'}
    cyclic.blocks = [cyclic]
    expect(validateStructuredDocument(cyclic).issues).toContain('DOCUMENT_NOT_SERIALIZABLE')
  })

  it('refuses to restore references to attachments that have been removed', () => {
    const store = new VaultNotesStore(context)
    const note = store.createNote({title: 'With file', document: createDocumentFromText('File'), idempotencyKey: 'create-file'})
    const attached = store.attach({noteId: note.id, assetId: 'file-two', name: 'file.pdf', mimeType: 'application/pdf', size: 5, idempotencyKey: 'add-file'})
    const afterAttach = store.listNotes()[0]!
    store.removeAttachment(note.id, attached.id)
    const current = store.listNotes()[0]!
    expect(() => store.restoreRevision({noteId: note.id, revision: afterAttach.revision, expectedCurrentRevision: current.revision, idempotencyKey: 'restore-file'})).toThrow('Revision references a missing attachment')
    expect(store.listNotes()[0]?.revision).toBe(current.revision)
  })
})

