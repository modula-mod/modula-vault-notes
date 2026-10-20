import {ModuleScreen, RecordList, Stack, Text, screen} from "@modula/product-ui";
import {SearchResultRow} from "../components/SearchResultRow";
import {collectionStates} from "../components/ScreenStates";
import {openNoteAction} from "../features/notes/actions";
import {SearchBar} from "../features/search/SearchBar";
import {SearchFilters} from "../features/search/SearchFilters";
import {SEARCH_PRIVACY, SEARCH_SCOPE} from "../features/search/search-model";
import {useVaultSearch} from "../hooks/useVaultSearch";

function SearchScreen() {
  const results = useVaultSearch();
  return (
    <ModuleScreen title="Search">
      <Stack direction="vertical" gap="regular">
        <SearchBar results={results} />
        <SearchFilters results={results} />
        <Text text={SEARCH_SCOPE} />
        <Text text={SEARCH_PRIVACY} accessibility={{role: "status"}} />
        <RecordList records={results} action={openNoteAction} accessibility={{label: "Search results", role: "list"}}>
          <SearchResultRow note={results} />
        </RecordList>
      </Stack>
    </ModuleScreen>
  );
}

export const searchScreen = screen("search", "collection", "Search", SearchScreen, {states: collectionStates("No notes match this search", "Search is unavailable")});
