export const vaultNavigation = {
  rootView: "home",
  tabs: [
    {id: "notes", viewId: "home", label: "Notes", icon: "system.note"},
    {id: "search", viewId: "search", label: "Search", icon: "system.search"},
  ],
  secondary: [
    {id: "pinned", viewId: "pinned", label: "Pinned"},
    {id: "recent", viewId: "recent", label: "Recent"},
    {id: "favourites", viewId: "favourites", label: "Favourites"},
    {id: "folders", viewId: "folders", label: "Folders"},
    {id: "tags", viewId: "tags", label: "Tags"},
    {id: "trash", viewId: "trash", label: "Trash"},
    {id: "settings", viewId: "settings", label: "Settings"},
  ],
  backBehavior: "host",
};

export const vaultSettings = {viewId: "settings"};
