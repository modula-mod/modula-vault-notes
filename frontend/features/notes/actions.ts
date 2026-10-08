import {action} from "@modula/product-ui";
import {VAULT_PATHS} from "../../lib/routes";

export const newNoteAction = action({id: "newNote", family: "route.open", label: "New note", icon: "system.plus", route: VAULT_PATHS.newNote});
export const openNoteAction = action({id: "openNote", family: "route.open", label: "Open note", route: VAULT_PATHS.note});
export const editNoteAction = action({id: "editNote", family: "route.open", label: "Edit note", route: VAULT_PATHS.editNote});
export const openHistoryAction = action({id: "openHistory", family: "route.open", label: "Revision history", route: VAULT_PATHS.noteHistory});
export const openRevisionAction = action({id: "openRevision", family: "route.open", label: "Open revision", route: VAULT_PATHS.revision});
export const openFolderAction = action({id: "openFolder", family: "route.open", label: "Open folder", route: VAULT_PATHS.folder});
export const openTagAction = action({id: "openTag", family: "route.open", label: "Open tag", route: VAULT_PATHS.tag});

export const openSearchAction = action({id: "openSearch", family: "route.open", label: "Search", route: VAULT_PATHS.search});
export const openPinnedAction = action({id: "openPinned", family: "route.open", label: "Pinned", route: VAULT_PATHS.pinned});
export const openRecentAction = action({id: "openRecent", family: "route.open", label: "Recent", route: VAULT_PATHS.recent});
export const openFavouritesAction = action({id: "openFavourites", family: "route.open", label: "Favourites", route: VAULT_PATHS.favourites});
export const openArchivedAction = action({id: "openArchived", family: "route.open", label: "Archived", route: VAULT_PATHS.archived});
export const openTrashAction = action({id: "openTrash", family: "route.open", label: "Trash", route: VAULT_PATHS.trash});
export const openFoldersAction = action({id: "openFolders", family: "route.open", label: "Folders", route: VAULT_PATHS.folders});
export const openTagsAction = action({id: "openTags", family: "route.open", label: "Tags", route: VAULT_PATHS.tags});
export const openTemplatesAction = action({id: "openTemplates", family: "route.open", label: "Templates", route: VAULT_PATHS.templates});
export const openDailyAction = action({id: "openDaily", family: "route.open", label: "Daily Note", route: VAULT_PATHS.daily});
export const openAttachmentsAction = action({id: "openAttachments", family: "route.open", label: "Attachments", route: VAULT_PATHS.attachments});
export const openSavedSearchesAction = action({id: "openSavedSearches", family: "route.open", label: "Saved Searches", route: VAULT_PATHS.savedSearches});
export const openGraphAction = action({id: "openGraph", family: "route.open", label: "Graph", route: VAULT_PATHS.graph});
export const openSettingsAction = action({id: "openSettings", family: "route.open", label: "Settings", route: VAULT_PATHS.settings});

export const createNoteAction = action({
  id: "createNote",
  family: "record.create",
  label: "Create note",
  recordType: "note",
  inputBinding: "noteForm",
  input: {
    defaults: {
      document: {schemaVersion: "1.0.0", blocks: []},
      tagIds: [],
      pinned: false,
      favourite: false,
      archived: false,
      contentFormat: "blocks-v1",
      properties: {version: "1.0.0", values: []},
      attachmentIds: [],
      sensitive: false,
      intelligencePolicy: "preferLocal",
      dataSchemaVersion: "1.0.0",
    },
    transforms: [{target: "plainTextProjection", source: "document", transform: "richText.plainText@1"}],
  },
});

export const updateNoteAction = action({
  id: "updateNote",
  family: "record.update",
  label: "Save changes",
  recordType: "note",
  recordIdBinding: "note",
  inputBinding: "noteForm",
  input: {transforms: [{target: "plainTextProjection", source: "document", transform: "richText.plainText@1"}]},
});

export const deleteNoteAction = action({id: "deleteNote", family: "record.delete", label: "Move to Trash", recordType: "note", recordIdBinding: "note", confirm: true});
export const shareNoteAction = action({id: "shareNote", family: "share", label: "Share", capability: "share.native@1"});
export const restoreNoteAction = action({id: "restoreNote", family: "record.restore", label: "Restore note", recordType: "note"});
export const purgeNoteAction = action({id: "purgeNote", family: "record.purge", label: "Delete permanently", recordType: "note", confirm: true});
