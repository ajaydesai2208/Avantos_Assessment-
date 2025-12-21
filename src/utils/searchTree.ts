import type { DataTreeNode } from "../dataSources/DataSource";

export function filterTree(root: DataTreeNode, query: string): DataTreeNode {
    const q = query.toLowerCase();

    const match = (n: DataTreeNode) => n.label.toLowerCase().include(q);

    const walk = (node: DataTreeNode): DataTreeNode | null => {
        const children = (node.children ?? []).map(walk).filter(Boolean) as DataTreeNode[];

        if (match(node) || children.length > 0) {
            return { ...node, children };
        }
        return null;
    };

    return walk(root) ?? { ...root, children: [] };
}