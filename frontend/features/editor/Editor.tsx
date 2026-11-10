import {Button, Field, Form, Section, Stack, type ActionRef, type BindingRef} from "@modula/product-ui";
import {NOTE_BODY_FIELD, NOTE_FOLDER_FIELD, NOTE_TAGS_FIELD, NOTE_TITLE_FIELD} from "../../lib/validation";
import {FAVOURITE_FIELD, PINNED_FIELD} from "./document-model";

export function Editor({form, saveAction, attachAction, showAttachment}: {form: BindingRef; saveAction: ActionRef; attachAction: ActionRef; showAttachment: boolean}) {
  return (
    <Form action={saveAction} accessibility={{label: "Note editor", role: "form"}}>
      <Stack direction="vertical" gap="regular">
        <Field binding={form} field={NOTE_TITLE_FIELD} />
        <Field binding={form} field={NOTE_BODY_FIELD} />
        {showAttachment ? (
          <Section title="Organize" collapsible>
            <Field binding={form} field={NOTE_FOLDER_FIELD} />
            <Field binding={form} field={NOTE_TAGS_FIELD} />
            <Field binding={form} field={PINNED_FIELD} />
            <Field binding={form} field={FAVOURITE_FIELD} />
            <Button label="Attach file" action={attachAction} />
          </Section>
        ) : (
          <Section title="Organize" collapsible>
            <Field binding={form} field={NOTE_FOLDER_FIELD} />
            <Field binding={form} field={NOTE_TAGS_FIELD} />
            <Field binding={form} field={PINNED_FIELD} />
            <Field binding={form} field={FAVOURITE_FIELD} />
          </Section>
        )}
      </Stack>
    </Form>
  );
}
