import {Badge, ModuleScreen, Text, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {ReturnHome} from "../components/ReturnHome";
import {collectionStates} from "../components/ScreenStates";
import {openNoteAction} from "../features/notes/actions";
import {useTag, useTagNotes} from "../hooks/useNotes";

function TagScreen() {
  const tag = useTag();
  const notes = useTagNotes();
  return <ModuleScreen title="Tag"><ReturnHome /><Badge binding={tag} valuePath="name" accessibility={{label: "Selected tag"}} /><Text text="Notes with this tag are listed when the host applies the tag filter." /><NotesCollection notes={notes} openNote={openNoteAction} label="Notes with tag" /></ModuleScreen>;
}

export const tagScreen = screen("tag", "collection", "Tag", TagScreen, {states: collectionStates("No notes use this tag", "This tag is unavailable")});
