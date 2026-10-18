import {Field, Form, ModuleScreen, screen, useForm, useRecord, type FieldDefinition} from "@modula/product-ui";
import {collectionStates} from "../components/ScreenStates";
import {createFolderAction, updateFolderAction} from "../features/notes/actions";

const nameField: FieldDefinition = {id: "name", type: "text", label: "Folder name", required: true, placeholder: "Name your folder", validation: {maxLength: 120}};

function NewFolderScreen() {
  const form = useForm({id: "folderForm"});
  return <ModuleScreen title="New folder"><Form action={createFolderAction}><Field binding={form} field={nameField} /></Form></ModuleScreen>;
}

function EditFolderScreen() {
  const folder = useRecord({id: "folder", type: "folder", idParam: "folderId"});
  const form = useForm({id: "folderForm"});
  return <ModuleScreen title="Rename folder"><Form action={updateFolderAction}><Field binding={form} field={nameField} /></Form></ModuleScreen>;
}

export const newFolderScreen = screen("newFolder", "form", "New folder", NewFolderScreen, {states: collectionStates("Name this folder", "Folder could not be created")});
export const editFolderScreen = screen("editFolder", "form", "Rename folder", EditFolderScreen, {states: collectionStates("Folder unavailable", "Folder could not be renamed")});
