import {ModuleScreen, RecordList, RecordRow, Search, Stack, Text, screen} from "@modula/product-ui";
import {ReturnHome} from "../components/ReturnHome";
import {collectionStates} from "../components/ScreenStates";
import {useSavedSearches} from "../hooks/useVaultSearch";

function SavedSearchesScreen() {
  const savedSearches = useSavedSearches();
  return (
    <ModuleScreen title="Saved Searches">
      <ReturnHome />
      <Stack direction="vertical" gap="regular">
        <Text text="Saved searches are listed here. Opening one is unavailable until the host can run a stored query." />
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
