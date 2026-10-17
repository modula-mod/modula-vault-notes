import {ErrorState, RecordList, Section, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NoteRow} from "../../components/NoteRow";
import {BACKLINK_REQUIREMENT} from "./references";

export function Backlinks({notes, openNote}: {notes: BindingRef; openNote: ActionRef}) {
  return (
    <Section title="Backlinks" accessibility={{label: "Notes linking here"}}>
      <RecordList records={notes} action={openNote} accessibility={{label: "Backlink notes", role: "list"}}>
        <NoteRow note={notes} />
      </RecordList>
      <ErrorState label={BACKLINK_REQUIREMENT} accessibility={{role: "status"}} />
    </Section>
  );
}
