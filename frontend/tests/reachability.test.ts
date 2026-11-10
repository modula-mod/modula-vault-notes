import {describe, expect, it} from "vitest";
import {action, artifact, nodes, view} from "./artifact";

function actionIds(viewId: string): string[] {
  return nodes(view(viewId).root).flatMap(node =>
    [node.action, ...(node.actions ?? [])].filter((id): id is string => typeof id === "string"),
  );
}

function routeParameters(path: string): Set<string> {
  return new Set(path.split("/").filter(segment => segment.startsWith(":")).map(segment => segment.slice(1)));
}

function canOpenRoute(currentPath: string, actionId: string): boolean {
  const candidate = action(actionId);
  if (candidate.family !== "route.open" || !candidate.route) return false;
  const available = routeParameters(currentPath);
  if (candidate.recordParam) available.add(candidate.recordParam);
  return [...routeParameters(candidate.route)].every(parameter => available.has(parameter));
}

function reachableRoutePaths(): Set<string> {
  const entryRoute = artifact.routes.find(route => route.viewId === artifact.entry);
  if (!entryRoute) throw new Error(`Missing route for entry view ${artifact.entry}`);
  const seen = new Set<string>();
  const queue = [entryRoute.path];

  while (queue.length) {
    const currentPath = queue.shift();
    if (!currentPath || seen.has(currentPath)) continue;
    seen.add(currentPath);
    const currentRoute = artifact.routes.find(route => route.path === currentPath);
    if (!currentRoute) continue;
    for (const actionId of actionIds(currentRoute.viewId)) {
      if (!canOpenRoute(currentPath, actionId)) continue;
      const targetPath = action(actionId).route;
      if (targetPath && !seen.has(targetPath)) queue.push(targetPath);
    }
  }

  return seen;
}

describe("compiled route reachability", () => {
  it("reaches all 26 declared routes through rendered route.open controls", () => {
    const reached = reachableRoutePaths();
    const missing = artifact.routes.filter(route => !reached.has(route.path)).map(route => route.path);
    expect(artifact.routes).toHaveLength(26);
    expect(reached.size).toBe(26);
    expect(missing).toEqual([]);
  });

  it("renders every tab and secondary destination on the home view", () => {
    const homeRoutes = new Set(actionIds("home").flatMap(id => {
      const candidate = action(id);
      return candidate.family === "route.open" && candidate.route ? [candidate.route] : [];
    }));
    for (const item of [...artifact.navigation.tabs, ...artifact.navigation.secondary]) {
      if (item.viewId === artifact.entry) continue;
      const route = artifact.routes.find(candidate => candidate.viewId === item.viewId);
      expect(homeRoutes.has(route?.path ?? "")).toBe(true);
    }
  });

  it("gives every non-entry view a rendered return to Notes", () => {
    for (const item of artifact.views) {
      if (item.id === artifact.entry) continue;
      expect(actionIds(item.id), item.id).toContain("openHome");
    }
  });

  it("preserves note context while supplying record-scoped route parameters", () => {
    expect(action("openNote").recordParam).toBe("noteId");
    expect(canOpenRoute("/", "openNote")).toBe(true);
    expect(canOpenRoute("/note/:noteId", "editNote")).toBe(true);
    expect(canOpenRoute("/note/:noteId", "openHistory")).toBe(true);
    expect(action("openRevision").recordParam).toBe("revisionId");
    expect(canOpenRoute("/note/:noteId/history", "openRevision")).toBe(true);
    expect(canOpenRoute("/", "openRevision")).toBe(false);
  });
});
