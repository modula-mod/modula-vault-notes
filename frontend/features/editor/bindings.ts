import {useForm} from "@modula/product-ui";
import {useNote} from "../../hooks/useNote";

export function useNewEditorBindings() {
  const noteForm = useForm({id: "noteForm"});
  return {noteForm};
}

export function useExistingEditorBindings() {
  const note = useNote();
  const noteForm = useForm({id: "noteForm"});
  return {note, noteForm};
}
