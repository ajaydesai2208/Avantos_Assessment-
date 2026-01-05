import type { DataSource } from "./DataSource";

export const GlobalDataSource: DataSource = {
  id: "global",
  label: "Global Data",
  buildTree: (_ctx) => {
    return {
      id: "globalRoot",
      label: "Global Data",
      children: [
        {
          id: "actionProps",
          label: "Action Properties",
          children: [
            {
              id: "action:id",
              label: "action.id",
              selectable: true,
              sourceId: "global",
              valuePath: "action.id",
              labelPath: "Action Properties.action.id",
            },
            {
              id: "action:createdAt",
              label: "action.created_at",
              selectable: true,
              sourceId: "global",
              valuePath: "action.created_at",
              labelPath: "Action Properties.action.created_at",
            },
          ],
        },
        {
          id: "clientProps",
          label: "Client Organisation Properties",
          children: [
            {
              id: "client:name",
              label: "client.name",
              selectable: true,
              sourceId: "global",
              valuePath: "client.name",
              labelPath: "Client Org Properties.client.name",
            },
            {
              id: "client:country",
              label: "client.country",
              selectable: true,
              sourceId: "global",
              valuePath: "client.country",
              labelPath: "Client Org Properties.client.country",
            },
          ],
        },
      ],
    };
  },
};
