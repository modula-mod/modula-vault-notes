import {ModuleScreen, RecordList, Search, screen} from "@modula/product-ui";
import {TagChip} from "../components/TagChip";
import {collectionStates} from "../components/ScreenStates";
import {openTagAction} from "../features/notes/actions";
import {useTags} from "../hooks/useNotes";

function TagsScreen() {
  const tags = useTags();
  return <ModuleScreen title="Tags"><Search label="Search tags" records={tags} /><RecordList records={tags} action={openTagAction} accessibility={{label: "Vault tags", role: "list"}}><TagChip tag={tags} /></RecordList></ModuleScreen>;
}

export const tagsScreen = screen("tags", "collection", "Tags", TagsScreen, {states: collectionStates("No tags yet", "Tags are unavailable")});
