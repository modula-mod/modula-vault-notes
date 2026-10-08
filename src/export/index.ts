import {plainTextProjection} from '../document/index.js'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  VAULT_NOTES_MODULE_ID,
  VAULT_NOTES_MODULE_VERSION,
  VAULT_NOTES_STANDARD_VERSION,
  type VaultExportFormat,
  type VaultExportManifest,
  type VaultAttachmentRecord,
  type VaultFolderRecord,
  type VaultNoteLinkRecord,
  type VaultNoteRecord,
  type VaultSavedSearchRecord,
  type VaultTagRecord,
  type VaultTemplateRecord,
} from '../types.js'

export type VaultExportInput = {
  notes: VaultNoteRecord[]
  folders: VaultFolderRecord[]
  tags: VaultTagRecord[]
  links?: VaultNoteLinkRecord[]
  attachments?: VaultAttachmentRecord[]
  templates?: VaultTemplateRecord[]
  savedSearches?: VaultSavedSearchRecord[]
  settings?: Record<string, unknown>
  format: VaultExportFormat
  exportedAt?: string
}

export type VaultExportResult = {
  format: VaultExportFormat
  manifest: VaultExportManifest
  mediaType: string
  body: string | Record<string, string>
}

export function exportVaultNotes(input: VaultExportInput): VaultExportResult {
  const manifest: VaultExportManifest = {
    formatVersion: '2.0.0',
    moduleId: VAULT_NOTES_MODULE_ID,
    moduleVersion: VAULT_NOTES_MODULE_VERSION,
    standardVersion: VAULT_NOTES_STANDARD_VERSION,
    dataSchemaVersion: VAULT_NOTES_DATA_SCHEMA_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    recordCount: input.notes.length + input.folders.length + input.tags.length + (input.links?.length ?? 0) + (input.attachments?.length ?? 0) + (input.templates?.length ?? 0) + (input.savedSearches?.length ?? 0),
  }
  const portable = {
    manifest,
    notes: input.notes,
    folders: input.folders,
    tags: input.tags,
    links: input.links ?? [],
    attachments: input.attachments ?? [],
    templates: input.templates ?? [],
    savedSearches: input.savedSearches ?? [],
    settings: input.settings,
  }
  if (input.format === 'json') {
    return {format: input.format, manifest, mediaType: 'application/json', body: JSON.stringify(portable, null, 2)}
  }
  if (input.format === 'markdown') {
    return {format: input.format, manifest, mediaType: 'text/markdown', body: input.notes.map(note => `# ${note.title}\n\n${note.contentFormat === 'markdown-v1' && note.canonicalBody ? note.canonicalBody : plainTextProjection(note.document)}\n`).join('\n---\n')}
  }
  if (input.format === 'plain-text') {
    return {format: input.format, manifest, mediaType: 'text/plain', body: input.notes.map(note => `${note.title}\n${plainTextProjection(note.document)}`).join('\n\n')}
  }
  return {
    format: input.format,
    manifest,
    mediaType: 'application/zip',
    body: {
      'manifest.json': JSON.stringify(manifest, null, 2),
      'vault.json': JSON.stringify(portable, null, 2),
      ...Object.fromEntries(input.notes.map(note => [`notes/${safeFileName(note.title)}-${note.id}.md`, `# ${note.title}\n\n${note.contentFormat === 'markdown-v1' && note.canonicalBody ? note.canonicalBody : plainTextProjection(note.document)}\n`])),
    },
  }
}

function safeFileName(value: string): string {
  return value.normalize('NFKD').replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80) || 'untitled'
}
