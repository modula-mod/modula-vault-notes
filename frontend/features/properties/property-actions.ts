import {action} from "@modula/product-ui";

export const editPropertiesAction = action({
  id: "editProperties",
  family: "capability.invoke",
  label: "Edit typed properties",
  capability: "ui.property-editor@1",
  input: {defaults: {schema: "vault-note-properties@1"}},
});
