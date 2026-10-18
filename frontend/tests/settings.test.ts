import {describe, expect, it} from "vitest";
import {artifact, fieldIds, view} from "./artifact";

describe("Vault settings and compatibility", () => {
  it("keeps settings module-owned and grouped by product concerns", () => {
    expect(fieldIds("settings")).toEqual(expect.arrayContaining([
      "showWordCount", "showCharacterCount", "defaultCollectionView", "defaultSort", "defaultFolderId", "newNoteTemplateId",
      "dailyNoteEnabled", "showBacklinks", "searchSensitiveNotes", "intelligencePreference",
      "confirmPermanentDeletion", "defaultExportFormat",
    ]));
  });

  it("declares advanced capabilities as optional degradation paths", () => {
    expect(artifact.capabilities.required).toEqual(["ui.richText@1", "ui.textTransform@1", "ui.recordRevisions@1", "ui.mediaAttach@1", "ui.mediaOpen@1"]);
    expect(artifact.capabilities.optional).toEqual(expect.arrayContaining([
      "ui.graph@1", "ui.table@1", "ui.board@1", "ui.property-editor@1",
      "ui.attachment-gallery@1", "ui.revision-browser@1", "ui.local-intelligence@1",
    ]));
    expect(artifact.hostRuntime.versionRange).toBe(">=1.1.0 <2.0.0");
    expect(view("settings").kind).toBe("settings");
  });
});
