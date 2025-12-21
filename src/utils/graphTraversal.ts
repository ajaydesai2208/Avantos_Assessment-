import type { Graph, FormNode } from "../domain/graph";

function byId(graph: Graph): Map<string, FormNode> {
  return new Map(graph.forms.map((f) => [f.id, f]));
}

export function getDirectParents(graph: Graph, formId: string): FormNode[] {
  const idMap = byId(graph);
  const parentIds = graph.edges
    .filter((e) => e.to === formId)
    .map((e) => e.from);

  return parentIds
    .map((id) => idMap.get(id))
    .filter(Boolean) as FormNode[];
}

export function getAllAncestors(graph: Graph, formId: string): FormNode[] {
  const idMap = byId(graph);

  // reverse adjacency: child -> parents
  const parentsByChild = new Map<string, string[]>();
  for (const e of graph.edges) {
    parentsByChild.set(e.to, [...(parentsByChild.get(e.to) ?? []), e.from]);
  }

  const visited = new Set<string>();
  const result: FormNode[] = [];

  const stack = [...(parentsByChild.get(formId) ?? [])];
  while (stack.length) {
    const current = stack.pop()!;
    if (visited.has(current)) continue;
    visited.add(current);

    const node = idMap.get(current);
    if (node) result.push(node);

    const next = parentsByChild.get(current) ?? [];
    for (const p of next) stack.push(p);
  }

  return result;
}

export function getTransitiveParents(graph: Graph, formId: string): FormNode[] {
  const direct = new Set(getDirectParents(graph, formId).map((f) => f.id));
  const all = getAllAncestors(graph, formId);
  return all.filter((f) => !direct.has(f.id));
}
