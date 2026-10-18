import {describe, expect, it} from "vitest";
import {action, artifact, fieldIds, nodes, view} from "./artifact";

describe("Vault editor architecture", () => {
  it("keeps new and edit surfaces aligned", () => {
    const expected = ["title", "document", "folderId", "tagIds", "pinned", "favourite"];
    expect(fieldIds("newEditor")).toEqual(expect.arrayContaining(expected));
    expect(fieldIds("editor")).toEqual(expect.arrayContaining(expected));
    expect(nodes(view("newEditor").root).find(node => node.action === "createNote")?.accessibility?.role).toBe("form");
    expect(nodes(view("editor").root).find(node => node.action === "updateNote")?.accessibility?.role).toBe("form");
  });

  it("registers generic formatting commands rather than private controls", () => {
    const commandIds = ["formatHeading", "formatBold", "formatItalic", "formatStrike", "formatCode", "formatQuote", "formatBulletList", "formatNumberedList", "formatChecklist", "insertLink", "insertReference", "insertAttachment", "formatCallout", "insertTable"];
    for (const id of commandIds) expect(action(id).family).toBe("capability.invoke");
    expect(artifact.capabilities.optional).toContain("ui.richText.commands@1");
    expect(nodes(view("editor").root).some(node => node.field?.type === "richText")).toBe(true);
    expect(nodes(view("editor").root).map(node => node.action)).toContain("attachNoteMedia");
    expect(nodes(view("newEditor").root).map(node => node.action)).not.toContain("attachNoteMedia");
  });
});
