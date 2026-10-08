import {readFileSync} from "node:fs";

export type NodeValue = {
  type?: string;
  text?: string;
  action?: string;
  binding?: string;
  field?: {id?: string; type?: string};
  children?: NodeValue[];
};

export type FrontendArtifact = {
  entry: string;
  hostRuntime: {versionRange: string};
  routes: Array<{path: string; viewId: string}>;
  views: Array<{id: string; kind: string; bindings?: Array<Record<string, unknown>>; root: NodeValue; states?: Record<string, NodeValue>}>;
  actions: Array<{id: string; family: string; capability?: string; functionId?: string}>;
  capabilities: {required: string[]; optional: string[]};
  navigation: {rootView: string; tabs: Array<{id: string; viewId: string}>; secondary: Array<{id: string; viewId: string}>};
};

export const artifact = JSON.parse(readFileSync(new URL("../frontend.manifest.json", import.meta.url), "utf8")) as FrontendArtifact;

export function view(id: string) {
  const value = artifact.views.find(candidate => candidate.id === id);
  if (!value) throw new Error(`Missing frontend view ${id}`);
  return value;
}

export function action(id: string) {
  const value = artifact.actions.find(candidate => candidate.id === id);
  if (!value) throw new Error(`Missing frontend action ${id}`);
  return value;
}

export function nodes(root: NodeValue): NodeValue[] {
  return [root, ...(root.children ?? []).flatMap(nodes)];
}

export function fieldIds(viewId: string): string[] {
  return nodes(view(viewId).root).flatMap(node => node.field?.id ? [node.field.id] : []);
}
