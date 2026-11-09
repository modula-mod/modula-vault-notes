import {describe, expect, it} from "vitest";
import {action, nodes, view} from "./artifact";

describe("Vault advanced surfaces", () => {
  it("registers templates and Daily Note through reviewed functions", () => {
    expect(nodes(view("templates").root).map(node => node.type)).toContain("recordList");
    expect(action("createFromTemplate").family).toBe("function.invoke");
    expect(action("createDailyNote").functionId).toContain("note.create-daily");
  });

  it("keeps history, attachments, and graph honest about host capabilities", () => {
    expect(view("history").states?.empty?.type).toBe("emptyState");
    expect(nodes(view("attachments").root).map(node => node.text)).toContain("Open a note to add, view, or remove its files.");
    expect(view("graph").states?.capabilityUnavailable?.text).toContain("unavailable");
  });
});
