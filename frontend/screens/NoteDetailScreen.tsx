import {Button, ModuleScreen, Stack, Text, Toolbar, screen} from "@modula/product-ui";
import {NoteMetadata} from "../components/NoteMetadata";
import {SensitiveBadge} from "../components/SensitiveBadge";
import {errorState, loadingState} from "../components/ScreenStates";
import {deleteNoteAction, editNoteAction} from "../features/notes/actions";
import {useNote} from "../hooks/useNote";

function NoteDetailScreen() {
  const note = useNote();
  return (
    <ModuleScreen title="Note">
      <Stack direction="vertical" gap="regular">
        <Toolbar label="Note actions">
          <Button label="Edit" action={editNoteAction} />
          <Button label="Move to Trash" action={deleteNoteAction} />
        </Toolbar>
        <Text binding={note} valuePath="title" accessibility={{role: "header"}} />
        <Text binding={note} valuePath="plainTextProjection" accessibility={{label: "Note"}} />
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
