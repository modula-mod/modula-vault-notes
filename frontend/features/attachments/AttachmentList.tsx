import {Button, Metadata, Section, Stack, useCapability, type BindingRef} from "@modula/product-ui";
import {pickAttachmentAction} from "./attachment-actions";

export function AttachmentList({note, editable}: {note: BindingRef; editable: boolean}) {
  const picker = useCapability({id: "mediaPickerCapability", capability: "media.picker@1"});
  return editable ? (
    <Section title="Attachments" accessibility={{label: "Note attachments"}}>
      <Stack direction="vertical" gap="compact">
        <Metadata binding={note} valuePath="attachmentIds" accessibility={{label: "Attachment identifiers"}} />
        <Metadata binding={picker} valuePath="status" accessibility={{label: "Media picker capability status"}} />
        <Button label="Add attachment" action={pickAttachmentAction} />
      </Stack>
    </Section>
  ) : (
    <Section title="Attachments" accessibility={{label: "Note attachments"}}>
      <Metadata binding={note} valuePath="attachmentIds" accessibility={{label: "Attachment identifiers"}} />
    </Section>
  );
}
