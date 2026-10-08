import {RecordList, Section, Text, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NoteCard} from "../../components/NoteCard";
import {RELATED_NOTES_POLICY} from "./references";

export function RelatedNotes({notes, openNote}: {notes: BindingRef; openNote: ActionRef}) {
  return (
    <Section title="Related notes">
      <Text text={RELATED_NOTES_POLICY} />
      <RecordList records={notes} action={openNote} accessibility={{label: "Related notes", role: "list"}}>
        <NoteCard note={notes} />
      </RecordList>
    </Section>
  );
}
