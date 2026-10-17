import {plainTextProjection, validateStructuredDocument} from '../document/index.js'
import {VAULT_NOTES_DATA_SCHEMA_VERSION, type VaultNoteRecord} from '../types.js'

export function migrateVault18Note(input: unknown): VaultNoteRecord {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('INVALID_VAULT_NOTE')
  const value = input as Partial<VaultNoteRecord>
  const validation = validateStructuredDocument(value.document)
  if (!validation.valid || !validation.document) throw new Error(`INVALID_VAULT_DOCUMENT:${validation.issues.join(',')}`)
  if (typeof value.id !== 'string' || !value.id || typeof value.title !== 'string') throw new Error('INVALID_VAULT_NOTE_IDENTITY')
  const now = new Date().toISOString()
  return {
    id: value.id,
    title: value.title.trim() || 'Untitled',
    document: validation.document,
    contentFormat: value.contentFormat ?? 'blocks-v1',
    canonicalBody: value.canonicalBody,
    plainTextProjection: typeof value.plainTextProjection === 'string' ? value.plainTextProjection : plainTextProjection(validation.document),
    folderId: value.folderId,
    tagIds: Array.isArray(value.tagIds) ? value.tagIds.filter((item): item is string => typeof item === 'string') : [],
    pinned: value.pinned === true,
    favourite: value.favourite === true,
    archived: value.archived === true,
    icon: value.icon,
    coverAttachmentId: value.coverAttachmentId,
    properties: value.properties && !Array.isArray(value.properties) && value.properties.version === '1.0.0' && Array.isArray(value.properties.values)
      ? value.properties
      : {version: '1.0.0', values: []},
    attachmentIds: Array.isArray(value.attachmentIds) ? value.attachmentIds.filter((item): item is string => typeof item === 'string') : [],
    sensitive: value.sensitive === true,
    intelligencePolicy: value.sensitive ? 'localOnly' : value.intelligencePolicy ?? 'preferLocal',
    templateId: value.templateId,
    dailyDate: value.dailyDate,
    source: value.source,
    revision: Number.isInteger(value.revision) && Number(value.revision) > 0 ? Number(value.revision) : 1,
    createdAt: validDate(value.createdAt) ? value.createdAt! : now,
    updatedAt: validDate(value.updatedAt) ? value.updatedAt! : validDate(value.createdAt) ? value.createdAt! : now,
    deletedAt: validDate(value.deletedAt) ? value.deletedAt : undefined,
    dataSchemaVersion: VAULT_NOTES_DATA_SCHEMA_VERSION,
  }
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && Number.isFinite(Date.parse(value))
}
