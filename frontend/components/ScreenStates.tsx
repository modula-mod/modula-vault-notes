import {EmptyState, ErrorState, LoadingState} from "@modula/product-ui";

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
