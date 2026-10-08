import {Search, type BindingRef} from "@modula/product-ui";

export function SearchBar({results}: {results: BindingRef}) {
  return <Search label="Search titles, bodies, tags, folders, properties, and attachments" records={results} accessibility={{label: "Search Vault Notes", role: "search"}} />;
}
