import {Icon, RecordRow, Row, Text, type BindingRef} from "@modula/product-ui";

export function FolderRow({folder}: {folder: BindingRef}) {
  return (
    <RecordRow binding={folder} accessibility={{label: "Folder", role: "listitem"}}>
      <Row gap="regular">
        <Icon icon="folder" accessibility={{hidden: true}} />
        <Text binding={folder} valuePath="name" />
      </Row>
    </RecordRow>
  );
}
