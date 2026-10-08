import {Button, ErrorState, Metadata, Section, Stack, Text, useCapability, type BindingRef} from "@modula/product-ui";
import {LOCAL_ONLY_NOTICE} from "../../lib/permissions";
import {
  askNoteAction,
  extractTasksAction,
  rewriteAction,
  semanticRelatedAction,
  suggestTagsAction,
  suggestTitleAction,
  summarizeAction,
} from "./actions";
import {LOCAL_INTELLIGENCE_UNAVAILABLE} from "./privacy";

export function IntelligenceMenu({note}: {note: BindingRef}) {
  const intelligence = useCapability({id: "localIntelligenceCapability", capability: "ui.local-intelligence@1"});
  return (
    <Section title="Local intelligence" accessibility={{label: "Nodus actions"}}>
      <Stack direction="vertical" gap="compact">
        <Metadata binding={intelligence} valuePath="status" accessibility={{label: "Local intelligence capability status"}} />
        <Metadata binding={note} valuePath="intelligencePolicy" accessibility={{label: "Note intelligence policy"}} />
        <Text text={LOCAL_ONLY_NOTICE} accessibility={{role: "status"}} />
        <Button label="Summarize" action={summarizeAction} />
        <Button label="Rewrite" action={rewriteAction} />
        <Button label="Extract tasks for review" action={extractTasksAction} />
        <Button label="Suggest tags" action={suggestTagsAction} />
        <Button label="Suggest title" action={suggestTitleAction} />
        <Button label="Ask this note" action={askNoteAction} />
        <Button label="Find related notes" action={semanticRelatedAction} />
        <ErrorState label={LOCAL_INTELLIGENCE_UNAVAILABLE} accessibility={{role: "status"}} />
      </Stack>
    </Section>
  );
}
