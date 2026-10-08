import {Metadata, RecordRow, Row, Stack, Text, type BindingRef} from "@modula/product-ui";
import {SensitiveBadge} from "./SensitiveBadge";

export function NoteRow({note}: {note: BindingRef}) {
  return (
    <RecordRow binding={note}>
      <Stack direction="vertical" gap="compact">
        <Text binding={note} valuePath="title" />
        <Text binding={note} valuePath="plainTextProjection" />
        <Row gap="compact">
          <Metadata binding={note} valuePath="updatedAt" />
          <SensitiveBadge note={note} />
        </Row>
      </Stack>
    </RecordRow>
  );
}
