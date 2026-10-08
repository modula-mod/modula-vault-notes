import {Button, Field, Form, Section, Stack, action, screen} from "@modula/product-ui";
import {errorState, loadingState} from "../components/ScreenStates";
import {useVaultSettings} from "../hooks/useVaultSettings";

export const saveSettingsAction = action({id: "saveSettings", family: "settings.update", label: "Save settings", settingsKey: "vaultNotes.preferences"});

function SettingsScreen() {
  const preferences = useVaultSettings();
  return (
    <Form accessibility={{label: "Vault Notes settings", role: "form"}}>
      <Stack direction="vertical" gap="regular">
        <Section title="Editor">
          <Field binding={preferences} field={{id: "showWordCount", type: "boolean", label: "Show word count"}} />
          <Field binding={preferences} field={{id: "showCharacterCount", type: "boolean", label: "Show character count"}} />
        </Section>
        <Section title="Organization">
          <Field binding={preferences} field={{id: "defaultCollectionView", type: "singleSelect", label: "Default view", options: [{value: "list", label: "List"}, {value: "compact-list", label: "Compact list"}, {value: "grid", label: "Grid"}]}} />
          <Field binding={preferences} field={{id: "defaultSort", type: "singleSelect", label: "Default sort", options: [{value: "updatedAt", label: "Recently updated"}, {value: "createdAt", label: "Recently created"}, {value: "title", label: "Title"}]}} />
          <Field binding={preferences} field={{id: "defaultFolderId", type: "recordReference", label: "Default folder", recordType: "folder"}} />
          <Field binding={preferences} field={{id: "newNoteTemplateId", type: "recordReference", label: "New-note template", recordType: "template"}} />
        </Section>
        <Section title="Daily Notes">
          <Field binding={preferences} field={{id: "dailyNoteEnabled", type: "boolean", label: "Enable daily notes"}} />
        </Section>
        <Section title="Search">
          <Field binding={preferences} field={{id: "showBacklinks", type: "boolean", label: "Show backlinks"}} />
          <Field binding={preferences} field={{id: "searchSensitiveNotes", type: "boolean", label: "Search sensitive notes"}} />
        </Section>
        <Section title="Intelligence">
          <Field binding={preferences} field={{id: "intelligencePreference", type: "singleSelect", label: "Local intelligence", options: [{value: "disabled", label: "Disabled"}, {value: "localOnly", label: "Local only"}, {value: "preferLocal", label: "Prefer local"}]}} />
        </Section>
        <Section title="Privacy">
          <Field binding={preferences} field={{id: "confirmPermanentDeletion", type: "boolean", label: "Confirm permanent deletion"}} />
        </Section>
        <Section title="Import and Export">
          <Field binding={preferences} field={{id: "defaultExportFormat", type: "singleSelect", label: "Default export format", options: [{value: "json", label: "Vault backup"}, {value: "markdown", label: "Markdown"}, {value: "plain-text", label: "Plain text"}, {value: "zip", label: "ZIP archive"}]}} />
        </Section>
        <Button label="Save settings" action={saveSettingsAction} />
      </Stack>
    </Form>
  );
}

export const settingsScreen = screen("settings", "settings", "Vault Notes settings", SettingsScreen, {
  states: {
    loading: loadingState("Loading Vault settings"),
    error: errorState("Vault settings could not be loaded"),
    permissionDenied: errorState("You do not have permission to change Vault settings"),
  },
});
