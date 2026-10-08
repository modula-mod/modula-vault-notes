import {Badge, ModuleScreen, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {collectionStates} from "../components/ScreenStates";
import {openNoteAction} from "../features/notes/actions";
import {useTag, useTagNotes} from "../hooks/useNotes";

function TagScreen() {
  const tag = useTag();
  const notes = useTagNotes();
  return <ModuleScreen title="Tag"><Badge binding={tag} valuePath="name" accessibility={{label: "Selected tag"}} /><NotesCollection notes={notes} openNote={openNoteAction} label="Notes with tag" /></ModuleScreen>;
}

export const tagScreen = screen("tag", "collection", "Tag", TagScreen, {states: collectionStates("No notes use this tag", "This tag is unavailable")});
