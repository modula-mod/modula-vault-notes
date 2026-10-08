import type {FrontendDefinition} from "@modula/product-ui";

export const vaultHostRuntime: FrontendDefinition["hostRuntime"] = {versionRange: ">=1.0.0 <2.0.0"};

export const vaultCapabilities: NonNullable<FrontendDefinition["capabilities"]> = {
  required: ["ui.richText@1"],
  optional: [
    "share.native@1",
    "ui.richText.commands@1",
    "ui.reference-picker@1",
    "ui.property-editor@1",
    "ui.attachment-gallery@1",
    "media.picker@1",
    "ui.revision-browser@1",
    "ui.graph@1",
    "ui.table@1",
    "ui.board@1",
    "ui.local-intelligence@1",
  ],
};

export const vaultPlatformRequirements: NonNullable<FrontendDefinition["platformRequirements"]> = {
  platforms: ["ios", "android", "web"],
};

export const vaultAccessibility: FrontendDefinition["accessibility"] = {
  declaration: "host-baseline-with-product-semantics",
  screenReader: true,
  scalableText: true,
  keyboardNavigation: true,
  reduceMotion: true,
};
