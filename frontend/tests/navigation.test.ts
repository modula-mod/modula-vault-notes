import {describe, expect, it} from "vitest";
import {artifact} from "./artifact";

describe("Vault route registration", () => {
  it("registers the complete multi-surface route set", () => {
    expect(artifact.routes.map(route => route.path)).toEqual([
      "/", "/new", "/note/:noteId", "/note/:noteId/edit", "/note/:noteId/history",
      "/note/:noteId/history/:revisionId", "/search", "/pinned", "/recent", "/favourites",
      "/archived", "/trash", "/folders", "/folder/:folderId", "/tags", "/tag/:tagId",
      "/templates", "/daily", "/attachments", "/saved-searches", "/graph", "/settings",
    ]);
    expect(artifact.entry).toBe("home");
  });

  it("keeps profile navigation bounded to Vault surfaces", () => {
    expect(artifact.navigation.rootView).toBe("home");
    expect(artifact.navigation.tabs.map(tab => tab.viewId)).toEqual(["home", "search"]);
    expect(artifact.navigation.secondary).toHaveLength(13);
  });
});
