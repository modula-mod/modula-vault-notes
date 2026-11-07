import {describe, expect, it} from "vitest";
import {artifact, nodes, view, type NodeValue} from "./artifact";

type ActionNode = NodeValue & {actions?: string[]};
type RouteAction = {id: string; family: string; route?: string};

function actionIds(viewId: string): string[] {
  return nodes(view(viewId).root).flatMap(node => {
    const value = node as ActionNode;
    return [value.action, ...(value.actions ?? [])].filter((id): id is string => typeof id === "string");
  });
}

function routeAction(id: string): RouteAction | undefined {
  return (artifact.actions as RouteAction[]).find(action => action.id === id && action.family === "route.open");
}

function reachableViewIds(): Set<string> {
  const seen = new Set<string>();
  const queue = [artifact.entry];
  while (queue.length) {
    const viewId = queue.shift();
    if (!viewId || seen.has(viewId)) continue;
    seen.add(viewId);
    for (const id of actionIds(viewId)) {
      const route = routeAction(id)?.route;
      const target = artifact.routes.find(item => item.path === route);
      if (target) queue.push(target.viewId);
    }
  }
  return seen;
}

describe("installed route reachability", () => {
  it("reaches every declared route from the entry view through rendered route.open controls", () => {
    const reached = reachableViewIds();
    const missing = artifact.routes.filter(route => !reached.has(route.viewId)).map(route => route.path);
    expect(missing).toEqual([]);
  });

  it("places every tab and secondary destination on the home view", () => {
    const homeRoutes = new Set(actionIds("home").flatMap(id => {
      const route = routeAction(id)?.route;
      return route ? [route] : [];
    }));
    for (const tab of artifact.navigation.tabs) {
      if (tab.viewId === artifact.entry) continue;
      const route = artifact.routes.find(item => item.viewId === tab.viewId);
      expect(homeRoutes.has(route?.path ?? "")).toBe(true);
    }
    for (const item of artifact.navigation.secondary) {
      const route = artifact.routes.find(candidate => candidate.viewId === item.viewId);
      expect(homeRoutes.has(route?.path ?? "")).toBe(true);
    }
  });

  it("gives every non-entry view a rendered return to Notes", () => {
    for (const item of artifact.views) {
      if (item.id === artifact.entry) continue;
      expect(actionIds(item.id)).toContain("openHome");
    }
  });

  it("binds note history, share, and trash restore on the controls hosts actually dispatch", () => {
    expect(actionIds("detail")).toEqual(expect.arrayContaining(["openHome", "editNote", "openHistory", "shareNote", "deleteNote"]));
    const trashList = nodes(view("trash").root).find(node => node.type === "recordList") as ActionNode | undefined;
    expect(trashList?.action).toBe("restoreNote");
    expect(trashList?.actions).toEqual(expect.arrayContaining(["restoreNote", "purgeNote"]));
  });
});
