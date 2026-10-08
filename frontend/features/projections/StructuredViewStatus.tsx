import {ErrorState, Metadata, Section, Stack, Text, useCapability} from "@modula/product-ui";
import {BOARD_PROJECTION, PROJECTION_REQUIREMENT, TABLE_PROJECTION} from "./projection-model";

export function StructuredViewStatus() {
  const table = useCapability({id: "tableCapability", capability: "ui.table@1"});
  const board = useCapability({id: "boardCapability", capability: "ui.board@1"});
  return (
    <Section title="Structured views">
      <Stack direction="vertical" gap="compact">
        <Text text={TABLE_PROJECTION} />
        <Metadata binding={table} valuePath="status" accessibility={{label: "Table capability status"}} />
        <Text text={BOARD_PROJECTION} />
        <Metadata binding={board} valuePath="status" accessibility={{label: "Board capability status"}} />
        <ErrorState label={PROJECTION_REQUIREMENT} accessibility={{role: "status"}} />
      </Stack>
    </Section>
  );
}
