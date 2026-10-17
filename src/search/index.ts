import type {VaultAttachmentRecord, VaultFolderRecord, VaultNoteRecord} from '../types.js'

export type VaultNotesSearchDocument = {
  entityType: 'note' | 'vault-folder'
  entityId: string
  accountId: string
  title: string
  body?: string
  tags: string[]
  status: 'active' | 'deleted'
  sourceVersion: number
  metadata: Record<string, unknown>
}

export function projectNoteForSearch(
  note: VaultNoteRecord,
  accountId: string,
  folder?: VaultFolderRecord,
  attachments: VaultAttachmentRecord[] = [],
  options: {includeSensitiveBody?: boolean} = {},
): VaultNotesSearchDocument {
  const attachmentNames = attachments.filter(attachment => attachment.noteId === note.id).map(attachment => attachment.name)
  const propertyText = (note.properties?.values ?? []).flatMap(property => Array.isArray(property.value) ? property.value : [property.value]).filter(value => value !== null).join(' ')
  const body = [note.plainTextProjection, propertyText, attachmentNames.join(' ')].filter(Boolean).join('\n')
  return {
    entityType: 'note',
    entityId: note.id,
    accountId,
    title: note.title,
    body: note.deletedAt || (note.sensitive && !options.includeSensitiveBody) ? undefined : body,
    tags: note.tagIds,
    status: note.deletedAt ? 'deleted' : 'active',
    sourceVersion: note.revision,
    metadata: {
      moduleId: 'digital.modula.vault-notes',
      folderId: note.folderId,
      folderName: folder?.name,
      sourceTitle: note.source?.title,
      sourceAuthor: note.source?.authorDisplayName,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      archived: note.archived,
      pinned: note.pinned,
      favourite: note.favourite,
      sensitive: note.sensitive === true,
      hasAttachment: attachmentNames.length > 0 || Boolean(note.attachmentIds?.length),
      attachmentNames: note.sensitive && !options.includeSensitiveBody ? [] : attachmentNames,
      contentFormat: note.contentFormat ?? 'blocks-v1',
    },
  }
}

export function projectFolderForSearch(folder: VaultFolderRecord, accountId: string): VaultNotesSearchDocument {
  return {
    entityType: 'vault-folder',
    entityId: folder.id,
    accountId,
    title: folder.name,
    tags: [],
    status: 'active',
    sourceVersion: Date.parse(folder.updatedAt),
    metadata: {
      moduleId: 'digital.modula.vault-notes',
      parentFolderId: folder.parentFolderId,
      position: folder.position,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    },
  }
}
