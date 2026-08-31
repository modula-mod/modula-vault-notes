import {Metadata, RecordRow, Stack, Text, type BindingRef} from "@modula/product-ui";

export function NoteRow({note}: {note: BindingRef}) {
  return (
    <RecordRow binding={note}>
      <Stack direction="vertical" gap="compact">
        <Text binding={note} valuePath="title" />
        <Text binding={note} valuePath="plainTextProjection" />
        <Metadata binding={note} valuePath="updatedAt" />
      </Stack>
    </RecordRow>
  );
}
