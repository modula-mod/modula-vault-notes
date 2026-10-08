import {ModuleScreen, Text, screen} from "@modula/product-ui";
import {collectionStates} from "../components/ScreenStates";
import {RevisionList} from "../features/history/RevisionList";
import {openRevisionAction} from "../features/notes/actions";
import {useRevisions} from "../hooks/useRevisions";

function RevisionHistoryScreen() {
  const revisions = useRevisions();
  return <ModuleScreen title="Revision history"><Text text="Restores create a new revision and never delete intervening history." /><RevisionList revisions={revisions} openRevision={openRevisionAction} /></ModuleScreen>;
}

export const revisionHistoryScreen = screen("history", "collection", "Revision history", RevisionHistoryScreen, {states: collectionStates("No revision checkpoints are available", "Generic revision history is unavailable on this host")});
