import { describe, expect, it } from "vitest";
import type { Graph } from "../domain/graph";
import { getDirectParents, getTransitiveParents } from "./graphTraversal";

const graph: Graph = {
  forms: [
    { id: "A", name: "Form A", fields: [] },
    { id: "B", name: "Form B", fields: [] },
    { id: "C", name: "Form C", fields: [] },
    { id: "D", name: "Form D", fields: [] },
  ],
  edges: [
    { from: "A", to: "B" },
    { from: "B", to: "D" },
    { from: "C", to: "D" },
  ],
};

describe("graphTraversal", () => {
  it("computes direct parents", () => {
    const direct = getDirectParents(graph, "D").map((x) => x.id).sort();
    expect(direct).toEqual(["B", "C"]);
  });

  it("computes transitive parents", () => {
    const transitive = getTransitiveParents(graph, "D").map((x) => x.id).sort();
    expect(transitive).toEqual(["A"]);
  });
});
