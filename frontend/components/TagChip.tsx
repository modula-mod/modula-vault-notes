import {Badge, RecordRow, type BindingRef} from "@modula/product-ui";

export function TagChip({tag}: {tag: BindingRef}) {
  return (
    <RecordRow binding={tag} accessibility={{label: "Tag", role: "listitem"}}>
      <Badge binding={tag} valuePath="name" accessibility={{label: "Vault tag"}} />
    </RecordRow>
  );
}
