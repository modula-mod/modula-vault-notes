import {Filter, Sort, Stack, Text, type BindingRef} from "@modula/product-ui";
import {SEARCH_FILTER_SUMMARY, UNSUPPORTED_FILTER_SUMMARY} from "../notes/filters";
import {NOTE_SORT_SUMMARY} from "../notes/sort";

export function SearchFilters({results}: {results: BindingRef}) {
  return (
    <Stack direction="vertical" gap="compact">
      <Filter label="Search filters" records={results} accessibility={{label: SEARCH_FILTER_SUMMARY}} />
      <Sort label="Sort results" records={results} accessibility={{label: NOTE_SORT_SUMMARY}} />
      <Text text={UNSUPPORTED_FILTER_SUMMARY} accessibility={{role: "status"}} />
    </Stack>
  );
}
