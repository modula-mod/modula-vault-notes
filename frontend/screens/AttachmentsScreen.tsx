import {Button, Field, Form, ModuleScreen, RecordList, Stack, useForm, useRecords, screen} from "@modula/product-ui";
import {AttachmentRow} from "../components/AttachmentRow";
import {collectionStates} from "../components/ScreenStates";
import {attachToNoteAction, pickAttachmentAction} from "../features/attachments/attachment-actions";

function AttachmentsScreen() {
  const attachments = useRecords({id: "attachments", type: "attachment", searchParam: "q", filterParam: "filter", sortParam: "sort", limit: 100});
  const attachmentForm = useForm({id: "attachmentForm"});
  return (
    <ModuleScreen title="Attachments">
      <Stack direction="vertical" gap="regular">
        <Form accessibility={{label: "Attach a file", role: "form"}}>
          <Field binding={attachmentForm} field={{id: "noteId", type: "recordReference", label: "Note", recordType: "note", required: true}} />
          <Field binding={attachmentForm} field={{id: "assetId", type: "assetReference", label: "File", assetRole: "vault-note-attachment", required: true}} />
          <Button label="Choose file" action={pickAttachmentAction} />
          <Button label="Attach to note" action={attachToNoteAction} />
        </Form>
        <RecordList records={attachments} accessibility={{label: "Vault attachments", role: "list"}}>
          <AttachmentRow attachment={attachments} />
        </RecordList>
      </Stack>
    </ModuleScreen>
  );
}

export const attachmentsScreen = screen("attachments", "collection", "Attachments", AttachmentsScreen, {states: collectionStates("No attachments yet", "Attachments are unavailable")});
