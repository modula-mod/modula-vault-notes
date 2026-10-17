import {Button, Field, Form, Section, Stack, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NOTE_BODY_FIELD, NOTE_FOLDER_FIELD, NOTE_TAGS_FIELD, NOTE_TITLE_FIELD} from "../../lib/validation";
import {AttachmentList} from "../attachments/AttachmentList";
import {
  FAVOURITE_FIELD,
  INTELLIGENCE_POLICY_FIELD,
  NOTE_ICON_FIELD,
  PINNED_FIELD,
  SENSITIVE_FIELD,
  TEMPLATE_FIELD,
} from "./document-model";
import {EditorToolbar} from "./EditorToolbar";

export function Editor({form, saveAction}: {form: BindingRef; saveAction: ActionRef}) {
  return (
    <Form accessibility={{label: "Vault Notes editor", role: "form"}}>
      <Stack direction="vertical" gap="regular" responsive={[{class: "compact", columns: 1}, {class: "wide", columns: 2}]}>
        <EditorToolbar />
        <Section title="Document">
          <Field binding={form} field={NOTE_TITLE_FIELD} />
          <Field binding={form} field={NOTE_BODY_FIELD} />
        </Section>
        <Section title="Organization">
          <Field binding={form} field={NOTE_FOLDER_FIELD} />
          <Field binding={form} field={NOTE_TAGS_FIELD} />
          <Field binding={form} field={TEMPLATE_FIELD} />
          <Field binding={form} field={NOTE_ICON_FIELD} />
          <Field binding={form} field={PINNED_FIELD} />
          <Field binding={form} field={FAVOURITE_FIELD} />
        </Section>
        <AttachmentList note={form} editable={true} />
        <Section title="Privacy and intelligence">
          <Field binding={form} field={SENSITIVE_FIELD} />
          <Field binding={form} field={INTELLIGENCE_POLICY_FIELD} />
        </Section>
        <Button label="Save note" action={saveAction} />
      </Stack>
    </Form>
  );
}
