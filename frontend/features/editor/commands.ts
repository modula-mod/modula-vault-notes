import {action} from "@modula/product-ui";

export const headingCommand = action({id: "formatHeading", family: "capability.invoke", label: "Heading", capability: "ui.richText.commands@1", input: {defaults: {command: "heading"}}});
export const boldCommand = action({id: "formatBold", family: "capability.invoke", label: "Bold", capability: "ui.richText.commands@1", input: {defaults: {command: "bold"}}});
export const italicCommand = action({id: "formatItalic", family: "capability.invoke", label: "Italic", capability: "ui.richText.commands@1", input: {defaults: {command: "italic"}}});
export const strikeCommand = action({id: "formatStrike", family: "capability.invoke", label: "Strike", capability: "ui.richText.commands@1", input: {defaults: {command: "strikethrough"}}});
export const codeCommand = action({id: "formatCode", family: "capability.invoke", label: "Code", capability: "ui.richText.commands@1", input: {defaults: {command: "code"}}});
export const quoteCommand = action({id: "formatQuote", family: "capability.invoke", label: "Quote", capability: "ui.richText.commands@1", input: {defaults: {command: "quote"}}});
export const bulletCommand = action({id: "formatBulletList", family: "capability.invoke", label: "Bullets", capability: "ui.richText.commands@1", input: {defaults: {command: "bulletList"}}});
export const numberedCommand = action({id: "formatNumberedList", family: "capability.invoke", label: "Numbered list", capability: "ui.richText.commands@1", input: {defaults: {command: "numberedList"}}});
export const checklistCommand = action({id: "formatChecklist", family: "capability.invoke", label: "Checklist", capability: "ui.richText.commands@1", input: {defaults: {command: "checklist"}}});
export const linkCommand = action({id: "insertLink", family: "capability.invoke", label: "Link", capability: "ui.richText.commands@1", input: {defaults: {command: "link"}}});
export const referenceCommand = action({id: "insertReference", family: "capability.invoke", label: "Reference", capability: "ui.reference-picker@1", input: {defaults: {command: "recordReference", recordType: "note"}}});
export const attachmentCommand = action({id: "insertAttachment", family: "capability.invoke", label: "Attachment", capability: "media.picker@1", input: {defaults: {command: "assetReference"}}});
export const calloutCommand = action({id: "formatCallout", family: "capability.invoke", label: "Callout", capability: "ui.richText.commands@1", input: {defaults: {command: "callout"}}});
export const tableCommand = action({id: "insertTable", family: "capability.invoke", label: "Table", capability: "ui.richText.commands@1", input: {defaults: {command: "table"}}});
