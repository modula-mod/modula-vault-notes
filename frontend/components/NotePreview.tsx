import {Text, type BindingRef} from "@modula/product-ui";

export function NotePreview({note}: {note: BindingRef}) {
  return <Text binding={note} valuePath="plainTextProjection" accessibility={{label: "Note preview", role: "text"}} />;
}
