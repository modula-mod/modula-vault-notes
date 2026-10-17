import {Button, ModuleScreen, Row, Toolbar, screen} from "@modula/product-ui";
import {EmptyVault} from "../components/EmptyVault";
import {errorState, loadingState} from "../components/ScreenStates";
import {NotesCollection} from "../components/NotesCollection";
import {
  newNoteAction,
  openAttachmentsAction,
  openDailyAction,
  openFavouritesAction,
  openFoldersAction,
  openGraphAction,
  openNoteAction,
  openPinnedAction,
  openRecentAction,
  openSavedSearchesAction,
  openTagsAction,
  openTemplatesAction,
} from "../features/notes/actions";
import {PAGINATION_REQUIREMENT} from "../features/notes/queries";
import {SearchBar} from "../features/search/SearchBar";
import {SearchFilters} from "../features/search/SearchFilters";
import {StructuredViewStatus} from "../features/projections/StructuredViewStatus";
import {useActiveNotes} from "../hooks/useNotes";

function NotesScreen() {
  const notes = useActiveNotes();
  return (
    <ModuleScreen title="Vault Notes" accessibility={{label: PAGINATION_REQUIREMENT}}>
      <Toolbar label="Notes actions">
        <SearchBar results={notes} />
        <Button label="New note" action={newNoteAction} />
      </Toolbar>
      <SearchFilters results={notes} />
      <Row gap="compact" scroll="horizontal">
        <Button label="Pinned" action={openPinnedAction} />
        <Button label="Recent" action={openRecentAction} />
        <Button label="Favourites" action={openFavouritesAction} />
        <Button label="Folders" action={openFoldersAction} />
        <Button label="Tags" action={openTagsAction} />
        <Button label="Saved searches" action={openSavedSearchesAction} />
        <Button label="Templates" action={openTemplatesAction} />
        <Button label="Daily note" action={openDailyAction} />
        <Button label="Attachments" action={openAttachmentsAction} />
        <Button label="Graph" action={openGraphAction} />
      </Row>
      <NotesCollection notes={notes} openNote={openNoteAction} label="All Vault Notes" />
      <StructuredViewStatus />
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
