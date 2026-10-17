import {EditorToolbar} from "./editor/EditorToolbar";
import {IntelligenceMenu} from "./intelligence/IntelligenceMenu";
import {Backlinks} from "./links/Backlinks";
import {RelatedNotes} from "./links/RelatedNotes";
import {SEARCH_FILTER_SUMMARY} from "./notes/filters";
import {StructuredViewStatus} from "./projections/StructuredViewStatus";
import {PropertiesPanel} from "./properties/PropertiesPanel";

/**
 * Extension surfaces stay in the module package so Formatting, links, and
 * properties can attach later. The notes people open do not render them.
 */
export const extensionSurfaces = {
  EditorToolbar,
  IntelligenceMenu,
  Backlinks,
  RelatedNotes,
  PropertiesPanel,
  StructuredViewStatus,
  SEARCH_FILTER_SUMMARY,
};
