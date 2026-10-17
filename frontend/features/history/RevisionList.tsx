import {RecordList, type ActionRef, type BindingRef} from "@modula/product-ui";
import {RevisionRow} from "../../components/RevisionRow";

export function RevisionList({revisions, openRevision}: {revisions: BindingRef; openRevision: ActionRef}) {
  return (
    <RecordList records={revisions} action={openRevision} accessibility={{label: "Note revisions", role: "list"}}>
      <RevisionRow revision={revisions} />
    </RecordList>
  );
}
