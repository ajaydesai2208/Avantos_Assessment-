import { fetchJson } from "./fetchJson";
import { normalizeGraph } from "../domain/normalizeGraph";
import type { Graph } from "../domain/graph";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";
const PRIMARY_ENDPOINT =
  import.meta.env.VITE_GRAPH_ENDPOINT ?? "/v1/demo/actions/blueprints/demo/graph";

const FALLBACKS = [PRIMARY_ENDPOINT];

export async function fetchGraph(): Promise<Graph> {
  let lastErr: unknown = null;

  for (const path of FALLBACKS) {
    try {
      const raw = await fetchJson(BASE_URL, path);
      return normalizeGraph(raw);
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr instanceof Error ? lastErr : new Error("Failed to fetch graph");
}
