import type { DataSource, DataTreeNode } from "./DataSource";
import { getDirectParents, getTransitiveParents } from "../utils/graphTraversal";

export const UpstreamFormsDataSource: DataSource = {
  id: "upstreamForms",
  label: "Upstream Form Fields",
  buildTree: ({ graph, targetFormId }) => {
    const direct = getDirectParents(graph, targetFormId);
    const transitive = getTransitiveParents(graph, targetFormId);

    const toFormNode = (form: any): DataTreeNode => ({
      id: `form:${form.id}`,
      label: form.name,
      children: form.fields.map((field: any) => ({
        id: `field:${form.id}:${field.id}`,
        label: field.label,
        selectable: true,
        sourceId: "upstreamForms",
        valuePath: `forms.${form.id}.${field.id}`,
        labelPath: `${form.name}.${field.id}`,
      })),
    });

    return {
      id: "upstreamRoot",
      label: "Upstream Forms",
      children: [
        {
          id: "directDeps",
          label: "Direct dependencies",
          children: direct.map(toFormNode),
        },
        {
          id: "transitiveDeps",
          label: "Transitive dependencies",
          children: transitive.map(toFormNode),
        },
      ],
    };
  },
};
