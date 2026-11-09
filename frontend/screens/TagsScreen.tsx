import {Button, EmptyState, ModuleScreen, RecordList, Search, Text, screen} from "@modula/product-ui";
import {TagChip} from "../components/TagChip";
import {newTagAction, openTagAction} from "../features/notes/actions";
import {useTags} from "../hooks/useNotes";

function TagsScreen() {
  const tags = useTags();
  return <ModuleScreen title="Tags"><Button label="New tag" action={newTagAction} /><Search label="Search tags" records={tags} /><RecordList records={tags} action={openTagAction} accessibility={{label: "Vault tags", role: "list"}}><TagChip tag={tags} /></RecordList></ModuleScreen>;
}

export const tagsScreen = screen("tags", "collection", "Tags", TagsScreen, {states: {
  loading: <Text text="Loading tags…" />,
  empty: <EmptyState label="No tags yet"><Text text="Create a tag to connect notes across folders." /><Button label="Create tag" action={newTagAction} /></EmptyState>,
  error: <Text text="Tags are unavailable" />,
  permissionDenied: <Text text="You do not have permission to view tags" />,
  offline: <Text text="Tags are unavailable while offline" />,
}});
