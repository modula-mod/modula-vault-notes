import {Button, ErrorState, Metadata, Stack, Text, useCapability, type BindingRef} from "@modula/product-ui";
import {PROPERTY_EDITOR_REQUIREMENT, SUPPORTED_PROPERTY_TYPES} from "./property-types";
import {editPropertiesAction} from "./property-actions";

export function PropertyEditor({note}: {note: BindingRef}) {
  const propertyEditor = useCapability({id: "propertyEditorCapability", capability: "ui.property-editor@1"});
  return (
    <Stack direction="vertical" gap="compact">
      <Metadata binding={propertyEditor} valuePath="status" accessibility={{label: "Property editor capability status"}} />
      <Text text={SUPPORTED_PROPERTY_TYPES} />
      <Metadata binding={note} valuePath="properties" accessibility={{label: "Current typed properties"}} />
      <Button label="Edit typed properties" action={editPropertiesAction} />
      <ErrorState label={PROPERTY_EDITOR_REQUIREMENT} accessibility={{role: "status"}} />
    </Stack>
  );
}
