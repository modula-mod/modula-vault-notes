import {Button, ModuleScreen, Row, Stack, Text, screen} from "@modula/product-ui";
import {EmptyVault} from "../components/EmptyVault";
import {errorState, loadingState} from "../components/ScreenStates";
import {NotesCollection} from "../components/NotesCollection";
import {
  newNoteAction,
  openFavouritesAction,
  openFoldersAction,
  openNoteAction,
  openPinnedAction,
  openTagsAction,
  openTrashAction,
} from "../features/notes/actions";
import {SearchBar} from "../features/search/SearchBar";
import {SearchFilters} from "../features/search/SearchFilters";
import {useActiveNotes} from "../hooks/useNotes";

function NotesScreen() {
  const notes = useActiveNotes();
  return (
    <ModuleScreen title="Vault Notes" accessibility={{label: "Vault Notes home"}}>
      <Row gap="regular">
        <Text text="Your notes" accessibility={{role: "header"}} />
        <Button label="New note" action={newNoteAction} />
      </Row>
      <SearchBar results={notes} />
      <Stack direction="vertical" gap="compact">
        <Text text="Browse" accessibility={{role: "header"}} />
        <Row gap="compact">
          <Button label="Pinned" action={openPinnedAction} />
          <Button label="Favourites" action={openFavouritesAction} />
          <Button label="Folders" action={openFoldersAction} />
        </Row>
        <Row gap="compact">
          <Button label="Tags" action={openTagsAction} />
          <Button label="Trash" action={openTrashAction} />
        </Row>
      </Stack>
      <Text text="All notes" accessibility={{role: "header"}} />
      <SearchFilters results={notes} />
      <NotesCollection notes={notes} openNote={openNoteAction} label="All Vault Notes" />
    </ModuleScreen>
  );
}

export const notesScreen = screen("home", "collection", "Vault Notes", NotesScreen, {
  states: {
    loading: loadingState("Loading your notes"),
    empty: <EmptyVault newNote={newNoteAction} />,
    error: errorState("Vault Notes could not be loaded"),
    permissionDenied: errorState("You do not have permission to read this vault"),
    offline: errorState("This host cannot open uncached notes while offline"),
  },
});
