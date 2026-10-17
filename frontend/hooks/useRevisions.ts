import {useRecords} from "@modula/product-ui";

export function useRevisions() {
  return useRecords({id: "revisions", type: "note-version", filterParam: "noteId", sortParam: "sort", limit: 100});
}
