import {Metadata, RecordRow, Row, Stack, Text, type BindingRef} from "@modula/product-ui";
import {SensitiveBadge} from "./SensitiveBadge";

/** Restore is the Trash list's row action; the trailing text makes it visible. Permanent delete is not rendered here. */
export function DeletedNoteRow({note}: {note: BindingRef}) {
  return (
    <RecordRow binding={note}>
      <Row gap="regular">
        <Stack direction="vertical" gap="compact">
          <Text binding={note} valuePath="title" />
          <Text binding={note} valuePath="plainTextProjection" />
          <Row gap="compact">
            <Metadata binding={note} valuePath="deletedAt" accessibility={{label: "Deleted date"}} />
            <SensitiveBadge note={note} />
          </Row>
        </Stack>
        <Text text="Restore" accessibility={{label: "Restore"}} />
      </Row>
    </RecordRow>
  );
}
