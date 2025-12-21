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