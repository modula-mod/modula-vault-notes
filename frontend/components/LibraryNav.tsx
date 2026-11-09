import {Button, Row} from "@modula/product-ui";
import {
  openArchivedAction,
  openAttachmentsAction,
  openDailyAction,
  openGraphAction,
  openRecentAction,
  openSavedSearchesAction,
  openSearchAction,
  openSettingsAction,
  openTemplatesAction,
} from "../features/notes/actions";

/**
 * ModuleHost renders the current view. It does not render navigation tabs or
 * secondary destinations, so every static route needs a rendered route.open
 * control on a view the host already shows.
 */
export function LibraryNav() {
  return (
    <Row gap="compact" scroll="horizontal">
      <Button label="Search" action={openSearchAction} />
      <Button label="Recent" action={openRecentAction} />
      <Button label="Archived" action={openArchivedAction} />
      <Button label="Templates" action={openTemplatesAction} />
      <Button label="Daily Note" action={openDailyAction} />
      <Button label="Saved Searches" action={openSavedSearchesAction} />
      <Button label="Attachments" action={openAttachmentsAction} />
      <Button label="Graph" action={openGraphAction} />
      <Button label="Settings" action={openSettingsAction} />
    </Row>
  );
}
