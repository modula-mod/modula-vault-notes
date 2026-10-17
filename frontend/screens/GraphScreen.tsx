import {ModuleScreen, useRecords, screen} from "@modula/product-ui";
import {errorState, loadingState} from "../components/ScreenStates";
import {GraphProjection} from "../features/graph/GraphProjection";

function GraphScreen() {
  const notes = useRecords({id: "graphNotes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, recordState: "active"});
  const links = useRecords({id: "graphLinks", type: "note-link", filterParam: "filter", sortParam: "sort", limit: 100, recordState: "active"});
  return <ModuleScreen title="Note Graph"><GraphProjection notes={notes} links={links} /></ModuleScreen>;
}

export const graphScreen = screen("graph", "dashboard", "Note Graph", GraphScreen, {
  states: {
    loading: loadingState("Loading graph projection"),
    error: errorState("Graph data could not be loaded"),
    permissionDenied: errorState("You do not have permission to inspect this graph"),
    capabilityUnavailable: errorState("BLOCKED-BY-MODULE-UI: this host has no generic graph renderer"),
    offline: errorState("The complete graph is unavailable offline"),
  },
});
