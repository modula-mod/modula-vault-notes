import {Button, EmptyState, ErrorState, LoadingState, Text, type ActionRef} from "@modula/product-ui";

export function loadingState(label: string) {
  return <LoadingState label={label} accessibility={{role: "status"}} />;
}

export function emptyState(label: string) {
  return <EmptyState label={label} accessibility={{role: "status"}} />;
}

export function errorState(label: string) {
  return <ErrorState label={label} accessibility={{role: "status"}} />;
}

export function collectionStates(empty: string, error: string) {
  return {
    loading: loadingState("Loading Vault Notes"),
    empty: emptyState(empty),
    error: errorState(error),
    permissionDenied: errorState("You do not have permission to view this Vault content"),
    offline: errorState("This collection is unavailable while offline on this host"),
  };
}

export function collectionStatesWithBrowse(empty: string, explanation: string, error: string, browse: ActionRef) {
  return {
    loading: loadingState("Loading Vault Notes"),
    empty: <EmptyState label={empty}><Text text={explanation} /><Button label="Browse notes" action={browse} /></EmptyState>,
    error: errorState(error),
    permissionDenied: errorState("You do not have permission to view this Vault content"),
    offline: errorState("This collection is unavailable while offline on this host"),
  };
}
