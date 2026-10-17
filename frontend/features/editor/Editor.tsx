import {Button, Field, Form, Section, Stack, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NOTE_BODY_FIELD, NOTE_FOLDER_FIELD, NOTE_TAGS_FIELD, NOTE_TITLE_FIELD} from "../../lib/validation";
import {AttachmentList} from "../attachments/AttachmentList";
import {FAVOURITE_FIELD, PINNED_FIELD} from "./document-model";

export function Editor({form, saveAction}: {form: BindingRef; saveAction: ActionRef}) {
  return (
    <Form accessibility={{label: "Note editor", role: "form"}}>
      <Stack direction="vertical" gap="regular">
        <Button label="Save note" action={saveAction} />
        <Section title="Note">
          <Field binding={form} field={NOTE_TITLE_FIELD} />
          <Field binding={form} field={NOTE_BODY_FIELD} />
        </Section>
        <Section title="Organize">
          <Field binding={form} field={NOTE_FOLDER_FIELD} />
          <Field binding={form} field={NOTE_TAGS_FIELD} />
          <Field binding={form} field={PINNED_FIELD} />
          <Field binding={form} field={FAVOURITE_FIELD} />
        </Section>
        <AttachmentList note={form} editable={true} />
      </Stack>
    </Form>
  );
}
