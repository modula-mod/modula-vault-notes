import {RecordList, Stack, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NoteRow} from "./NoteRow";

export function NotesCollection({notes, openNote, label}: {notes: BindingRef; openNote: ActionRef; label: string}) {
  return (
    <Stack direction="vertical" gap="regular">
      <RecordList records={notes} action={openNote} accessibility={{label, role: "list"}}>
        <NoteRow note={notes} />
      </RecordList>
    </Stack>
  );
}
