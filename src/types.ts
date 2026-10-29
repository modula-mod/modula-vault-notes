export const VAULT_NOTES_MODULE_ID = 'digital.modula.vault-notes' as const
export const VAULT_NOTES_SLUG = 'vault-notes' as const
export const VAULT_NOTES_NAME = 'Vault Notes' as const
export const VAULT_NOTES_STANDARD_VERSION = '2.1.0' as const
export const VAULT_NOTES_MODULE_VERSION = '2.0.2' as const
export const VAULT_NOTES_MANIFEST_SCHEMA_VERSION = '2.1.0' as const
export const VAULT_NOTES_DATA_SCHEMA_VERSION = '1.0.0' as const

export type VaultDocumentBlockType =
  | 'paragraph'
  | 'heading'
  | 'bullet-list'
  | 'numbered-list'
  | 'checklist'
  | 'quote'
  | 'code'
  | 'divider'
  | 'callout'
  | 'link-preview'
  | 'image-reference'
  | 'file-reference'
  | 'audio-reference'
  | 'note-reference'
  | 'table'

export type VaultInlineMarkType = 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'note-reference'

export type VaultInlineMark = {
  type: VaultInlineMarkType
  href?: string
  noteId?: string
}

export type VaultDocumentInline = {
  text: string
  marks?: VaultInlineMark[]
}

export type VaultDocumentBlock = {
  id: string
  type: VaultDocumentBlockType
  text?: string
  level?: 1 | 2 | 3
  items?: string[]
  checked?: boolean[]
  language?: string
  url?: string
  title?: string
  sourceRef?: string
  attachmentId?: string
  targetNoteId?: string
  mimeType?: string
  durationMs?: number
  alt?: string
  inlines?: VaultDocumentInline[]
  columns?: string[]
  rows?: string[][]
}

export type VaultStructuredDocument = {
  schemaVersion: '1.0.0'
  blocks: VaultDocumentBlock[]
}

export type VaultSavedSourceReference = {
  sourceType: 'modula-post' | 'modula-comment' | 'web-url' | 'file' | 'manual'
  sourceId?: string
  sourceUrl?: string
  title?: string
  authorDisplayName?: string
  capturedAt: string
  metadata?: Record<string, unknown>
}

export type VaultContentFormat = 'blocks-v1' | 'markdown-v1'

export type VaultNotePropertyType =
  | 'text'
  | 'number'
  | 'boolean'
  | 'date'
  | 'dateTime'
  | 'singleSelect'
  | 'multiSelect'
  | 'tags'
  | 'url'
  | 'recordReference'

export type VaultNoteProperty = {
  id: string
  name: string
  type: VaultNotePropertyType
  value: string | number | boolean | string[] | null
  referenceCollection?: string
}

export type VaultNoteProperties = {
  version: '1.0.0'
  values: VaultNoteProperty[]
}

export type VaultNoteIntelligencePolicy = 'disabled' | 'localOnly' | 'preferLocal'

export type VaultAttachmentKind = 'image' | 'pdf' | 'document' | 'audio' | 'file'

export type VaultAttachmentRecord = {
  id: string
  noteId: string
  assetId: string
  name: string
  mimeType: string
  size: number
  kind: VaultAttachmentKind
  createdAt: string
  durationMs?: number
  width?: number
  height?: number
  checksumSha256?: string
}

export type VaultNoteRecord = {
  id: string
  title: string
  document: VaultStructuredDocument
  contentFormat?: VaultContentFormat
  canonicalBody?: string
  plainTextProjection: string
  folderId?: string
  tagIds: string[]
  pinned: boolean
  favourite: boolean
  archived: boolean
  icon?: string
  coverAttachmentId?: string
  properties?: VaultNoteProperties
  attachmentIds?: string[]
  sensitive?: boolean
  intelligencePolicy?: VaultNoteIntelligencePolicy
  templateId?: string
  dailyDate?: string
  source?: VaultSavedSourceReference
  revision: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
  dataSchemaVersion: '1.0.0'
}

export type VaultFolderRecord = {
  id: string
  name: string
  parentFolderId?: string
  position: number
  createdAt: string
  updatedAt: string
}

export type VaultTagRecord = {
  id: string
  name: string
  normalizedName: string
  createdAt: string
  updatedAt: string
}

export type VaultNoteLinkRecord = {
  id: string
  sourceNoteId: string
  targetNoteId: string
  linkType: 'internal' | 'related' | 'source'
  createdAt: string
}

export type VaultNoteVersionRecord = {
  id: string
  noteId: string
  revision: number
  title: string
  document: VaultStructuredDocument
  contentFormat?: VaultContentFormat
  canonicalBody?: string
  plainTextProjection?: string
  properties?: VaultNoteProperties
  attachmentIds?: string[]
  sensitive?: boolean
  createdAt: string
  createdBy: string
  changeSource: 'manual' | 'restore' | 'import' | 'ai-assisted'
}

export type VaultTemplateRecord = {
  id: string
  name: string
  description: string
  titlePattern: string
  document: VaultStructuredDocument
  properties: VaultNoteProperties
  system: boolean
  createdAt: string
  updatedAt: string
}

export type VaultSavedSearchRecord = {
  id: string
  name: string
  query: string
  filters: VaultNoteSearchFilters
  sort: VaultNoteSort
  createdAt: string
  updatedAt: string
}

export type VaultNoteSort = 'createdAt' | 'updatedAt' | 'title'

export type VaultNoteSearchFilters = {
  createdFrom?: string
  createdTo?: string
  updatedFrom?: string
  updatedTo?: string
  tagIds?: string[]
  folderId?: string | null
  hasAttachment?: boolean
  pinned?: boolean
  favourite?: boolean
  archived?: boolean
  sensitive?: boolean
  property?: {id: string; value?: string | number | boolean | null}
}

export type VaultNoteSearchQuery = {
  query?: string
  filters?: VaultNoteSearchFilters
  includeDeleted?: boolean
  includeSensitive?: boolean
  cursor?: string
  limit?: number
  sort?: VaultNoteSort
  direction?: 'asc' | 'desc'
}

export type VaultGraphData = {
  nodes: Array<{id: string; title: string; folderId?: string; tagIds: string[]; archived: boolean}>
  edges: Array<{id: string; sourceNoteId: string; targetNoteId: string; linkType: VaultNoteLinkRecord['linkType']}>
}

export type VaultExportFormat = 'json' | 'markdown' | 'plain-text' | 'zip'

export type VaultExportManifest = {
  formatVersion: '2.0.0'
  moduleId: typeof VAULT_NOTES_MODULE_ID
  moduleVersion: typeof VAULT_NOTES_MODULE_VERSION
  standardVersion: typeof VAULT_NOTES_STANDARD_VERSION
  dataSchemaVersion: typeof VAULT_NOTES_DATA_SCHEMA_VERSION
  exportedAt: string
  recordCount: number
}

export type VaultPortableExport = {
  manifest: VaultExportManifest
  notes: VaultNoteRecord[]
  folders: VaultFolderRecord[]
  tags: VaultTagRecord[]
  links: VaultNoteLinkRecord[]
  attachments: VaultAttachmentRecord[]
  templates: VaultTemplateRecord[]
  savedSearches: VaultSavedSearchRecord[]
  settings?: Record<string, unknown>
}

export type VaultIntelligenceOperation =
  | 'intelligence.summarize'
  | 'intelligence.rewrite'
  | 'intelligence.extract'
  | 'intelligence.classify'
  | 'intelligence.semanticSearch'

export type VaultIntelligenceRequest = {
  moduleId: typeof VAULT_NOTES_MODULE_ID
  noteId: string
  operation: VaultIntelligenceOperation
  execution: 'localOnly' | 'preferLocal'
  input: {text: string; selection?: {start: number; end: number}; instruction?: string}
  outputSchema: Record<string, unknown>
}

export type VaultModuleEvent = {
  type: string
  version: '1.0.0'
  dataClassification: 'private' | 'sensitive' | 'internal'
  retention: string
  sourceRecordVersion: number
  accountId: string
  actorId: string
  requestId: string
  correlationId: string
  payload: Record<string, unknown>
}

