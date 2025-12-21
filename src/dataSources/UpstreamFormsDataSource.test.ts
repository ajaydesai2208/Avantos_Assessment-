import { describe, expect, it } from "vitest";
import { UpstreamFormsDataSource } from "./UpstreamFormsDataSource";
import type { Graph } from "../domain/graph";

const graph: Graph = {
  forms: [
    { id: "A", name: "Form A", fields: [{ id: "email", label: "email" }] },
    { id: "B", name: "Form B", fields: [{ id: "name", label: "name" }] },
    { id: "D", name: "Form D", fields: [{ id: "target", label: "target" }] },
  ],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "D" },
  ],
};

describe("UpstreamFormsDataSource", () => {
  it("builds direct and transitive groups", () => {
    const tree = UpstreamFormsDataSource.buildTree({ graph, targetFormId: "D" });
    const directGroup = tree.children?.find((c) => c.id === "directDeps");
    const transitiveGroup = tree.children?.find((c) => c.id === "transitiveDeps");

    expect(directGroup?.children?.[0]?.label).toBe("Form B");
    expect(transitiveGroup?.children?.[0]?.label).toBe("Form A");
  });
});
