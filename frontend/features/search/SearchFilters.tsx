import {Sort, Stack, type BindingRef} from "@modula/product-ui";
import {NOTE_SORT_SUMMARY} from "../notes/sort";

export function SearchFilters({results}: {results: BindingRef}) {
  return (
    <Stack direction="vertical" gap="compact">
      <Sort label="Sort results" records={results} accessibility={{label: NOTE_SORT_SUMMARY}} />
    </Stack>
  );
}
