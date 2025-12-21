import type { Graph } from "../domain/graph";

export type DataTreeNode = {
    id: string;
    label: string;
    selectable?: boolean;
    valuePath?: string;
    labelPath?: string;
    sourceId?: string;
    children?: DataTreeNode[];
};

export type DataSourceContext = {
    graph: Graph;
    targetFormID: string;
};

export type DataSource = {
    id: string;
    label: string;
    buildTree: (ctx: DataSourceContext) => DataSource;
};