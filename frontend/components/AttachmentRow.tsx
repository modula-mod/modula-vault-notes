import {Metadata, RecordRow, Stack, Text, type BindingRef} from "@modula/product-ui";
import {AttachmentPreview} from "../features/attachments/AttachmentPreview";

export function AttachmentRow({attachment}: {attachment: BindingRef}) {
  return (
    <RecordRow binding={attachment} accessibility={{label: "Attachment", role: "listitem"}}>
      <Stack direction="vertical" gap="compact">
        <Text binding={attachment} valuePath="name" />
        <Metadata binding={attachment} valuePath="mimeType" />
        <Metadata binding={attachment} valuePath="size" />
        <Metadata binding={attachment} valuePath="createdAt" />
        <AttachmentPreview attachment={attachment} />
      </Stack>
    </RecordRow>
  );
}
