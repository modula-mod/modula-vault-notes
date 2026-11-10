import {action} from "@modula/product-ui";

export const restoreRevisionAction = action({
  id: "restoreRevision",
  family: "record.restore",
  label: "Restore as new revision",
  recordType: "note",
  recordIdBinding: "note",
  sourceRevisionParam: "revisionId",
  confirm: true,
});
