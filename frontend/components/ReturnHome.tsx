import {Button, Toolbar} from "@modula/product-ui";
import {openHomeAction} from "../features/notes/actions";

/**
 * Hosts that replace the module route instead of pushing a stack cannot pop
 * back to Notes. A rendered route.open control is the contract they execute.
 */
export function ReturnHome({presentation = "toolbar"}: {presentation?: "toolbar" | "button"} = {}) {
  const notes = <Button label="Notes" action={openHomeAction} />;
  // Form screens cannot use a toolbar: the editor contract rejects a formatting toolbar,
  // and a navigation button is what the native host renders inside a form.
  if (presentation === "button") return notes;
  return <Toolbar label="Screen navigation">{notes}</Toolbar>;
}
