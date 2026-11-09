import {Field, Form, ModuleScreen, screen, useForm, useRecord, type FieldDefinition} from "@modula/product-ui";
import {collectionStates} from "../components/ScreenStates";
import {createTagAction, updateTagAction} from "../features/notes/actions";

const nameField: FieldDefinition = {id: "name", type: "text", label: "Tag name", required: true, placeholder: "Name your tag", validation: {maxLength: 80}};

function NewTagScreen() {
  const form = useForm({id: "tagForm"});
  return <ModuleScreen title="New tag"><Form action={createTagAction}><Field binding={form} field={nameField} /></Form></ModuleScreen>;
}

function EditTagScreen() {
  const tag = useRecord({id: "tag", type: "tag", idParam: "tagId"});
  const form = useForm({id: "tagForm"});
  return <ModuleScreen title="Rename tag"><Form action={updateTagAction}><Field binding={form} field={nameField} /></Form></ModuleScreen>;
}

export const newTagScreen = screen("newTag", "form", "New tag", NewTagScreen, {states: collectionStates("Name this tag", "Tag could not be created")});
export const editTagScreen = screen("editTag", "form", "Rename tag", EditTagScreen, {states: collectionStates("Tag unavailable", "Tag could not be renamed")});
