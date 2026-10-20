import {useRecordRevisions} from "@modula/product-ui";

export function useRevisions() {
  return useRecordRevisions({id: "revisions", type: "note", idParam: "noteId", limit: 100});
}
