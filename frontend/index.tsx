import {defineFrontend} from "@modula/product-ui";
import {vaultActions} from "./app/actions";
import {
  vaultAccessibility,
  vaultCapabilities,
  vaultHostRuntime,
  vaultPlatformRequirements,
} from "./app/context";
import {vaultNavigation, vaultSettings} from "./app/navigation";
import {vaultRoutes} from "./app/routes";
import {vaultScreens} from "./app/VaultApp";

// ModuleHost only needs this bounded declaration. Application composition,
// screens, feature behavior, and product components stay behind this entrypoint.
const vaultFrontend = defineFrontend({
  mode: "declarative",
  entry: "home",
  hostRuntime: vaultHostRuntime,
  routes: vaultRoutes,
  screens: vaultScreens,
  actions: vaultActions,
  navigation: vaultNavigation,
  settings: vaultSettings,
  capabilities: vaultCapabilities,
  platformRequirements: vaultPlatformRequirements,
  accessibility: vaultAccessibility,
});

export default vaultFrontend;
