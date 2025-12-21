import { useMemo, useState } from "react";
import type { DataTreeNode } from "../dataSources/DataSource";

function flattenIds(node: DataTreeNode, acc: string[] = []): string[] {
  acc.push(node.id);
  for (const c of node.children ?? []) flattenIds(c, acc);
  return acc;
}

export function Tree({
  root,
  onSelect,
}: {
  root: DataTreeNode;
  onSelect: (node: DataTreeNode) => void;
}) {
  const allIds = useMemo(() => new Set(flattenIds(root)), [root]);
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["availableData"]));

  // keep openIds clean if tree changes (search)
  useMemo(() => {
    setOpenIds((prev) => new Set([...prev].filter((id) => allIds.has(id))));
  }, [allIds]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const NodeView = ({ node, depth }: { node: DataTreeNode; depth: number }) => {
    const hasChildren = (node.children?.length ?? 0) > 0;
    const isOpen = openIds.has(node.id);

    return (
      <div>
        <div
          className={`treeNode ${node.selectable ? "selectable" : ""}`}
          style={{ paddingLeft: 12 + depth * 14 }}
        >
          {hasChildren ? (
            <button className="treeBtn" onClick={() => toggle(node.id)}>
              {isOpen ? "▾" : "▸"}
            </button>
          ) : (
            <span className="treeSpacer" />
          )}

          <button
            className="treeLabel"
            onClick={() => {
              if (node.selectable) onSelect(node);
              else if (hasChildren) toggle(node.id);
            }}
          >
            {node.label}
          </button>
        </div>

        {hasChildren && isOpen && (
          <div>
            {node.children!.map((c) => (
              <NodeView key={c.id} node={c} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return <NodeView node={root} depth={0} />;
}
