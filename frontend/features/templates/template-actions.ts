import {action} from "@modula/product-ui";

export const createFromTemplateAction = action({
  id: "createFromTemplate",
  family: "function.invoke",
  label: "Create from template",
  functionId: "digital.modula.vault-notes.function.note.create",
  inputBinding: "templates",
  input: {defaults: {source: "template", requireReview: true}},
});

export const createDailyNoteAction = action({
  id: "createDailyNote",
  family: "function.invoke",
  label: "Open today’s note",
  functionId: "digital.modula.vault-notes.function.note.create-daily",
  input: {defaults: {source: "daily-route", idempotent: true}},
});
