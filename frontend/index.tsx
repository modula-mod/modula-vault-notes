import {
  Button,
  Badge,
  EmptyState,
  ErrorState,
  Field,
  Filter,
  Form,
  LoadingState,
  Metadata,
  ModuleScreen,
  RecordList,
  Row,
  Search,
  Stack,
  Text,
  Toolbar,
  action,
  defineFrontend,
  route,
  screen,
  useForm,
  useRecord,
  useRecords,
  useSettings,
  type BindingRef,
} from "@modula/product-ui";
import {NoteRow} from "./components/NoteRow";

const newNote = action({id: "newNote", family: "route.open", label: "New note", icon: "system.plus", route: "/new"});
const openNote = action({id: "openNote", family: "route.open", label: "Open note", route: "/note/:noteId"});
const editNote = action({id: "editNote", family: "route.open", label: "Edit note", route: "/note/:noteId/edit"});
const createNote = action({
  id: "createNote",
  family: "record.create",
  label: "Create note",
  recordType: "note",
  inputBinding: "noteForm",
  input: {
    defaults: {
      document: {schemaVersion: "1.0.0", blocks: []},
      tagIds: [],
      pinned: false,
      favourite: false,
      archived: false,
      contentFormat: "blocks-v1",
      properties: {version: "1.0.0", values: []},
      attachmentIds: [],
      sensitive: false,
      intelligencePolicy: "preferLocal",
      dataSchemaVersion: "1.0.0",
    },
    transforms: [{target: "plainTextProjection", source: "document", transform: "richText.plainText@1"}],
  },
});
const updateNote = action({
  id: "updateNote",
  family: "record.update",
  label: "Save changes",
  recordType: "note",
  recordIdBinding: "note",
  inputBinding: "noteForm",
  input: {transforms: [{target: "plainTextProjection", source: "document", transform: "richText.plainText@1"}]},
});
const deleteNote = action({id: "deleteNote", family: "record.delete", label: "Delete note", recordType: "note", recordIdBinding: "note", confirm: true});
const shareNote = action({id: "shareNote", family: "share", label: "Share", capability: "share.native@1"});
const restoreNote = action({id: "restoreNote", family: "record.restore", label: "Restore note", recordType: "note"});
const purgeNote = action({id: "purgeNote", family: "record.purge", label: "Delete permanently", recordType: "note", confirm: true});
const saveSettings = action({id: "saveSettings", family: "settings.update", label: "Save settings", settingsKey: "vaultNotes.preferences"});

function NotesCollection({records, label}: {records: BindingRef; label: string}) {
  return (
    <Stack direction="vertical" gap="regular">
      <RecordList records={records} action={openNote} accessibility={{label, role: "list"}}>
        <NoteRow note={records} />
      </RecordList>
    </Stack>
  );
}

function NotesHome() {
  const notes = useRecords({id: "notes", type: "note", searchParam: "q", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
  return (
    <ModuleScreen title="Notes">
      <Stack direction="vertical" gap="regular" responsive={[{class: "compact", columns: 1}, {class: "wide", columns: 2}]}>
        <Toolbar label="Notes actions">
          <Search label="Search your notes" records={notes} />
          <Button label="New note" action={newNote} />
        </Toolbar>
        <NotesCollection records={notes} label="Vault Notes" />
      </Stack>
    </ModuleScreen>
  );
}

function NoteDetail() {
  const note = useRecord({id: "note", type: "note", idParam: "noteId"});
  return (
    <ModuleScreen title="Note">
      <Stack direction="vertical" gap="regular">
        <Toolbar label="Note actions">
          <Button label="Edit" action={editNote} />
          <Button label="Share" action={shareNote} />
          <Button label="Delete" action={deleteNote} />
        </Toolbar>
        <Text binding={note} valuePath="title" accessibility={{role: "header"}} />
        <Text binding={note} valuePath="plainTextProjection" />
        <Badge binding={note} valuePath="sensitive" accessibility={{label: "Sensitive note status"}} />
        <Metadata binding={note} valuePath="updatedAt" />
      </Stack>
    </ModuleScreen>
  );
}

function NewNoteEditor() {
  const noteForm = useForm({id: "noteForm"});
  return (
    <Form accessibility={{label: "Vault Notes editor", role: "form"}}>
      <Field binding={noteForm} field={{id: "title", type: "text", label: "Title", required: true, validation: {maxLength: 240}}} />
      <Field binding={noteForm} field={{id: "document", type: "richText", label: "Body", capability: "ui.richText@1", placeholder: "Start writing your note", helpText: "Your note stays private inside Vault Notes."}} />
      <Field binding={noteForm} field={{id: "folderId", type: "recordReference", label: "Folder", recordType: "folder", placeholder: "Optional folder"}} />
      <Field binding={noteForm} field={{id: "tagIds", type: "tags", label: "Tags", placeholder: "Add tags separated by commas"}} />
      <Field binding={noteForm} field={{id: "icon", type: "text", label: "Note icon", placeholder: "Optional symbol or short label", validation: {maxLength: 120}}} />
      <Field binding={noteForm} field={{id: "pinned", type: "boolean", label: "Pinned"}} />
      <Field binding={noteForm} field={{id: "favourite", type: "boolean", label: "Favourite"}} />
      <Field binding={noteForm} field={{id: "sensitive", type: "boolean", label: "Sensitive note", helpText: "Sensitive notes require local-only intelligence and hide indexed content."}} />
      <Field binding={noteForm} field={{id: "intelligencePolicy", type: "singleSelect", label: "Local intelligence", options: [{value: "disabled", label: "Disabled"}, {value: "localOnly", label: "Local only"}, {value: "preferLocal", label: "Prefer local"}]}} />
      <Row>
        <Button label="Save note" action={createNote} />
      </Row>
    </Form>
  );
}

function EditNoteEditor() {
  const note = useRecord({id: "note", type: "note", idParam: "noteId"});
  const noteForm = useForm({id: "noteForm"});
  return (
    <Form accessibility={{label: "Vault Notes editor", role: "form"}}>
      <Field binding={noteForm} field={{id: "title", type: "text", label: "Title", required: true, validation: {maxLength: 240}}} />
      <Field binding={noteForm} field={{id: "document", type: "richText", label: "Body", capability: "ui.richText@1", placeholder: "Start writing your note", helpText: "Your note stays private inside Vault Notes."}} />
      <Field binding={noteForm} field={{id: "folderId", type: "recordReference", label: "Folder", recordType: "folder", placeholder: "Optional folder"}} />
      <Field binding={noteForm} field={{id: "tagIds", type: "tags", label: "Tags", placeholder: "Add tags separated by commas"}} />
      <Field binding={noteForm} field={{id: "icon", type: "text", label: "Note icon", placeholder: "Optional symbol or short label", validation: {maxLength: 120}}} />
      <Field binding={noteForm} field={{id: "pinned", type: "boolean", label: "Pinned"}} />
      <Field binding={noteForm} field={{id: "favourite", type: "boolean", label: "Favourite"}} />
      <Field binding={noteForm} field={{id: "sensitive", type: "boolean", label: "Sensitive note", helpText: "Sensitive notes require local-only intelligence and hide indexed content."}} />
      <Field binding={noteForm} field={{id: "intelligencePolicy", type: "singleSelect", label: "Local intelligence", options: [{value: "disabled", label: "Disabled"}, {value: "localOnly", label: "Local only"}, {value: "preferLocal", label: "Prefer local"}]}} />
      <Row>
        <Button label="Save changes" action={updateNote} />
      </Row>
    </Form>
  );
}

function SearchNotes() {
  const notes = useRecords({id: "notes", type: "note", searchParam: "q", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
  return <Stack><Search label="Search titles, bodies, and tags" records={notes} /><NotesCollection records={notes} label="Search results" /></Stack>;
}

function FavouriteNotes() {
  const notes = useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {favourite: true, archived: false}, recordState: "active"});
  return <Stack><Filter label="Favourites" records={notes} /><NotesCollection records={notes} label="Favourite notes" /></Stack>;
}

function PinnedNotes() {
  const notes = useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {pinned: true, archived: false}, recordState: "active"});
  return <Stack><Filter label="Pinned" records={notes} /><NotesCollection records={notes} label="Pinned notes" /></Stack>;
}

function RecentNotes() {
  const notes = useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: false}, recordState: "active"});
  return <Stack><Filter label="Recently edited" records={notes} /><NotesCollection records={notes} label="Recently edited notes" /></Stack>;
}

function ArchivedNotes() {
  const notes = useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, filters: {archived: true}, recordState: "active"});
  return <Stack><Filter label="Archived" records={notes} /><NotesCollection records={notes} label="Archived notes" /></Stack>;
}

function Trash() {
  const notes = useRecords({id: "notes", type: "note", filterParam: "filter", sortParam: "sort", limit: 100, recordState: "deleted"});
  return <Stack><Filter label="Deleted notes" records={notes} /><RecordList records={notes} actions={[restoreNote, purgeNote]} accessibility={{label: "Deleted notes", role: "list"}}><NoteRow note={notes} /></RecordList></Stack>;
}

function Folders() {
  const folders = useRecords({id: "folders", type: "folder", searchParam: "q", sortParam: "sort", limit: 100});
  return <Stack><Search label="Search folders" records={folders} /><RecordList records={folders} accessibility={{label: "Vault Notes folders", role: "list"}} /></Stack>;
}

function NotesSettings() {
  const preferences = useSettings({id: "preferences", key: "vaultNotes.preferences"});
  return (
    <Form accessibility={{label: "Vault Notes settings", role: "form"}}>
      <Field binding={preferences} field={{id: "defaultCollectionView", type: "singleSelect", label: "Default view", options: [{value: "list", label: "List"}, {value: "compact-list", label: "Compact list"}, {value: "grid", label: "Grid"}]}} />
      <Field binding={preferences} field={{id: "defaultSort", type: "singleSelect", label: "Default sort", options: [{value: "updatedAt", label: "Recently updated"}, {value: "createdAt", label: "Recently created"}, {value: "title", label: "Title"}]}} />
      <Field binding={preferences} field={{id: "defaultFolderId", type: "recordReference", label: "Default folder", recordType: "folder"}} />
      <Field binding={preferences} field={{id: "newNoteTemplateId", type: "recordReference", label: "New-note template", recordType: "template"}} />
      <Field binding={preferences} field={{id: "dailyNoteEnabled", type: "boolean", label: "Enable daily notes"}} />
      <Field binding={preferences} field={{id: "showBacklinks", type: "boolean", label: "Show backlinks"}} />
      <Field binding={preferences} field={{id: "searchSensitiveNotes", type: "boolean", label: "Search sensitive notes"}} />
      <Field binding={preferences} field={{id: "intelligencePreference", type: "singleSelect", label: "Local intelligence", options: [{value: "disabled", label: "Disabled"}, {value: "localOnly", label: "Local only"}, {value: "preferLocal", label: "Prefer local"}]}} />
      <Field binding={preferences} field={{id: "confirmPermanentDeletion", type: "boolean", label: "Confirm permanent deletion"}} />
      <Button label="Save settings" action={saveSettings} />
    </Form>
  );
}

const status = (label: string) => <ErrorState label={label} accessibility={{role: "status"}} />;
const collectionStates = (empty: string, error: string) => ({empty: <EmptyState label={empty} />, error: status(error)});

export default defineFrontend({
  mode: "declarative",
  entry: "home",
  hostRuntime: {versionRange: ">=1.0.0 <2.0.0"},
  routes: [
    route("/", "home"), route("/new", "newEditor", {presentation: "sheet"}), route("/note/:noteId", "detail"),
    route("/note/:noteId/edit", "editor", {presentation: "sheet"}), route("/search", "search"),
    route("/favourites", "favourites"), route("/archived", "archived"), route("/trash", "trash"),
    route("/pinned", "pinned"), route("/recent", "recent"),
    route("/folders", "folders"), route("/settings", "settings"),
  ],
  screens: [
    screen("home", "collection", "Notes", NotesHome, {states: {loading: <LoadingState label="Loading your notes" accessibility={{role: "status"}} />, empty: <EmptyState label="Your vault is ready for its first note"><Button label="Create your first note" action={newNote} /></EmptyState>, error: status("Vault Notes could not be loaded"), offline: status("Vault Notes is temporarily unavailable offline")}}),
    screen("detail", "detail", "Note", NoteDetail, {states: {loading: <LoadingState label="Loading note" accessibility={{role: "status"}} />, error: status("This note is unavailable"), permissionDenied: status("You do not have permission to read this note")}}),
    screen("newEditor", "form", "New Note", NewNoteEditor, {states: {capabilityUnavailable: status("This host needs the rich text editor capability"), error: status("The note could not be saved")}}),
    screen("editor", "form", "Edit Note", EditNoteEditor, {states: {capabilityUnavailable: status("This host needs the rich text editor capability"), error: status("The note could not be saved")}}),
    screen("search", "collection", "Search Vault Notes", SearchNotes, {states: {loading: <LoadingState label="Searching notes" accessibility={{role: "status"}} />, empty: <EmptyState label="No notes match this search" />, error: status("Search is unavailable")}}),
    screen("favourites", "collection", "Favourite notes", FavouriteNotes, {states: collectionStates("No favourite notes yet", "Favourite notes are unavailable")}),
    screen("pinned", "collection", "Pinned notes", PinnedNotes, {states: collectionStates("No pinned notes yet", "Pinned notes are unavailable")}),
    screen("recent", "collection", "Recently edited", RecentNotes, {states: collectionStates("No recent notes", "Recent notes are unavailable")}),
    screen("archived", "collection", "Archived notes", ArchivedNotes, {states: collectionStates("No archived notes", "Archived notes are unavailable")}),
    screen("trash", "collection", "Trash", Trash, {states: collectionStates("Trash is empty", "Trash is unavailable")}),
    screen("folders", "collection", "Folders", Folders, {states: collectionStates("No folders yet", "Folders are unavailable")}),
    screen("settings", "settings", "Vault Notes settings", NotesSettings),
  ],
  actions: [newNote, openNote, editNote, createNote, updateNote, deleteNote, shareNote, restoreNote, purgeNote, saveSettings],
  navigation: {
    rootView: "home",
    tabs: [{id: "notes", viewId: "home", label: "Notes", icon: "system.note"}, {id: "search", viewId: "search", label: "Search", icon: "system.search"}],
    secondary: [{id: "pinned", viewId: "pinned", label: "Pinned"}, {id: "recent", viewId: "recent", label: "Recent"}, {id: "favourites", viewId: "favourites", label: "Favourites"}, {id: "archived", viewId: "archived", label: "Archived"}, {id: "trash", viewId: "trash", label: "Trash"}, {id: "folders", viewId: "folders", label: "Folders"}, {id: "settings", viewId: "settings", label: "Settings"}],
    backBehavior: "host",
  },
  settings: {viewId: "settings"},
  capabilities: {required: ["ui.richText@1"], optional: ["share.native@1"]},
  platformRequirements: {platforms: ["ios", "android", "web"]},
  accessibility: {declaration: "host-baseline-with-product-semantics", screenReader: true, scalableText: true, keyboardNavigation: true, reduceMotion: true},
});
