import {Button, Section, type BindingRef} from "@modula/product-ui";
import {pickAttachmentAction} from "./attachment-actions";

export function AttachmentList({note}: {note: BindingRef; editable: boolean}) {
  return (
    <Section title="Attachments" accessibility={{label: "Note attachments"}}>
      <Button label="Add attachment" action={pickAttachmentAction} />
    </Section>
  );
}
