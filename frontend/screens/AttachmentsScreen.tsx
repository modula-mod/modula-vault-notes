import {Button, ModuleScreen, Stack, Text, screen} from "@modula/product-ui";
import {openHomeAction} from "../features/notes/actions";

function AttachmentsScreen() {
  return (
    <ModuleScreen title="Attachments">
      <Stack direction="vertical" gap="regular">
        <Text text="Open a note to add, view, or remove its files." />
        <Button label="Browse notes" action={openHomeAction} />
      </Stack>
    </ModuleScreen>
  );
}

export const attachmentsScreen = screen("attachments", "detail", "Attachments", AttachmentsScreen);
