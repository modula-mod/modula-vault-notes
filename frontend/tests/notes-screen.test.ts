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
    expect(action("shareNote")).toMatchObject({family: "share", capability: "share.native@1", recordIdBinding: "note"});
    // The share binding must name the detail view's current-note record binding, so the host shares exactly this note.
    expect(view("detail").bindings?.some(binding => binding.id === "note" && binding.source === "record.detail" && binding.recordType === "note" && binding.recordIdParam === "noteId")).toBe(true);
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
    const trashNodes = nodes(view("trash").root);
    // Restore is visible on each row, and permanent delete is not rendered as a row control.
    expect(trashNodes.some(node => node.type === "text" && node.text === "Restore" && (node as {accessibility?: {label?: string}}).accessibility?.label === "Restore")).toBe(true);
    expect(trashNodes.some(node => node.text === "Delete permanently" || (node.type === "button" && node.action === "purgeNote"))).toBe(false);
    expect(nodes(view("trash").root).some(node => node.type === "metadata" && node.valuePath === "deletedAt")).toBe(true);
  });

  it("states collection limits in short notices", () => {
    const texts = (id: string) => nodes(view(id).root).flatMap(node => typeof node.text === "string" ? [node.text] : []);
    const notices: Array<[string, string]> = [
      ["folder", "This list may be empty or include notes from other folders."],
      ["tag", "This list may be empty or include notes without this tag."],
      ["history", "This list may be empty until revision history can be loaded."],
      ["savedSearches", "You can see saved searches here, but they can't be opened yet."],
    ];
    for (const [id, notice] of notices) {
      expect(texts(id), id).toContain(notice);
      expect(notice.length, notice).toBeLessThan(90);
    }
    expect(texts("history")).toContain("Restores create a new revision and never delete intervening history.");
    for (const id of ["folder", "tag", "history", "savedSearches"]) {
      for (const text of texts(id)) {
        expect(text, id).not.toMatch(/the host|stored query/i);
      }
    }
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
