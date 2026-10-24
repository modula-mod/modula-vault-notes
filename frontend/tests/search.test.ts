import {describe, expect, it} from "vitest";
import {nodes, view} from "./artifact";

describe("Vault query surfaces", () => {
  it("exposes search and sort controls with filtering through the bounded query", () => {
    const searchView = view("search");
    const searchNodes = nodes(searchView.root);
    expect(searchNodes.map(node => node.type)).toEqual(expect.arrayContaining(["search", "sort", "recordList"]));
    for (const type of ["search", "sort", "recordList"]) {
      expect(searchNodes.find(node => node.type === type)?.binding).toBe("searchResults");
    }
    // 2.0.2 has no separate filter control; filtering stays a bounded query parameter.
    const results = searchView.bindings?.find(binding => binding.id === "searchResults") as
      {source?: string; query?: {searchParam?: string; sortParam?: string; filterParam?: string; limit?: number}} | undefined;
    expect(results?.source).toBe("record.query");
    expect(results?.query).toMatchObject({searchParam: "q", sortParam: "sort", filterParam: "filter"});
    expect(results?.query?.limit).toBeLessThanOrEqual(100);
  });

  it("keeps folder, tag, saved-search, and collection queries bounded", () => {
    for (const id of ["folder", "tag", "savedSearches", "pinned", "recent", "favourites", "archived", "trash"]) {
      expect(view(id).bindings?.some(binding => binding.source === "record.query")).toBe(true);
    }
  });
});
