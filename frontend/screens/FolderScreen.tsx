import {Button, ModuleScreen, Text, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {collectionStates} from "../components/ScreenStates";
import {editFolderAction, openNoteAction} from "../features/notes/actions";
import {useFolder, useFolderNotes} from "../hooks/useNotes";

function FolderScreen() {
  const folder = useFolder();
  const notes = useFolderNotes();
  return <ModuleScreen title="Folder"><Text binding={folder} valuePath="name" accessibility={{role: "header"}} /><Button label="Rename folder" action={editFolderAction} /><NotesCollection notes={notes} openNote={openNoteAction} label="Notes in folder" /></ModuleScreen>;
}

export const folderScreen = screen("folder", "collection", "Folder", FolderScreen, {states: collectionStates("This folder is empty", "This folder is unavailable")});
