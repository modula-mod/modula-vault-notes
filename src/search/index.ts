import type {VaultFolderRecord, VaultNoteRecord} from '../types.js'

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

export function projectNoteForSearch(note: VaultNoteRecord, accountId: string, folder?: VaultFolderRecord): VaultNotesSearchDocument {
  return {
    entityType: 'note',
    entityId: note.id,
    accountId,
    title: note.title,
    body: note.deletedAt ? undefined : note.plainTextProjection,
    tags: note.tagIds,
    status: note.deletedAt ? 'deleted' : 'active',
    sourceVersion: note.revision,
    metadata: {
      moduleId: 'modula.vault-notes',
      folderId: note.folderId,
      folderName: folder?.name,
      sourceTitle: note.source?.title,
      sourceAuthor: note.source?.authorDisplayName,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      archived: note.archived,
      pinned: note.pinned,
      favourite: note.favourite,
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
      moduleId: 'modula.vault-notes',
      parentFolderId: folder.parentFolderId,
      position: folder.position,
      createdAt: folder.createdAt,
      updatedAt: folder.updatedAt,
    },
  }
}
