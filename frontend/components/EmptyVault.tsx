import {Button, EmptyState, type ActionRef} from "@modula/product-ui";

export function EmptyVault({newNote}: {newNote: ActionRef}) {
  return (
    <EmptyState label="No notes yet" accessibility={{role: "status"}}>
      <Button label="Create your first note" action={newNote} />
    </EmptyState>
  );
}
