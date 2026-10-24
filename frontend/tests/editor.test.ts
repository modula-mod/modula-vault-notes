import {describe, expect, it} from "vitest";
import {action, artifact, fieldIds, nodes, view} from "./artifact";

describe("Vault editor architecture", () => {
  it("keeps new and edit surfaces aligned", () => {
    // 2.0.2 editor: note content plus organisation only (template, icon, sensitivity and
    // intelligence policy moved out of the editor surface).
    const expected = ["title", "document", "folderId", "tagIds", "pinned", "favourite"];
    expect(fieldIds("newEditor")).toEqual(expected);
    expect(fieldIds("editor")).toEqual(expected);
    for (const [id, save] of [["newEditor", "createNote"], ["editor", "updateNote"]]) {
      const buttons = nodes(view(id).root).filter(node => node.type === "button");
      expect(buttons.find(node => node.text === "Save note")?.action).toBe(save);
    }
  });

  it("registers generic formatting commands rather than private controls", () => {
    const commandIds = ["formatHeading", "formatBold", "formatItalic", "formatStrike", "formatCode", "formatQuote", "formatBulletList", "formatNumberedList", "formatChecklist", "insertLink", "insertReference", "insertAttachment", "formatCallout", "insertTable"];
    for (const id of commandIds) expect(action(id).family).toBe("capability.invoke");
    expect(artifact.capabilities.optional).toContain("ui.richText.commands@1");
    expect(artifact.capabilities.required).toContain("ui.richText@1");
    // The body is a host rich-text field; 2.0.2 ships no private formatting toolbar in the editor.
    const editorNodes = nodes(view("editor").root);
    const body = editorNodes.find(node => node.field?.id === "document");
    expect(body?.field?.type).toBe("richText");
    expect((body?.field as {capability?: string} | undefined)?.capability).toBe("ui.richText@1");
    expect(editorNodes.map(node => node.type)).not.toContain("toolbar");
  });
});
