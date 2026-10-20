import {RecordRow, Text, type BindingRef} from "@modula/product-ui";

export function FolderRow({folder}: {folder: BindingRef}) {
  return (
    <RecordRow binding={folder} accessibility={{label: "Folder", role: "listitem"}}>
      <Text binding={folder} valuePath="name" />
    </RecordRow>
  );
}
