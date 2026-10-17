import {action} from "@modula/product-ui";

export const pickAttachmentAction = action({
  id: "pickAttachment",
  family: "capability.invoke",
  label: "Choose attachment",
  capability: "media.picker@1",
  input: {defaults: {assetRoles: ["image", "document", "pdf", "audio", "file"]}},
});

export const attachToNoteAction = action({
  id: "attachToNote",
  family: "function.invoke",
  label: "Attach to note",
  functionId: "digital.modula.vault-notes.function.note.attach",
  inputBinding: "attachmentForm",
});
