import {ModuleScreen, screen} from "@modula/product-ui";
import {errorState, loadingState} from "../components/ScreenStates";
import {Editor} from "../features/editor/Editor";
import {useExistingEditorBindings} from "../features/editor/bindings";
import {attachNoteMediaAction, updateNoteAction} from "../features/notes/actions";

function NoteEditorScreen() {
  const bindings = useExistingEditorBindings();
  return <ModuleScreen title="Edit Note"><Editor form={bindings.noteForm} saveAction={updateNoteAction} attachAction={attachNoteMediaAction} showAttachment={true} /></ModuleScreen>;
}

export const noteEditorScreen = screen("editor", "form", "Edit Note", NoteEditorScreen, {
  states: {
    loading: loadingState("Loading note editor"),
    capabilityUnavailable: errorState("Writing tools are unavailable on this device"),
    error: errorState("The note could not be saved. Your draft is still here."),
    permissionDenied: errorState("You do not have permission to edit this note"),
    offline: errorState("Connect to save this note"),
  },
});
