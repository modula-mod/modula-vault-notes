import {describe, expect, it} from "vitest";
import {action, artifact, fieldIds, nodes, view} from "./artifact";

describe("Vault editor architecture", () => {
  it("keeps new and edit surfaces aligned", () => {
    const expected = ["title", "document", "folderId", "tagIds", "pinned", "favourite"];
    expect(fieldIds("newEditor")).toEqual(expected);
    expect(fieldIds("editor")).toEqual(expected);
    expect(nodes(view("newEditor").root).find(node => node.action === "createNote")?.accessibility?.role).toBe("form");
    expect(nodes(view("editor").root).find(node => node.action === "updateNote")?.accessibility?.role).toBe("form");
  });

  it("registers generic formatting commands rather than private controls", () => {
    const commandIds = ["formatHeading", "formatBold", "formatItalic", "formatStrike", "formatCode", "formatQuote", "formatBulletList", "formatNumberedList", "formatChecklist", "insertLink", "insertReference", "insertAttachment", "formatCallout", "insertTable"];
    for (const id of commandIds) expect(action(id).family).toBe("capability.invoke");
    expect(artifact.capabilities.optional).toContain("ui.richText.commands@1");
    expect(artifact.capabilities.required).toContain("ui.richText@1");
    const editorNodes = nodes(view("editor").root);
    const body = editorNodes.find(node => node.field?.id === "document");
    expect(body?.field?.type).toBe("richText");
    expect((body?.field as {capability?: string} | undefined)?.capability).toBe("ui.richText@1");
    expect(editorNodes.map(node => node.type)).not.toContain("toolbar");
    expect(editorNodes.map(node => node.action)).toContain("attachNoteMedia");
    expect(nodes(view("newEditor").root).map(node => node.action)).not.toContain("attachNoteMedia");
  });
});
