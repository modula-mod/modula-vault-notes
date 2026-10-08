import {describe, expect, it} from "vitest";
import {nodes, view} from "./artifact";

describe("Vault note surfaces", () => {
  it("composes list, detail, metadata, relationships, and intelligence", () => {
    expect(nodes(view("home").root).map(node => node.type)).toContain("recordList");
    const detail = nodes(view("detail").root);
    expect(detail.filter(node => node.type === "section").length).toBeGreaterThanOrEqual(7);
    expect(detail.map(node => node.action)).toContain("intelligenceSummarize");
    expect(detail.map(node => node.action)).toContain("openHistory");
  });

  it("declares loading, error, permission, and offline states", () => {
    for (const id of ["home", "detail", "search", "folder", "tag"]) {
      expect(Object.keys(view(id).states ?? {})).toEqual(expect.arrayContaining(["loading", "error", "permissionDenied", "offline"]));
    }
  });
});
