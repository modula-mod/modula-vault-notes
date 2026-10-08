import {Button, Metadata, RecordRow, Stack, Text, type ActionRef, type BindingRef} from "@modula/product-ui";

export function TemplateCard({template, createAction}: {template: BindingRef; createAction: ActionRef}) {
  return (
    <RecordRow binding={template} accessibility={{label: "Note template", role: "listitem"}}>
      <Stack direction="vertical" gap="compact">
        <Text binding={template} valuePath="name" accessibility={{role: "header"}} />
        <Text binding={template} valuePath="description" />
        <Metadata binding={template} valuePath="category" />
        <Button label="Create note from template" action={createAction} />
      </Stack>
    </RecordRow>
  );
}
