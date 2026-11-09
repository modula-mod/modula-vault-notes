import {Button, EmptyState, ModuleScreen, RecordList, Search, Text, screen} from "@modula/product-ui";
import {FolderRow} from "../components/FolderRow";
import {newFolderAction, openFolderAction} from "../features/notes/actions";
import {useFolders} from "../hooks/useNotes";

function FoldersScreen() {
  const folders = useFolders();
  return <ModuleScreen title="Folders"><Button label="New folder" action={newFolderAction} /><Search label="Search folders" records={folders} /><RecordList records={folders} action={openFolderAction} accessibility={{label: "Vault folders", role: "list"}}><FolderRow folder={folders} /></RecordList></ModuleScreen>;
}

export const foldersScreen = screen("folders", "collection", "Folders", FoldersScreen, {states: {
  loading: <Text text="Loading folders…" />,
  empty: <EmptyState label="No folders yet"><Text text="Create a folder to keep related notes together." /><Button label="Create folder" action={newFolderAction} /></EmptyState>,
  error: <Text text="Folders are unavailable" />,
  permissionDenied: <Text text="You do not have permission to view folders" />,
  offline: <Text text="Folders are unavailable while offline" />,
}});
