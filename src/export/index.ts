import {plainTextProjection} from '../document/index.js'
import {
  VAULT_NOTES_DATA_SCHEMA_VERSION,
  VAULT_NOTES_MODULE_ID,
  VAULT_NOTES_MODULE_VERSION,
  VAULT_NOTES_STANDARD_VERSION,
  type VaultExportFormat,
  type VaultExportManifest,
  type VaultFolderRecord,
  type VaultNoteRecord,
  type VaultTagRecord,
} from '../types.js'

export type VaultExportInput = {
  notes: VaultNoteRecord[]
  folders: VaultFolderRecord[]
  tags: VaultTagRecord[]
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
    moduleId: VAULT_NOTES_MODULE_ID,
    moduleVersion: VAULT_NOTES_MODULE_VERSION,
    standardVersion: VAULT_NOTES_STANDARD_VERSION,
    dataSchemaVersion: VAULT_NOTES_DATA_SCHEMA_VERSION,
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    recordCount: input.notes.length + input.folders.length + input.tags.length,
  }
  if (input.format === 'json') {
    return {format: input.format, manifest, mediaType: 'application/json', body: JSON.stringify({manifest, notes: input.notes, folders: input.folders, tags: input.tags}, null, 2)}
  }
  if (input.format === 'markdown') {
    return {format: input.format, manifest, mediaType: 'text/markdown', body: input.notes.map(note => `# ${note.title}\n\n${plainTextProjection(note.document)}\n`).join('\n---\n')}
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
      'notes.json': JSON.stringify(input.notes, null, 2),
      'folders.json': JSON.stringify(input.folders, null, 2),
      'tags.json': JSON.stringify(input.tags, null, 2),
    },
  }
}
