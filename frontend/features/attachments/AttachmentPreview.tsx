import {ErrorState, Media, Metadata, Stack, useCapability, type BindingRef} from "@modula/product-ui";

export function AttachmentPreview({attachment}: {attachment: BindingRef}) {
  const gallery = useCapability({id: "attachmentGalleryCapability", capability: "ui.attachment-gallery@1"});
  return (
    <Stack direction="vertical" gap="compact">
      <Metadata binding={gallery} valuePath="status" accessibility={{label: "Attachment preview capability status"}} />
      <Media binding={attachment} valuePath="assetId" accessibility={{label: "Authorized attachment preview"}} />
      <ErrorState label="PDF and audio previews require generic authorized asset renderers" accessibility={{role: "status"}} />
    </Stack>
  );
}
