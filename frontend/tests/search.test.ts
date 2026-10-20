import {describe, expect, it} from "vitest";
import {nodes, view} from "./artifact";

describe("Vault query surfaces", () => {
  it("exposes search, sort and readable result rows", () => {
    const types = nodes(view("search").root).map(node => node.type);
    expect(types).toEqual(expect.arrayContaining(["search", "sort", "recordList"]));
    expect(nodes(view("search").root).some(node => node.valuePath === "plainTextProjection")).toBe(true);
  });

  it("keeps folder, tag, saved-search, and collection queries bounded", () => {
    for (const id of ["folder", "tag", "savedSearches", "pinned", "recent", "favourites", "archived", "trash"]) {
      expect(view(id).bindings?.some(binding => binding.source === "record.query")).toBe(true);
    }
  });

  it("filters tag notes using the canonical tag ID membership binding", () => {
    expect(view("tag").bindings?.find(binding => binding.id === "notes")?.query).toMatchObject({membership: {field: "tagIds", param: "tagId"}});
  });
});
