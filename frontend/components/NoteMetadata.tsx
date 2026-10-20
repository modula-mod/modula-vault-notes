import {Metadata, Row, type BindingRef} from "@modula/product-ui";

export function NoteMetadata({note}: {note: BindingRef}) {
  return (
    <Row gap="compact">
      <Metadata binding={note} valuePath="updatedAt" accessibility={{label: "Updated date"}} />
    </Row>
  );
}
