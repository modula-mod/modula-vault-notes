import {Metadata, Row, type BindingRef} from "@modula/product-ui";

export function NoteMetadata({note}: {note: BindingRef}) {
  return (
    <Row gap="compact">
      <Metadata binding={note} valuePath="createdAt" accessibility={{label: "Created date"}} />
      <Metadata binding={note} valuePath="updatedAt" accessibility={{label: "Updated date"}} />
      <Metadata binding={note} valuePath="revision" accessibility={{label: "Revision"}} />
    </Row>
  );
}
