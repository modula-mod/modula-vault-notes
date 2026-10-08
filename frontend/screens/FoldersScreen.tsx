import {ModuleScreen, RecordList, Search, screen} from "@modula/product-ui";
import {FolderRow} from "../components/FolderRow";
import {collectionStates} from "../components/ScreenStates";
import {openFolderAction} from "../features/notes/actions";
import {useFolders} from "../hooks/useNotes";

function FoldersScreen() {
  const folders = useFolders();
  return <ModuleScreen title="Folders"><Search label="Search folders" records={folders} /><RecordList records={folders} action={openFolderAction} accessibility={{label: "Vault folders", role: "list"}}><FolderRow folder={folders} /></RecordList></ModuleScreen>;
}

export const foldersScreen = screen("folders", "collection", "Folders", FoldersScreen, {states: collectionStates("No folders yet", "Folders are unavailable")});
