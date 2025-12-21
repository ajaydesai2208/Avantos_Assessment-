import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchGraph } from "./api/graphApi";
import { AppShell } from "./components/AppShell";
import { FormList } from "./components/FormList";
import { FormDetails } from "./components/FormDetails";
import type { Graph, FormNode } from "./domain/graph";

export default function App() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["graph"],
    queryFn: fetchGraph,
  });

  const graph: Graph | null = data ?? null;

  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);


  const forms: FormNode[] = graph?.forms ?? [];

  const effectiveSelectedFormId = selectedFormId ?? (forms[0]?.id ?? null);

  const selectedForm = useMemo(() => {
    if (!effectiveSelectedFormId) return null;
    return forms.find((f) => f.id === effectiveSelectedFormId) ?? null;
  }, [forms, effectiveSelectedFormId]);

  return (
    <AppShell
      title="Journey Builder Prefill Editor"
      subtitle="Forms list + Prefill mapping UI (mock server)"
    >
      {isLoading && <div className="panel">Loading graph...</div>}

      {isError && (
        <div className="panel error">
          <div className="row">
            <strong>Failed to load graph</strong>
            <button className="btn" onClick={() => refetch()}>
              Retry
            </button>
          </div>
          <pre className="code">{(error as Error)?.message ?? "Unknown error"}</pre>
        </div>
      )}

      {graph && (
        <div className="layout">
          <div className="left">
            <FormList
              forms={forms}
              selectedFormId={effectiveSelectedFormId}
              onSelect={(id) => setSelectedFormId(id)}
            />
          </div>

          <div className="right">
            {selectedForm ? (
              <FormDetails graph={graph} form={selectedForm} />
            ) : (
              <div className="panel">Select a form to edit prefill.</div>
            )}
          </div>
        </div>
      )}
    </AppShell>
  );
}
