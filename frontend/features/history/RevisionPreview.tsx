import {Metadata, Section, Stack, Text, type BindingRef} from "@modula/product-ui";

export function RevisionPreview({revision}: {revision: BindingRef}) {
  return (
    <Section title="Revision checkpoint">
      <Stack direction="vertical" gap="regular">
        <Metadata binding={revision} valuePath="revision" />
        <Metadata binding={revision} valuePath="createdAt" />
        <Metadata binding={revision} valuePath="changeSource" />
        <Text binding={revision} valuePath="snapshot.title" accessibility={{role: "header"}} />
        <Text binding={revision} valuePath="snapshot.document" />
      </Stack>
    </Section>
  );
}
