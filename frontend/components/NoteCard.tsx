import {RecordRow, Stack, Text, type BindingRef} from "@modula/product-ui";
import {NoteMetadata} from "./NoteMetadata";
import {NotePreview} from "./NotePreview";

export function NoteCard({note}: {note: BindingRef}) {
  return (
    <RecordRow binding={note} accessibility={{label: "Related note", role: "listitem"}}>
      <Stack direction="vertical" gap="compact">
        <Text binding={note} valuePath="title" accessibility={{role: "header"}} />
        <NotePreview note={note} />
        <NoteMetadata note={note} />
      </Stack>
    </RecordRow>
  );
}
