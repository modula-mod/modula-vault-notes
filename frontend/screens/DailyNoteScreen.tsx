import {Button, ModuleScreen, Section, Stack, Text, screen} from "@modula/product-ui";
import {errorState, loadingState} from "../components/ScreenStates";
import {createDailyNoteAction} from "../features/templates/template-actions";
import {DAILY_NOTE_POLICY} from "../lib/dates";
import {FUNCTION_REVIEW_NOTICE} from "../lib/permissions";

function DailyNoteScreen() {
  return (
    <ModuleScreen title="Daily Note">
      <Section title="Today">
        <Stack direction="vertical" gap="regular">
          <Text text={DAILY_NOTE_POLICY} />
          <Text text={FUNCTION_REVIEW_NOTICE} accessibility={{role: "status"}} />
          <Button label="Open today’s note" action={createDailyNoteAction} />
        </Stack>
      </Section>
    </ModuleScreen>
  );
}

export const dailyNoteScreen = screen("daily", "detail", "Daily Note", DailyNoteScreen, {
  states: {
    loading: loadingState("Resolving today’s note"),
    error: errorState("Daily Note requires the reviewed note.createDaily function"),
    permissionDenied: errorState("You do not have permission to create today’s note"),
    offline: errorState("Offline Daily Note creation requires idempotent module sync"),
  },
});
