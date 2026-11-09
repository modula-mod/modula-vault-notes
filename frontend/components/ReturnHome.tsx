import {Button, Toolbar} from "@modula/product-ui";
import {openHomeAction} from "../features/notes/actions";

/** Hosts that replace a product route still need a rendered return control. */
export function ReturnHome() {
  return (
    <Toolbar label="Screen navigation">
      <Button label="Notes" action={openHomeAction} />
    </Toolbar>
  );
}

/** Form surfaces use a plain navigation button instead of another toolbar. */
export function ReturnHomeButton() {
  return <Button label="Notes" action={openHomeAction} />;
}
