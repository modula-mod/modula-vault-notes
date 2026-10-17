import {Filter, ModuleScreen, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {collectionStates} from "../components/ScreenStates";
import {openNoteAction, purgeNoteAction, restoreNoteAction} from "../features/notes/actions";
import {
  useArchivedNotes,
  useDeletedNotes,
  useFavouriteNotes,
  usePinnedNotes,
  useRecentNotes,
} from "../hooks/useNotes";
import {RecordList} from "@modula/product-ui";
import {NoteRow} from "../components/NoteRow";

function PinnedNotesScreen() {
  const notes = usePinnedNotes();
  return <ModuleScreen title="Pinned"><Filter label="Pinned notes" records={notes} /><NotesCollection notes={notes} openNote={openNoteAction} label="Pinned notes" /></ModuleScreen>;
}

function RecentNotesScreen() {
  const notes = useRecentNotes();
  return <ModuleScreen title="Recently edited"><Filter label="Recently edited" records={notes} /><NotesCollection notes={notes} openNote={openNoteAction} label="Recently edited notes" /></ModuleScreen>;
}

function FavouriteNotesScreen() {
  const notes = useFavouriteNotes();
  return <ModuleScreen title="Favourites"><Filter label="Favourite notes" records={notes} /><NotesCollection notes={notes} openNote={openNoteAction} label="Favourite notes" /></ModuleScreen>;
}

function ArchivedNotesScreen() {
  const notes = useArchivedNotes();
  return <ModuleScreen title="Archived"><Filter label="Archived notes" records={notes} /><NotesCollection notes={notes} openNote={openNoteAction} label="Archived notes" /></ModuleScreen>;
}

function TrashScreen() {
  const notes = useDeletedNotes();
  return (
    <ModuleScreen title="Trash">
      <Filter label="Deleted notes" records={notes} />
      <RecordList records={notes} actions={[restoreNoteAction, purgeNoteAction]} accessibility={{label: "Deleted notes", role: "list"}}>
        <NoteRow note={notes} />
      </RecordList>
    </ModuleScreen>
  );
}

export const pinnedScreen = screen("pinned", "collection", "Pinned notes", PinnedNotesScreen, {states: collectionStates("No pinned notes yet", "Pinned notes are unavailable")});
export const recentScreen = screen("recent", "collection", "Recently edited", RecentNotesScreen, {states: collectionStates("No recent notes", "Recent notes are unavailable")});
export const favouritesScreen = screen("favourites", "collection", "Favourite notes", FavouriteNotesScreen, {states: collectionStates("No favourite notes yet", "Favourite notes are unavailable")});
export const archivedScreen = screen("archived", "collection", "Archived notes", ArchivedNotesScreen, {states: collectionStates("No archived notes", "Archived notes are unavailable")});
export const trashScreen = screen("trash", "collection", "Trash", TrashScreen, {states: collectionStates("Trash is empty", "Trash is unavailable")});
