import {Button, Menu, ModuleScreen, Text, Toolbar, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {collectionStates} from "../components/ScreenStates";
import {deleteFolderAction, editFolderAction, openHomeAction, openNoteAction} from "../features/notes/actions";
import {useFolder, useFolderNotes} from "../hooks/useNotes";

function FolderScreen() {
  const folder = useFolder();
  const notes = useFolderNotes();
  return <ModuleScreen title="Folder"><Toolbar label="Folder actions"><Button label="Notes" action={openHomeAction} /><Menu label="More"><Button label="Rename folder" action={editFolderAction} /><Button label="Delete folder" action={deleteFolderAction} /></Menu></Toolbar><Text binding={folder} valuePath="name" accessibility={{role: "header"}} /><Text text="This list may be empty or include notes from other folders." /><NotesCollection notes={notes} openNote={openNoteAction} label="Notes in folder" /></ModuleScreen>;
}

export const folderScreen = screen("folder", "collection", "Folder", FolderScreen, {states: collectionStates("This folder is empty", "This folder is unavailable")});
