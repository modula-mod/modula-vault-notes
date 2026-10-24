import type {FieldDefinition} from "@modula/product-ui";

export const NOTE_TITLE_FIELD: FieldDefinition = {
  id: "title",
  type: "text",
  label: "Title",
  required: true,
  validation: {maxLength: 240},
};

export const NOTE_BODY_FIELD: FieldDefinition = {
  id: "document",
  type: "richText",
  label: "Body",
  capability: "ui.richText@1",
  placeholder: "Start writing",
};

export const NOTE_FOLDER_FIELD: FieldDefinition = {
  id: "folderId",
  type: "recordReference",
  label: "Folder",
  recordType: "folder",
  placeholder: "Optional folder",
};

export const NOTE_TAGS_FIELD: FieldDefinition = {
  id: "tagIds",
  type: "tags",
  label: "Tags",
  placeholder: "Add tags",
};
