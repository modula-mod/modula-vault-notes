import {Button, ModuleScreen, Section, Stack, Text, Toolbar, screen} from "@modula/product-ui";
import {NoteMetadata} from "../components/NoteMetadata";
import {SensitiveBadge} from "../components/SensitiveBadge";
import {errorState, loadingState} from "../components/ScreenStates";
import {AttachmentList} from "../features/attachments/AttachmentList";
import {IntelligenceMenu} from "../features/intelligence/IntelligenceMenu";
import {Backlinks} from "../features/links/Backlinks";
import {RelatedNotes} from "../features/links/RelatedNotes";
import {deleteNoteAction, editNoteAction, openHistoryAction, openNoteAction, shareNoteAction} from "../features/notes/actions";
import {PropertiesPanel} from "../features/properties/PropertiesPanel";
import {useNote} from "../hooks/useNote";
import {useBacklinkNotes, useRelatedNotes} from "../hooks/useNotes";

function NoteDetailScreen() {
  const note = useNote();
  const backlinks = useBacklinkNotes();
  const related = useRelatedNotes();
  return (
    <ModuleScreen title="Note">
      <Stack direction="vertical" gap="regular" responsive={[{class: "compact", columns: 1}, {class: "wide", columns: 2}]}>
        <Toolbar label="Note actions">
          <Button label="Edit" action={editNoteAction} />
          <Button label="History" action={openHistoryAction} />
          <Button label="Share" action={shareNoteAction} />
          <Button label="Move to Trash" action={deleteNoteAction} />
        </Toolbar>
        <Section title="Document">
          <Text binding={note} valuePath="title" accessibility={{role: "header"}} />
          <Text binding={note} valuePath="plainTextProjection" accessibility={{label: "Note document"}} />
          <SensitiveBadge note={note} />
          <NoteMetadata note={note} />
        </Section>
        <Section title="Organization">
          <Text binding={note} valuePath="folderId" accessibility={{label: "Folder"}} />
          <Text binding={note} valuePath="tagIds" accessibility={{label: "Tags"}} />
        </Section>
        <PropertiesPanel note={note} editable={false} />
        <AttachmentList note={note} editable={false} />
        <Backlinks notes={backlinks} openNote={openNoteAction} />
        <RelatedNotes notes={related} openNote={openNoteAction} />
        <IntelligenceMenu note={note} />
      </Stack>
    </ModuleScreen>
  );
}

export const noteDetailScreen = screen("detail", "detail", "Note", NoteDetailScreen, {
  states: {
    loading: loadingState("Loading note"),
    error: errorState("This note is unavailable"),
    permissionDenied: errorState("You do not have permission to read this note"),
    offline: errorState("This note is not cached for offline access on this host"),
  },
});
