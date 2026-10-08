import {useSettings} from "@modula/product-ui";

export function useVaultSettings() {
  return useSettings({id: "preferences", key: "vaultNotes.preferences"});
}
