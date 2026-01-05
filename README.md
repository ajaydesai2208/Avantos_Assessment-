# Journey Builder Prefill Editor

A React + TypeScript app that:
- Fetches a form DAG from a mock server
- Renders a list of forms
- Allows viewing and editing Prefill mappings per form field
- Uses extensible “Data Sources” to provide mapping options (upstream forms, global data)

---

## Local setup

### 1) Run the mock server (included in this repo)

In one terminal:

```bash
cd mock-server
npm install
npm start
```
### 2) Run the frontend

In a new terminal (project root):
```bash
npm install
npm run dev
```
Frontend runs at:

http://localhost:5173

### Environment variables

Create .env.local:
```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_GRAPH_ENDPOINT=/action-blueprint-graph
```

How it works

- VITE_API_BASE_URL=/api uses the Vite dev proxy (see vite.config.ts) so requests go to the mock server.

- The app will request: GET /api/graph

- Vite proxies that to the mock server running on http://localhost:3000

If your mock server uses a different endpoint path, update VITE_GRAPH_ENDPOINT.

### Extending data sources

Data sources are pluggable and live under src/dataSources.

Each data source implements:

- id

- label

- buildTree({ graph, targetFormId }) => DataTreeNode

To add a new source:

1. Create a new file in src/dataSources, e.g. MyNewDataSource.ts

2. Export a DataSource

3. Add it to DEFAULT_DATA_SOURCES in src/dataSources/registry.ts

No UI changes required.

### Testing
```bash
npm run test:run
```

## URL Parameter Filtering

You can control which data sources are visible in the "Click to map" modal using a URL query parameter. This allows testing or embedding the editor in contexts where only specific data sources should be available.

**Usage:**

Append `?filter=<source1>,<source2>` to the URL.

**Supported Values:**
- `direct` - Shows only direct dependencies from upstream forms.
- `transitive` - Shows only transitive dependencies.
- `global` - Shows only global data sources.

**Examples:**

- `http://localhost:5173/?filter=direct` (Only direct dependencies)
- `http://localhost:5173/?filter=global` (Only global data)
- `http://localhost:5173/?filter=direct,transitive` (Both direct and transitive)

**Default Behavior:**
If no `filter` parameter is provided, **all** data sources are shown.

### Implementation Details

1.  **URL Parsing**: The application parses the `window.location.search` string in `PrefillPanel.tsx` component.
2.  **Prop Passing**: The parsed filter list is passed as a `dataSourceFilter` prop to the `MappingModal` component.
3.  **Filtering Logic**: Inside `MappingModal`, the data tree is built normally, but then pruned to include only the requested groups (e.g., `directDeps`, `transitiveDeps`) based on the filter.