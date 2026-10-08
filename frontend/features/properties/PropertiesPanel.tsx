import {Metadata, Section, Stack, type BindingRef} from "@modula/product-ui";
import {PropertyEditor} from "./PropertyEditor";

export function PropertiesPanel({note, editable}: {note: BindingRef; editable: boolean}) {
  return editable ? (
    <Section title="Properties" accessibility={{label: "Typed note properties"}}>
      <PropertyEditor note={note} />
    </Section>
  ) : (
    <Section title="Properties" accessibility={{label: "Typed note properties"}}>
      <Stack direction="vertical" gap="compact">
        <Metadata binding={note} valuePath="properties" accessibility={{label: "Note property values"}} />
      </Stack>
    </Section>
  );
}
