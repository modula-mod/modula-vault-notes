import {describe, expect, it} from "vitest";
import {nodes, view} from "./artifact";

describe("Vault query surfaces", () => {
  it("exposes search, filter, and sort as separate controls", () => {
    const types = nodes(view("search").root).map(node => node.type);
    expect(types).toEqual(expect.arrayContaining(["search", "filter", "sort", "recordList"]));
  });

  it("keeps folder, tag, saved-search, and collection queries bounded", () => {
    for (const id of ["folder", "tag", "savedSearches", "pinned", "recent", "favourites", "archived", "trash"]) {
      expect(view(id).bindings?.some(binding => binding.source === "record.query")).toBe(true);
    }
  });
});
