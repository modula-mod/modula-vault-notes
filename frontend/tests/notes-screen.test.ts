import {describe, expect, it} from "vitest";
import {action, nodes, view} from "./artifact";

describe("Vault note surfaces", () => {
  it("presents readable lists and a structured document reading surface", () => {
    expect(nodes(view("home").root).map(node => node.type)).toContain("recordList");
    const detail = nodes(view("detail").root);
    const toolbar = detail.find(node => node.type === "toolbar");
    expect(toolbar).toBeDefined();
    expect(nodes(toolbar!).map(node => node.action)).toEqual(expect.arrayContaining(["editNote", "deleteNote"]));
    expect(detail.some(node => node.type === "text" && node.valuePath === "document")).toBe(true);
    expect(detail.some(node => node.type === "text" && node.valuePath === "title")).toBe(true);
    expect(detail.map(node => node.type)).toEqual(expect.arrayContaining(["badge", "metadata"]));
    expect(detail.map(node => node.action)).toContain("editNote");
    expect(detail.map(node => node.action)).toContain("openHistory");
    expect(detail.map(node => node.action)).toContain("attachNoteMedia");
    expect(detail.map(node => node.action)).toContain("shareNote");
    expect(action("shareNote")).toMatchObject({family: "share", capability: "share.native@1"});
    expect(view("detail").bindings?.some(binding => binding.source === "record.media" && binding.recordType === "note")).toBe(true);
    expect(action("attachNoteMedia")).toMatchObject({family: "media.attach", recordType: "note", recordIdBinding: "note", capability: "ui.mediaAttach@1"});
    expect(action("openNoteMedia")).toMatchObject({family: "media.open", capability: "ui.mediaOpen@1"});
    expect(action("detachNoteMedia")).toMatchObject({family: "media.detach", recordType: "note", recordIdBinding: "note", confirm: true});
    expect(action("togglePin")).toMatchObject({family: "record.toggle", recordType: "note", recordField: "pinned", activeLabel: "Unpin"});
    expect(action("toggleFavourite")).toMatchObject({family: "record.toggle", recordType: "note", recordField: "favourite", activeLabel: "Remove from Favourites"});
    expect(action("deleteFolder")).toMatchObject({family: "record.delete", recordType: "folder", confirm: true});
    expect(action("deleteTag")).toMatchObject({family: "record.delete", recordType: "tag", confirm: true});
    expect(nodes(view("folder").root).map(node => node.action)).toContain("deleteFolder");
    expect(nodes(view("tag").root).map(node => node.action)).toContain("deleteTag");
    expect(nodes(view("trash").root).some(node => node.type === "recordList" && node.actions?.includes("restoreNote") && node.actions?.includes("purgeNote"))).toBe(true);
    // Native record lists dispatch only the row `action`, so restore must be the row action as well.
    expect(nodes(view("trash").root).some(node => node.type === "recordList" && node.action === "restoreNote")).toBe(true);
    expect(nodes(view("trash").root).some(node => node.type === "metadata" && node.valuePath === "deletedAt")).toBe(true);
  });

  it("states host filter limits instead of implying an empty or working collection", () => {
    const texts = (id: string) => nodes(view(id).root).flatMap(node => typeof node.text === "string" ? [node.text] : []);
    expect(texts("folder").some(text => text.includes("host applies the folder filter"))).toBe(true);
    expect(texts("tag").some(text => text.includes("host applies the tag filter"))).toBe(true);
    expect(texts("history").some(text => text.includes("host loads note revisions"))).toBe(true);
    expect(texts("savedSearches").some(text => text.includes("until the host can run a stored query"))).toBe(true);
  });

  it("declares loading, error, permission, and offline states", () => {
    for (const id of ["home", "detail", "search", "folder", "tag"]) {
      expect(Object.keys(view(id).states ?? {})).toEqual(expect.arrayContaining(["loading", "error", "permissionDenied", "offline"]));
    }
  });

  it("binds real note revisions and keeps restore revision-aware", () => {
    expect(view("history").bindings?.some(binding => binding.source === "record.revisions" && binding.recordType === "note")).toBe(true);
    expect(view("revision").bindings?.some(binding => binding.source === "record.revision" && binding.recordType === "note")).toBe(true);
    expect(action("restoreRevision")).toMatchObject({family: "record.restore", recordType: "note", recordIdBinding: "note", sourceRevisionParam: "revisionId"});
    expect(action("openRevision")).toMatchObject({recordParam: "revisionId"});
  });
});
