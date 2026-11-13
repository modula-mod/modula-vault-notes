import {ModuleScreen, Text, screen} from "@modula/product-ui";
import {ReturnHome} from "../components/ReturnHome";
import {collectionStates} from "../components/ScreenStates";
import {RevisionList} from "../features/history/RevisionList";
import {openRevisionAction} from "../features/notes/actions";
import {useRevisions} from "../hooks/useRevisions";

function RevisionHistoryScreen() {
  const revisions = useRevisions();
  return <ModuleScreen title="Revision history"><ReturnHome /><Text text="Restores create a new revision and never delete intervening history. Checkpoints for this note appear only when the host loads note revisions. Until it does, this list may be empty." /><RevisionList revisions={revisions} openRevision={openRevisionAction} /></ModuleScreen>;
}

export const revisionHistoryScreen = screen("history", "collection", "Revision history", RevisionHistoryScreen, {states: collectionStates("No revision checkpoints are available", "Generic revision history is unavailable on this host")});
