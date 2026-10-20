import {Search, type BindingRef} from "@modula/product-ui";

export function SearchBar({results}: {results: BindingRef}) {
  return <Search label="Search notes" records={results} accessibility={{label: "Search notes", role: "search"}} />;
}
