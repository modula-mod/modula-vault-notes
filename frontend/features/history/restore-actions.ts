import {action} from "@modula/product-ui";

export const restoreRevisionAction = action({
  id: "restoreRevision",
  family: "function.invoke",
  label: "Restore as new revision",
  functionId: "digital.modula.vault-notes.function.note.restore-revision",
  inputBinding: "revision",
  confirm: true,
});
