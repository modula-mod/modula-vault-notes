import {Sort, Stack, type BindingRef} from "@modula/product-ui";

export function SearchFilters({results}: {results: BindingRef}) {
  return (
    <Stack direction="vertical" gap="compact">
      <Sort label="Sort results" records={results} accessibility={{label: "Sort notes"}} />
    </Stack>
  );
}
