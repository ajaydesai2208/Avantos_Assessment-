import { useMemo, useState } from "react";
import type { Graph, FormNode } from "../domain/graph";
import { DEFAULT_DATA_SOURCES } from "../dataSources/registry";
import type { DataTreeNode } from "../dataSources/DataSource";
import { filterTree } from "../utils/searchTree";
import { Tree } from "./Tree";
import { usePrefillStore } from "../state/prefillStore";

export function MappingModal({
  open,
  graph,
  targetForm,
  fieldId,
  onClose,
}: {
  open: boolean;
  graph: Graph;
  targetForm: FormNode;
  fieldId: string | null;
  onClose: () => void;
}) {
  const { setMapping } = usePrefillStore();
  const [query, setQuery] = useState("");

  const root: DataTreeNode = useMemo(() => {
    const children = DEFAULT_DATA_SOURCES.map((ds) =>
      ds.buildTree({ graph, targetFormId: targetForm.id })
    );

    return {
      id: "availableData",
      label: "Available data",
      children,
    };
  }, [graph, targetForm.id]);

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
