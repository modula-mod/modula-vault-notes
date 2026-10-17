import {ModuleScreen, Text, screen} from "@modula/product-ui";
import {collectionStates} from "../components/ScreenStates";
import {TemplatePicker} from "../features/templates/TemplatePicker";
import {useTemplates} from "../hooks/useTemplates";
import {FUNCTION_REVIEW_NOTICE} from "../lib/permissions";

function TemplatesScreen() {
  const templates = useTemplates();
  return <ModuleScreen title="Templates"><Text text={FUNCTION_REVIEW_NOTICE} accessibility={{role: "status"}} /><TemplatePicker templates={templates} /></ModuleScreen>;
}

export const templatesScreen = screen("templates", "collection", "Templates", TemplatesScreen, {states: collectionStates("No templates are installed", "Templates are unavailable")});
