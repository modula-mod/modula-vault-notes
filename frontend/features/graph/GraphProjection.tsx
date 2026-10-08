import {ErrorState, Metadata, Section, Stack, Text, useCapability, type BindingRef} from "@modula/product-ui";
import {GRAPH_DATA_MODEL, GRAPH_RENDERER_REQUIREMENT} from "./graph-model";

export function GraphProjection({notes, links}: {notes: BindingRef; links: BindingRef}) {
  const graph = useCapability({id: "graphCapability", capability: "ui.graph@1"});
  return (
    <Section title="Note graph" accessibility={{label: "Vault relationship graph"}}>
      <Stack direction="vertical" gap="regular">
        <Metadata binding={graph} valuePath="status" accessibility={{label: "Graph renderer capability status"}} />
        <Text text={GRAPH_DATA_MODEL} />
        <Metadata binding={notes} valuePath="count" accessibility={{label: "Graph note count"}} />
        <Metadata binding={links} valuePath="count" accessibility={{label: "Graph edge count"}} />
        <ErrorState label={GRAPH_RENDERER_REQUIREMENT} accessibility={{role: "status"}} />
      </Stack>
    </Section>
  );
}
