import {Button, ModuleScreen, screen} from "@modula/product-ui";
import {ReturnHome} from "../components/ReturnHome";
import {errorState, loadingState} from "../components/ScreenStates";
import {RevisionPreview} from "../features/history/RevisionPreview";
import {restoreRevisionAction} from "../features/history/restore-actions";
import {useRevision} from "../hooks/useNote";

function RevisionDetailScreen() {
  const revision = useRevision();
  return <ModuleScreen title="Revision"><ReturnHome /><RevisionPreview revision={revision} /><Button label="Restore as new revision" action={restoreRevisionAction} /></ModuleScreen>;
}

export const revisionDetailScreen = screen("revision", "detail", "Revision", RevisionDetailScreen, {
  states: {
    loading: loadingState("Loading revision"),
    error: errorState("This revision is unavailable"),
    permissionDenied: errorState("You do not have permission to view this revision"),
    capabilityUnavailable: errorState("Generic revision view and restore APIs are required"),
  },
});
