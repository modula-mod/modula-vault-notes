import {ModuleScreen, screen} from "@modula/product-ui";
import {errorState, loadingState} from "../components/ScreenStates";
import {Editor} from "../features/editor/Editor";
import {useExistingEditorBindings} from "../features/editor/bindings";
import {updateNoteAction} from "../features/notes/actions";

function NoteEditorScreen() {
  const bindings = useExistingEditorBindings();
  return <ModuleScreen title="Edit Note"><Editor form={bindings.noteForm} saveAction={updateNoteAction} /></ModuleScreen>;
}

export const noteEditorScreen = screen("editor", "form", "Edit Note", NoteEditorScreen, {
  states: {
    loading: loadingState("Loading note editor"),
    capabilityUnavailable: errorState("This host needs rich text, reference, and attachment capabilities"),
    error: errorState("The note could not be saved; your local draft should be retained by the host"),
    permissionDenied: errorState("You do not have permission to edit this note"),
    offline: errorState("Offline editing requires the generic module sync queue"),
  },
});
