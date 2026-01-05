import { useMemo, useState } from "react";
import type { Graph, FormNode } from "../domain/graph";
import { DEFAULT_DATA_SOURCES } from "../dataSources/registry";
import type { DataTreeNode } from "../dataSources/DataSource";
import { filterTree } from "../utils/searchTree";
import { Tree } from "./Tree";
import { usePrefillStore } from "../state/prefillStore";


function pruneUpstreamTree(
  upstream: DataTreeNode,
  wantDirect: boolean,
  wantTransitive: boolean
): DataTreeNode | null {
  // const upstreamShape = {
  //   id : "upstreamRoot",
  //   children: [
  //     { id: "directDeps", children: [...] },
  //     { id: "transitiveDeps", children: [...] }
  //   ]
  // }
  const children = (upstream.children ?? []).filter((c) => {
    if (c.id === "directDeps") return wantDirect;
    if (c.id === "transitiveDeps") return wantTransitive;
    return false;
  });

  const nonEmpty = children.filter((c) => (c.children?.length ?? 0) > 0);

  if (nonEmpty.length === 0) return null;
  return { ...upstream, children: nonEmpty };
}


export function MappingModal({
  open,
  graph,
  targetForm,
  fieldId,
  onClose,
  dataSourceFilter = []
}: {
  open: boolean;
  graph: Graph;
  targetForm: FormNode;
  fieldId: string | null;
  onClose: () => void;
  dataSourceFilter?: ("direct" | "transitive" | "global")[];
}) {
  const { setMapping } = usePrefillStore();
  const [query, setQuery] = useState("");

  const noFilterProvided = dataSourceFilter.length === 0;

  const includeDirect = noFilterProvided || dataSourceFilter.includes("direct");
  const includeTransitive = noFilterProvided || dataSourceFilter.includes("transitive");
  const includeGlobal = noFilterProvided || dataSourceFilter.includes("global");


  const root: DataTreeNode = useMemo(() => {
    const upstreamDs = DEFAULT_DATA_SOURCES.find((d) => d.id === "upstreamForms");
    const globalDs = DEFAULT_DATA_SOURCES.find((d) => d.id === "global");
    const children: DataTreeNode[] = []

    if (upstreamDs) {
      const upstreamFull = upstreamDs.buildTree({ graph, targetFormID: targetForm.id });
      const upstreamFiltered = pruneUpstreamTree(upstreamFull, includeDirect, includeTransitive);
      if (upstreamFiltered) children.push(upstreamFiltered);
    }

    if (includeGlobal && globalDs) {
      const globalTree = globalDs.buildTree({ graph, targetFormID: targetForm.id });
      if (globalTree) children.push(globalTree);
    }

    return {
      id: "availableData",
      label: "Available data",
      children,
    };
  }, [graph, targetForm.id, includeDirect, includeTransitive, includeGlobal]);

  const filtered = useMemo(() => {
    const q = query.trim();
    return q ? filterTree(root, q) : root;
  }, [root, query]);

  if (!open || !fieldId) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modal">
        <div className="row spaceBetween">
          <div>
            <div className="modalTitle">Select data element to map</div>
            <div className="subtle">
              Mapping target: <span className="mono">{targetForm.name}.{fieldId}</span>
            </div>
            {!noFilterProvided && (
              <div className="subtle">
                Filter active: {" "}
                <span className="mono">
                  {[
                    includeDirect ? "direct" : null,
                    includeTransitive ? "transitive" : null,
                    includeGlobal ? "global" : null,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>
            )}
          </div>

          <button className="btn" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="divider" />

        <input
          className="input"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="treeWrap">
          <Tree
            root={filtered}
            onSelect={(node) => {
              if (!node.selectable || !node.valuePath || !node.labelPath || !node.sourceId) return;

              setMapping(targetForm.id, fieldId, {
                sourceId: node.sourceId,
                valuePath: node.valuePath,
                labelPath: node.labelPath,
              });

              onClose();
              setQuery("");
            }}
          />
        </div>

        <div className="row rightAlign">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
