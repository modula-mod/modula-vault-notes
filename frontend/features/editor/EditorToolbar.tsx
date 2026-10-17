import {Button, Metadata, Toolbar, useCapability} from "@modula/product-ui";
import {TOOLBAR_CAPABILITY_NOTE} from "../../lib/formatting";
import {
  attachmentCommand,
  boldCommand,
  bulletCommand,
  calloutCommand,
  checklistCommand,
  codeCommand,
  headingCommand,
  italicCommand,
  linkCommand,
  numberedCommand,
  quoteCommand,
  referenceCommand,
  strikeCommand,
  tableCommand,
} from "./commands";

export function EditorToolbar() {
  const formatting = useCapability({id: "formattingCapability", capability: "ui.richText.commands@1"});
  return (
    <Toolbar label="Document formatting" accessibility={{label: TOOLBAR_CAPABILITY_NOTE}}>
      <Metadata binding={formatting} valuePath="status" accessibility={{label: "Formatting capability status"}} />
      <Button label="Heading" action={headingCommand} />
      <Button label="Bold" action={boldCommand} />
      <Button label="Italic" action={italicCommand} />
      <Button label="Strike" action={strikeCommand} />
      <Button label="Code" action={codeCommand} />
      <Button label="Quote" action={quoteCommand} />
      <Button label="Bullets" action={bulletCommand} />
      <Button label="Numbered list" action={numberedCommand} />
      <Button label="Checklist" action={checklistCommand} />
      <Button label="Link" action={linkCommand} />
      <Button label="Reference" action={referenceCommand} />
      <Button label="Attachment" action={attachmentCommand} />
      <Button label="Callout" action={calloutCommand} />
      <Button label="Table" action={tableCommand} />
    </Toolbar>
  );
}
