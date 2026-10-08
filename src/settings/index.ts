export const vaultNotesSettingsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    defaultCollectionView: {enum: ['list', 'compact-list', 'grid']},
    defaultSort: {enum: ['updatedAt', 'createdAt', 'title']},
    autosaveDelayMs: {type: 'integer', minimum: 500, maximum: 10000},
    versionHistoryRetention: {type: 'integer', minimum: 1, maximum: 100},
    confirmPermanentDeletion: {type: 'boolean'},
    showWordCount: {type: 'boolean'},
    showCharacterCount: {type: 'boolean'},
    includeArchivedNotesInSearch: {type: 'boolean'},
    defaultExportFormat: {enum: ['json', 'markdown', 'plain-text', 'zip']},
    defaultFolderId: {type: 'string', maxLength: 120},
    newNoteTemplateId: {type: 'string', maxLength: 120},
    dailyNoteEnabled: {type: 'boolean'},
    showBacklinks: {type: 'boolean'},
    searchSensitiveNotes: {type: 'boolean'},
    intelligencePreference: {enum: ['disabled', 'localOnly', 'preferLocal']},
  },
  required: [
    'defaultCollectionView',
    'defaultSort',
    'autosaveDelayMs',
    'versionHistoryRetention',
    'confirmPermanentDeletion',
    'showWordCount',
    'showCharacterCount',
    'includeArchivedNotesInSearch',
    'defaultExportFormat',
    'dailyNoteEnabled',
    'showBacklinks',
    'searchSensitiveNotes',
    'intelligencePreference',
  ],
} as const

export const vaultNotesDefaultSettings = {
  defaultCollectionView: 'list',
  defaultSort: 'updatedAt',
  autosaveDelayMs: 1200,
  versionHistoryRetention: 25,
  confirmPermanentDeletion: true,
  showWordCount: true,
  showCharacterCount: false,
  includeArchivedNotesInSearch: false,
  defaultExportFormat: 'json',
  defaultFolderId: undefined,
  newNoteTemplateId: 'system.blank',
  dailyNoteEnabled: true,
  showBacklinks: true,
  searchSensitiveNotes: false,
  intelligencePreference: 'preferLocal',
} as const

export type VaultNotesSettings = {
  defaultCollectionView: 'list' | 'compact-list' | 'grid'
  defaultSort: 'updatedAt' | 'createdAt' | 'title'
  autosaveDelayMs: number
  versionHistoryRetention: number
  confirmPermanentDeletion: boolean
  showWordCount: boolean
  showCharacterCount: boolean
  includeArchivedNotesInSearch: boolean
  defaultExportFormat: 'json' | 'markdown' | 'plain-text' | 'zip'
  defaultFolderId?: string
  newNoteTemplateId: string
  dailyNoteEnabled: boolean
  showBacklinks: boolean
  searchSensitiveNotes: boolean
  intelligencePreference: 'disabled' | 'localOnly' | 'preferLocal'
}

export function validateVaultNotesSettings(input: Record<string, unknown>): {valid: boolean; issues: string[]; value?: VaultNotesSettings} {
  const value = {...vaultNotesDefaultSettings, ...input} as VaultNotesSettings
  const issues: string[] = []
  if (!['list', 'compact-list', 'grid'].includes(String(value.defaultCollectionView))) issues.push('INVALID_DEFAULT_COLLECTION_VIEW')
  if (!['updatedAt', 'createdAt', 'title'].includes(String(value.defaultSort))) issues.push('INVALID_DEFAULT_SORT')
  if (!Number.isInteger(value.autosaveDelayMs) || value.autosaveDelayMs < 500 || value.autosaveDelayMs > 10000) issues.push('INVALID_AUTOSAVE_DELAY')
  if (!Number.isInteger(value.versionHistoryRetention) || value.versionHistoryRetention < 1 || value.versionHistoryRetention > 100) issues.push('INVALID_VERSION_RETENTION')
  for (const key of ['confirmPermanentDeletion', 'showWordCount', 'showCharacterCount', 'includeArchivedNotesInSearch', 'dailyNoteEnabled', 'showBacklinks', 'searchSensitiveNotes'] as const) {
    if (typeof value[key] !== 'boolean') issues.push(`INVALID_${key.toUpperCase()}`)
  }
  if (!['json', 'markdown', 'plain-text', 'zip'].includes(String(value.defaultExportFormat))) issues.push('INVALID_DEFAULT_EXPORT_FORMAT')
  if (value.defaultFolderId !== undefined && (typeof value.defaultFolderId !== 'string' || value.defaultFolderId.length > 120)) issues.push('INVALID_DEFAULT_FOLDER')
  if (typeof value.newNoteTemplateId !== 'string' || !value.newNoteTemplateId || value.newNoteTemplateId.length > 120) issues.push('INVALID_NEW_NOTE_TEMPLATE')
  if (!['disabled', 'localOnly', 'preferLocal'].includes(String(value.intelligencePreference))) issues.push('INVALID_INTELLIGENCE_PREFERENCE')
  return {valid: issues.length === 0, issues, value: issues.length === 0 ? value as VaultNotesSettings : undefined}
}
