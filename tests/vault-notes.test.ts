import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, it} from 'vitest'
import {validateModulaModuleManifest} from '@modula/module-validator'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  VAULT_NOTES_MODULE_ID,
  VAULT_NOTES_MODULE_VERSION,
  VAULT_NOTES_STANDARD_VERSION,
  VaultNotesError,
  VaultNotesStore,
  createDocumentFromText,
  renderBlockPreview,
  validateStructuredDocument,
  vaultNotesDiagnostics,
} from '../src/index.js'

const root = new URL('..', import.meta.url).pathname

describe('Vault Notes Standard 1.2 manifest', () => {
  const manifest = JSON.parse(readFileSync(join(root, 'modula.module.json'), 'utf8'))

  it('validates through the external Standard 1.2 validator', () => {
    const result = validateModulaModuleManifest(manifest)
    expect(result.valid, result.issues.map(issue => `${issue.code} ${issue.path}`).join('\n')).toBe(true)
  })

  it('declares stable identity and four independent versions', () => {
    expect(manifest.id).toBe(VAULT_NOTES_MODULE_ID)
    expect(manifest.standardVersion).toBe(VAULT_NOTES_STANDARD_VERSION)
    expect(manifest.moduleVersion).toBe(VAULT_NOTES_MODULE_VERSION)
    expect(manifest.manifestSchemaVersion).toBe('1.2.0')
    expect(manifest.dataSchemaVersion).toBe(VAULT_NOTES_DATA_SCHEMA_VERSION)
  })

  it('declares required records, views, actions, functions, permissions, events, settings and search', () => {
    expect(manifest.records.map((record: any) => record.id)).toEqual(expect.arrayContaining([
      'modula.vault-notes.record.note',
      'modula.vault-notes.record.folder',
      'modula.vault-notes.record.tag',
      'modula.vault-notes.record.note-link',
      'modula.vault-notes.record.note-version',
      'modula.vault-notes.record.saved-source',
    ]))
    expect(manifest.views).toHaveLength(12)
    expect(manifest.actions).toHaveLength(21)
    expect(manifest.functions).toHaveLength(21)
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
    expect(manifest.ai[0].productActions.map((action: any) => action.id)).toEqual(expect.arrayContaining([
      'vault-notes.ai.summarise',
      'vault-notes.ai.suggest-title',
      'vault-notes.ai.rewrite-selection',
      'vault-notes.ai.extract-action-items',
      'vault-notes.ai.suggest-tags',
    ]))
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
