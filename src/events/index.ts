import {documentContentHash} from '../document/index.js'
import type {VaultModuleEvent, VaultNoteRecord} from '../types.js'

export const VAULT_NOTES_EVENT_TYPES = [
  'vault-notes.note.created',
  'vault-notes.note.updated',
  'vault-notes.note.archived',
  'vault-notes.note.unarchived',
  'vault-notes.note.deleted',
  'vault-notes.note.restored',
  'vault-notes.note.permanently-deleted',
  'vault-notes.note.duplicated',
  'vault-notes.note.exported',
  'vault-notes.folder.created',
  'vault-notes.folder.updated',
  'vault-notes.folder.deleted',
] as const

export type VaultNotesEventType = (typeof VAULT_NOTES_EVENT_TYPES)[number]

export function noteEvent(type: VaultNotesEventType, note: VaultNoteRecord, context: {accountId: string; actorId: string; requestId: string; correlationId: string}): VaultModuleEvent {
  return {
    type,
    version: '1.0.0',
    dataClassification: type.endsWith('exported') || type.endsWith('permanently-deleted') ? 'sensitive' : 'private',
    retention: 'standard-module-record-retention',
    sourceRecordVersion: note.revision,
    accountId: context.accountId,
    actorId: context.actorId,
    requestId: context.requestId,
    correlationId: context.correlationId,
    payload: {
      noteId: note.id,
      revision: note.revision,
      documentHash: documentContentHash(note.document),
      titleLength: note.title.length,
      tagCount: note.tagIds.length,
      folderId: note.folderId,
      archived: note.archived,
      deleted: Boolean(note.deletedAt),
    },
  }
}
