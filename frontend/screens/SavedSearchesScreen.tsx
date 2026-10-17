import {ModuleScreen, RecordList, RecordRow, Search, Stack, Text, screen} from "@modula/product-ui";
import {collectionStates} from "../components/ScreenStates";
import {useSavedSearches} from "../hooks/useVaultSearch";

function SavedSearchesScreen() {
  const savedSearches = useSavedSearches();
  return (
    <ModuleScreen title="Saved Searches">
      <Stack direction="vertical" gap="regular">
        <Search label="Search saved searches" records={savedSearches} />
        <RecordList records={savedSearches} accessibility={{label: "Saved searches", role: "list"}}>
          <RecordRow binding={savedSearches} accessibility={{label: "Saved search", role: "listitem"}}>
            <Text binding={savedSearches} valuePath="name" />
            <Text binding={savedSearches} valuePath="query" />
          </RecordRow>
        </RecordList>
      </Stack>
    </ModuleScreen>
  );
}

export const savedSearchesScreen = screen("savedSearches", "collection", "Saved Searches", SavedSearchesScreen, {states: collectionStates("No saved searches yet", "Saved searches are unavailable")});
