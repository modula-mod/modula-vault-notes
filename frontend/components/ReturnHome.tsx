import {Button, Toolbar} from "@modula/product-ui";
import {openHomeAction} from "../features/notes/actions";

/**
 * Hosts that replace the module route instead of pushing a stack cannot pop
 * back to Notes. A rendered route.open control is the contract they execute.
 */
export function ReturnHome() {
  return (
    <Toolbar label="Screen navigation">
      <Button label="Notes" action={openHomeAction} />
    </Toolbar>
  );
}

/** Form screens stay free of a toolbar. The editor contract rejects one. */
export function ReturnHomeButton() {
  return <Button label="Notes" action={openHomeAction} />;
}
