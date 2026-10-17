import {Badge, type BindingRef} from "@modula/product-ui";

export function SensitiveBadge({note}: {note: BindingRef}) {
  return (
    <Badge
      binding={note}
      valuePath="sensitive"
      accessibility={{label: "Sensitive note; intelligence is local only", role: "status"}}
    />
  );
}
