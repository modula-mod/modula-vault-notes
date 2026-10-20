import {useRecord, useRecordRevision} from "@modula/product-ui";

export function useNote() {
  return useRecord({id: "note", type: "note", idParam: "noteId"});
}

export function useRevision() {
  return useRecordRevision({id: "revision", type: "note", idParam: "noteId", revisionParam: "revisionId"});
}
