import {Metadata, RecordRow, Row, Text, type BindingRef} from "@modula/product-ui";

export function RevisionRow({revision}: {revision: BindingRef}) {
  return (
    <RecordRow binding={revision} accessibility={{label: "Note revision", role: "listitem"}}>
      <Row gap="regular">
        <Text binding={revision} valuePath="revision" />
        <Metadata binding={revision} valuePath="createdAt" />
        <Metadata binding={revision} valuePath="changeSource" />
      </Row>
    </RecordRow>
  );
}
