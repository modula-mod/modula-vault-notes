import {RecordList, Search, Stack, type BindingRef} from "@modula/product-ui";
import {TemplateCard} from "../../components/TemplateCard";
import {createFromTemplateAction} from "./template-actions";

export function TemplatePicker({templates}: {templates: BindingRef}) {
  return (
    <Stack direction="vertical" gap="regular">
      <Search label="Search note templates" records={templates} />
      <RecordList records={templates} accessibility={{label: "Vault Notes templates", role: "list"}}>
        <TemplateCard template={templates} createAction={createFromTemplateAction} />
      </RecordList>
    </Stack>
  );
}
