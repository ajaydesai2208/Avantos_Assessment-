import type { Edge, Field, FormNode, Graph } from "./graph";

type UnknownRecord = Record<string, unknown>;

function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function asString(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function extractFields(schemaLike: unknown): Field[] {
  if (!isRecord(schemaLike)) return [];

  // Support a few shapes, but for your graph.json this is the key one:
  // formSchema.field_schema.properties
  const fieldSchema = schemaLike["field_schema"];
  if (isRecord(fieldSchema)) {
    const props = fieldSchema["properties"];
    if (isRecord(props)) {
      return Object.keys(props).map((key) => {
        const def = props[key];
        const label =
          isRecord(def) && typeof def["title"] === "string"
            ? (def["title"] as string)
            : key;

        const type =
          isRecord(def) && typeof def["avantos_type"] === "string"
            ? (def["avantos_type"] as string)
            : isRecord(def) && typeof def["type"] === "string"
              ? (def["type"] as string)
              : "unknown";

        return { id: key, label, type };
      });
    }
  }

  return [];
}

export function normalizeGraph(payload: unknown): Graph {
  const p: UnknownRecord = isRecord(payload) ? payload : {};
  const data: UnknownRecord = isRecord(p["data"]) ? (p["data"] as UnknownRecord) : {};

  const rawNodes = asArray(p["nodes"] ?? data["nodes"]);
  const rawEdges = asArray(p["edges"] ?? data["edges"]);

  // This is the schema list in your graph.json (ids like f_...)
  const rawSchemas = asArray(p["forms"] ?? data["forms"]);
  const schemaById = new Map<string, UnknownRecord>();

  for (const s of rawSchemas) {
    if (!isRecord(s)) continue;
    const id = asString(s["id"]);
    if (id) schemaById.set(id, s);
  }

  const forms: FormNode[] = rawNodes
    .map((n) => (isRecord(n) ? n : null))
    .filter((n): n is UnknownRecord => !!n)
    .filter((n) => asString(n["type"]) === "form")
    .map((n) => {
      const nodeId = asString(n["id"]) ?? "";
      const nd = isRecord(n["data"]) ? (n["data"] as UnknownRecord) : {};

      const name = asString(nd["name"]) ?? nodeId;
      const schemaId = asString(nd["component_id"]);
      const schema = schemaId ? schemaById.get(schemaId) : undefined;

      return {
        id: nodeId,                 // IMPORTANT: matches edges (form-...)
        name,                       // "Form A"..."Form F"
        schemaId,                   // f_...
        fields: extractFields(schema), // fields from schema
      };
    })
    .filter((f) => f.id);

  const edges: Edge[] = rawEdges
    .map((e) => (isRecord(e) ? e : null))
    .filter((e): e is UnknownRecord => !!e)
    .map((e) => {
      const from = asString(e["source"] ?? e["from"] ?? e["upstream"] ?? e["parent"]);
      const to = asString(e["target"] ?? e["to"] ?? e["downstream"] ?? e["child"]);
      if (!from || !to) return null;
      return { from, to };
    })
    .filter((e): e is Edge => e !== null);

  if (forms.length === 0) {
    throw new Error(
      `Could not parse form nodes from graph response. Top-level keys: ${Object.keys(p).join(", ")}`
    );
  }

  return { forms, edges };
}
