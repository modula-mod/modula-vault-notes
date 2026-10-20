export {extensionSurfaces} from "../features/library";
import {attachmentsScreen} from "../screens/AttachmentsScreen";
import {dailyNoteScreen} from "../screens/DailyNoteScreen";
import {folderScreen} from "../screens/FolderScreen";
import {newFolderScreen, editFolderScreen} from "../screens/FolderEditorScreens";
import {foldersScreen} from "../screens/FoldersScreen";
import {graphScreen} from "../screens/GraphScreen";
import {noteDetailScreen} from "../screens/NoteDetailScreen";
import {
  archivedScreen,
  favouritesScreen,
  pinnedScreen,
  recentScreen,
  trashScreen,
} from "../screens/NoteCollectionScreens";
import {noteEditorScreen} from "../screens/NoteEditorScreen";
import {notesScreen} from "../screens/NotesScreen";
import {newNoteScreen} from "../screens/NewNoteScreen";
import {revisionDetailScreen} from "../screens/RevisionDetailScreen";
import {revisionHistoryScreen} from "../screens/RevisionHistoryScreen";
import {savedSearchesScreen} from "../screens/SavedSearchesScreen";
import {searchScreen} from "../screens/SearchScreen";
import {settingsScreen} from "../screens/SettingsScreen";
import {tagScreen} from "../screens/TagScreen";
import {newTagScreen, editTagScreen} from "../screens/TagEditorScreens";
import {tagsScreen} from "../screens/TagsScreen";
import {templatesScreen} from "../screens/TemplatesScreen";

export const vaultScreens = [
  notesScreen,
  noteDetailScreen,
  newNoteScreen,
  noteEditorScreen,
  searchScreen,
  pinnedScreen,
  recentScreen,
  favouritesScreen,
  archivedScreen,
  trashScreen,
  foldersScreen,
  newFolderScreen,
  folderScreen,
  editFolderScreen,
  tagsScreen,
  newTagScreen,
  tagScreen,
  editTagScreen,
  templatesScreen,
  dailyNoteScreen,
  revisionHistoryScreen,
  revisionDetailScreen,
  attachmentsScreen,
  savedSearchesScreen,
  graphScreen,
  settingsScreen,
];
