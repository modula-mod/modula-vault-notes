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
    {id: "templates", viewId: "templates", label: "Templates"},
    {id: "daily", viewId: "daily", label: "Daily Note"},
    {id: "savedSearches", viewId: "savedSearches", label: "Saved Searches"},
    {id: "attachments", viewId: "attachments", label: "Attachments"},
    {id: "graph", viewId: "graph", label: "Graph"},
    {id: "archived", viewId: "archived", label: "Archived"},
    {id: "trash", viewId: "trash", label: "Trash"},
    {id: "settings", viewId: "settings", label: "Settings"},
  ],
  backBehavior: "host",
};

export const vaultSettings = {viewId: "settings"};
