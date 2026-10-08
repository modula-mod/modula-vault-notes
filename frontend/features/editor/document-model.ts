import type {FieldDefinition} from "@modula/product-ui";

export const NOTE_ICON_FIELD: FieldDefinition = {
  id: "icon",
  type: "text",
  label: "Note icon",
  placeholder: "Optional symbol or short label",
  validation: {maxLength: 120},
};

export const PINNED_FIELD: FieldDefinition = {id: "pinned", type: "boolean", label: "Pinned"};
export const FAVOURITE_FIELD: FieldDefinition = {id: "favourite", type: "boolean", label: "Favourite"};
export const SENSITIVE_FIELD: FieldDefinition = {
  id: "sensitive",
  type: "boolean",
  label: "Sensitive note",
  helpText: "Sensitive notes require local-only intelligence and hide indexed content by default.",
};

export const INTELLIGENCE_POLICY_FIELD: FieldDefinition = {
  id: "intelligencePolicy",
  type: "singleSelect",
  label: "Local intelligence",
  options: [
    {value: "disabled", label: "Disabled"},
    {value: "localOnly", label: "Local only"},
    {value: "preferLocal", label: "Prefer local"},
  ],
};

export const TEMPLATE_FIELD: FieldDefinition = {
  id: "templateId",
  type: "recordReference",
  label: "Template",
  recordType: "template",
  helpText: "Template expansion is performed by the module function, not duplicated in presentation code.",
};
