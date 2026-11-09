import {Button, Section, type BindingRef} from "@modula/product-ui";
import {attachNoteMediaAction} from "../notes/actions";

export function AttachmentList({note}: {note: BindingRef; editable: boolean}) {
  return (
    <Section title="Attachments" accessibility={{label: "Note attachments"}}>
      <Button label="Attach file" action={attachNoteMediaAction} />
    </Section>
  );
}
