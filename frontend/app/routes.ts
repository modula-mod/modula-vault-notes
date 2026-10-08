import {route} from "@modula/product-ui";
import {VAULT_PATHS} from "../lib/routes";

export const vaultRoutes = [
  route(VAULT_PATHS.home, "home"),
  route(VAULT_PATHS.newNote, "newEditor", {presentation: "sheet"}),
  route(VAULT_PATHS.note, "detail"),
  route(VAULT_PATHS.editNote, "editor", {presentation: "sheet"}),
  route(VAULT_PATHS.noteHistory, "history"),
  route(VAULT_PATHS.revision, "revision"),
  route(VAULT_PATHS.search, "search"),
  route(VAULT_PATHS.pinned, "pinned"),
  route(VAULT_PATHS.recent, "recent"),
  route(VAULT_PATHS.favourites, "favourites"),
  route(VAULT_PATHS.archived, "archived"),
  route(VAULT_PATHS.trash, "trash"),
  route(VAULT_PATHS.folders, "folders"),
  route(VAULT_PATHS.folder, "folder"),
  route(VAULT_PATHS.tags, "tags"),
  route(VAULT_PATHS.tag, "tag"),
  route(VAULT_PATHS.templates, "templates"),
  route(VAULT_PATHS.daily, "daily"),
  route(VAULT_PATHS.attachments, "attachments"),
  route(VAULT_PATHS.savedSearches, "savedSearches"),
  route(VAULT_PATHS.graph, "graph"),
  route(VAULT_PATHS.settings, "settings"),
];
