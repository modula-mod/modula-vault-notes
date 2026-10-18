import {useRecord, useRecords} from "@modula/product-ui";

export function useActiveNotes() {
  return useRecords({id: "notes", type: "note", searchParam: "q", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
}

export function usePinnedNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {pinned: true, archived: false}, recordState: "active"});
}

export function useRecentNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
}

export function useFavouriteNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {favourite: true, archived: false}, recordState: "active"});
}

export function useArchivedNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: true}, recordState: "active"});
}

export function useDeletedNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, recordState: "deleted"});
}

export function useFolderNotes() {
  return useRecords({id: "notes", type: "note", filterParam: "folderId", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
}

export function useTagNotes() {
  return useRecords({id: "notes", type: "note", membership: {field: "tagIds", param: "tagId"}, sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
}

export function useFolders() {
  return useRecords({id: "folders", type: "folder", searchParam: "q", sortParam: "sort", limit: 100});
}

export function useFolder() {
  return useRecord({id: "folder", type: "folder", idParam: "folderId"});
}

export function useTags() {
  return useRecords({id: "tags", type: "tag", searchParam: "q", sortParam: "sort", limit: 100});
}

export function useTag() {
  return useRecord({id: "tag", type: "tag", idParam: "tagId"});
}

export function useBacklinkNotes() {
  return useRecords({id: "backlinkNotes", type: "note", filterParam: "references", sortParam: "sort", limit: 50, recordState: "active"});
}

export function useRelatedNotes() {
  return useRecords({id: "relatedNotes", type: "note", filterParam: "relatedTo", sortParam: "sort", limit: 20, recordState: "active"});
}
