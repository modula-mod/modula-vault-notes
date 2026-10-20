import {ModuleScreen, screen} from "@modula/product-ui";
import {errorState} from "../components/ScreenStates";
import {Editor} from "../features/editor/Editor";
import {useNewEditorBindings} from "../features/editor/bindings";
import {attachNoteMediaAction, createNoteAction} from "../features/notes/actions";

function NewNoteScreen() {
  const bindings = useNewEditorBindings();
  return <ModuleScreen title="New Note"><Editor form={bindings.noteForm} saveAction={createNoteAction} attachAction={attachNoteMediaAction} showAttachment={false} /></ModuleScreen>;
}

export const newNoteScreen = screen("newEditor", "form", "New Note", NewNoteScreen, {
  states: {
    capabilityUnavailable: errorState("Writing tools are unavailable on this device"),
    error: errorState("The note could not be saved"),
    permissionDenied: errorState("You do not have permission to create notes"),
    offline: errorState("Connect to create a note"),
  },
});
