import {VAULT_NOTES_MODULE_ID, type VaultIntelligenceOperation, type VaultIntelligenceRequest, type VaultNoteRecord} from '../types.js'

export function createVaultIntelligenceRequest(
  note: VaultNoteRecord,
  operation: VaultIntelligenceOperation,
  input: VaultIntelligenceRequest['input'],
  options: {execution?: 'localOnly' | 'preferLocal'; outputSchema?: Record<string, unknown>} = {},
): VaultIntelligenceRequest {
  if (note.intelligencePolicy === 'disabled') throw new Error('VAULT_INTELLIGENCE_DISABLED')
  const execution = note.sensitive || note.intelligencePolicy === 'localOnly'
    ? 'localOnly'
    : options.execution ?? (note.intelligencePolicy === 'preferLocal' ? 'preferLocal' : 'preferLocal')
  return {
    moduleId: VAULT_NOTES_MODULE_ID,
    noteId: note.id,
    operation,
    execution,
    input,
    outputSchema: options.outputSchema ?? {type: 'object'},
  }
}

export function assertLocalIntelligenceAvailable(request: VaultIntelligenceRequest, available: boolean): void {
  if (!available && request.execution === 'localOnly') throw new Error('LOCAL_INTELLIGENCE_UNAVAILABLE')
}
