import {useRecords} from "@modula/product-ui";

export function useVaultSearch() {
  return useRecords({id: "searchResults", type: "note", searchParam: "q", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
}

export function useSavedSearches() {
  return useRecords({id: "savedSearches", type: "saved-search", searchParam: "q", sortParam: "sort", limit: 100});
}
