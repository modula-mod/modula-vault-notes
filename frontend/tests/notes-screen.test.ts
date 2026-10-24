import {describe, expect, it} from "vitest";
import {nodes, view} from "./artifact";

describe("Vault note surfaces", () => {
  it("composes list, detail actions, document, and metadata", () => {
    expect(nodes(view("home").root).map(node => node.type)).toContain("recordList");
    const detail = nodes(view("detail").root);
    // 2.0.2 detail: one action toolbar (Edit, Move to Trash) above the note title, body,
    // sensitivity badge and metadata.
    const toolbar = detail.find(node => node.type === "toolbar");
    expect(toolbar).toBeDefined();
    expect(nodes(toolbar!).map(node => node.action)).toEqual(expect.arrayContaining(["editNote", "deleteNote"]));
    const textPaths = detail.filter(node => node.type === "text").map(node => (node as {valuePath?: string}).valuePath);
    expect(textPaths).toEqual(expect.arrayContaining(["title", "plainTextProjection"]));
    expect(detail.map(node => node.type)).toEqual(expect.arrayContaining(["badge", "metadata"]));
    expect(detail.every(node => node.binding === undefined || node.binding === "note")).toBe(true);
  });

  it("declares loading, error, permission, and offline states", () => {
    for (const id of ["home", "detail", "search", "folder", "tag"]) {
      expect(Object.keys(view(id).states ?? {})).toEqual(expect.arrayContaining(["loading", "error", "permissionDenied", "offline"]));
    }
  });
});
