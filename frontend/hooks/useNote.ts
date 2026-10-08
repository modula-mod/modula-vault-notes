import {useRecord} from "@modula/product-ui";

export function useNote() {
  return useRecord({id: "note", type: "note", idParam: "noteId"});
}

export function useRevision() {
  return useRecord({id: "revision", type: "note-version", idParam: "revisionId"});
}
