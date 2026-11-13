import {Badge, Button, Menu, ModuleScreen, Text, Toolbar, screen} from "@modula/product-ui";
import {NotesCollection} from "../components/NotesCollection";
import {collectionStates} from "../components/ScreenStates";
import {deleteTagAction, editTagAction, openHomeAction, openNoteAction} from "../features/notes/actions";
import {useTag, useTagNotes} from "../hooks/useNotes";

function TagScreen() {
  const tag = useTag();
  const notes = useTagNotes();
  return <ModuleScreen title="Tag"><Toolbar label="Tag actions"><Button label="Notes" action={openHomeAction} /><Menu label="More"><Button label="Rename tag" action={editTagAction} /><Button label="Delete tag" action={deleteTagAction} /></Menu></Toolbar><Badge binding={tag} valuePath="name" accessibility={{label: "Selected tag"}} /><Text text="This list may be empty or include notes without this tag." /><NotesCollection notes={notes} openNote={openNoteAction} label="Notes with tag" /></ModuleScreen>;
}

export const tagScreen = screen("tag", "collection", "Tag", TagScreen, {states: collectionStates("No notes use this tag", "This tag is unavailable")});
