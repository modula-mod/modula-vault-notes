import {Button, Menu, Metadata, ModuleScreen, RecordList, RecordRow, Section, Stack, Text, Toolbar, useRecordMedia, screen} from "@modula/product-ui";
import {NoteMetadata} from "../components/NoteMetadata";
import {SensitiveBadge} from "../components/SensitiveBadge";
import {errorState, loadingState} from "../components/ScreenStates";
import {attachNoteMediaAction, deleteNoteAction, detachNoteMediaAction, editNoteAction, openHistoryAction, openNoteMediaAction, toggleFavouriteAction, togglePinAction} from "../features/notes/actions";
import {useNote} from "../hooks/useNote";

function NoteDetailScreen() {
  const note = useNote();
  const media = useRecordMedia({id: "noteMedia", type: "note", idParam: "noteId"});
  return (
    <ModuleScreen title="Read note">
      <Stack direction="vertical" gap="regular">
        <Toolbar label="Note actions">
          <Button label="Edit" action={editNoteAction} />
          <Menu label="More">
            <Button label="History" action={openHistoryAction} />
            <Button label="Pin" action={togglePinAction} />
            <Button label="Add to Favourites" action={toggleFavouriteAction} />
            <Button label="Move to Trash" action={deleteNoteAction} />
          </Menu>
        </Toolbar>
        <Text binding={note} valuePath="title" accessibility={{role: "header"}} />
        <Text binding={note} valuePath="document" accessibility={{label: "Note body"}} />
        <Section title="Attachments">
          <Button label="Attach file" action={attachNoteMediaAction} />
          <RecordList records={media} action={openNoteMediaAction} actions={[detachNoteMediaAction]} accessibility={{label: "Attached files", role: "list"}}>
            <RecordRow binding={media} accessibility={{label: "Attached file", role: "listitem"}}>
              <Text binding={media} valuePath="filename" />
              <Metadata binding={media} valuePath="contentType" />
            </RecordRow>
          </RecordList>
        </Section>
        <SensitiveBadge note={note} />
        <NoteMetadata note={note} />
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
