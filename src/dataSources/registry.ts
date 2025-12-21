import type { DataSource } from "./DataSource";
import { UpstreamFormsDataSource } from "./UpstreamFormsDataSource";
import { GlobalDataSource } from "./GlobalDataSource";

export const DEFAULT_DATA_SOURCES: DataSource[] = [
  UpstreamFormsDataSource,
  GlobalDataSource,
];
