import {Metadata, RecordRow, Stack, Text, type BindingRef} from "@modula/product-ui";

export function FolderRow({folder}: {folder: BindingRef}) {
  return (
    <RecordRow binding={folder} accessibility={{label: "Folder", role: "listitem"}}>
      <Stack direction="vertical" gap="compact">
        <Text binding={folder} valuePath="name" />
        <Metadata binding={folder} valuePath="updatedAt" />
      </Stack>
    </RecordRow>
  );
}
