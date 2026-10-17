import {createDocumentFromText} from '../document/index.js'
import {migrateVault18Note} from '../migrations/index.js'
import {VAULT_NOTES_MODULE_ID, type VaultNoteRecord, type VaultPortableExport} from '../types.js'

const MAX_IMPORT_BYTES = 25_000_000
const MAX_IMPORT_NOTES = 50_000

export function importVaultText(input: {format: 'markdown' | 'plain-text'; body: string; title?: string; id: string; importedAt?: string}): VaultNoteRecord {
  if (Buffer.byteLength(input.body, 'utf8') > MAX_IMPORT_BYTES) throw new Error('IMPORT_TOO_LARGE')
  const createdAt = input.importedAt ?? new Date().toISOString()
  const title = input.title?.trim() || (input.format === 'markdown' ? firstMarkdownHeading(input.body) : undefined) || 'Imported note'
  const body = input.format === 'markdown' ? portableMarkdownText(input.body) : input.body.replaceAll('\u0000', '')
  return migrateVault18Note({
    id: input.id,
    title,
    document: createDocumentFromText(body),
    contentFormat: input.format === 'markdown' ? 'markdown-v1' : 'blocks-v1',
    canonicalBody: input.format === 'markdown' ? input.body.replaceAll('\u0000', '') : undefined,
    plainTextProjection: body,
    tagIds: [],
    pinned: false,
    favourite: false,
    archived: false,
    revision: 1,
    createdAt,
    updatedAt: createdAt,
    dataSchemaVersion: '1.0.0',
  })
}

export function importVaultBackup(input: string | VaultPortableExport): VaultPortableExport {
  const bytes = typeof input === 'string' ? Buffer.byteLength(input, 'utf8') : Buffer.byteLength(JSON.stringify(input), 'utf8')
  if (bytes > MAX_IMPORT_BYTES) throw new Error('IMPORT_TOO_LARGE')
  const parsed = typeof input === 'string' ? JSON.parse(input) as VaultPortableExport : input
  if (parsed.manifest?.moduleId !== VAULT_NOTES_MODULE_ID) throw new Error('INVALID_EXPORT_MODULE')
  if (!Array.isArray(parsed.notes) || parsed.notes.length > MAX_IMPORT_NOTES) throw new Error('INVALID_EXPORT_NOTES')
  return {
    manifest: parsed.manifest,
    notes: parsed.notes.map(migrateVault18Note),
    folders: Array.isArray(parsed.folders) ? parsed.folders : [],
    tags: Array.isArray(parsed.tags) ? parsed.tags : [],
    links: Array.isArray(parsed.links) ? parsed.links : [],
    attachments: Array.isArray(parsed.attachments) ? parsed.attachments.map(attachment => {
      const {id, noteId, assetId, name, mimeType, size, kind, createdAt, durationMs, width, height, checksumSha256} = attachment
      return {id, noteId, assetId, name, mimeType, size, kind, createdAt, durationMs, width, height, checksumSha256}
    }) : [],
    templates: Array.isArray(parsed.templates) ? parsed.templates : [],
    savedSearches: Array.isArray(parsed.savedSearches) ? parsed.savedSearches : [],
    settings: parsed.settings && typeof parsed.settings === 'object' && !Array.isArray(parsed.settings) ? parsed.settings : undefined,
  }
}

function firstMarkdownHeading(value: string): string | undefined {
  return value.split(/\r?\n/).map(line => line.match(/^#\s+(.+)$/)?.[1]?.trim()).find(Boolean)
}

function portableMarkdownText(value: string): string {
  return value
    .replaceAll('\u0000', '')
    .replace(/```[^\n]*\n([\s\S]*?)```/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1 ($2)')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

