import { useMemo, useState } from "react";
import type { Graph, FormNode } from "../domain/graph";
import { usePrefillStore } from "../state/prefillStore";
import { MappingModal } from "./MappingModal";

export function PrefillPanel({ graph, form }: { graph: Graph; form: FormNode }) {
  const { state, toggleEnabled, clearMapping } = usePrefillStore();
  const enabled = state.enabledByFormId[form.id] ?? true;
  const mappings = state.mappingByFormId[form.id] ?? {};

  const [modalFieldId, setModalFieldId] = useState<string | null>(null);

  const fields = useMemo(() => form.fields, [form.fields]);

  return (
    <div className="panel">
      <div className="row spaceBetween">
        <div>
          <div className="panelTitle">Prefill</div>
          <div className="subtle">Prefill fields for this form</div>
        </div>

        <label className="toggle">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => toggleEnabled(form.id, e.target.checked)}
          />
          <span className="toggleUi" />
        </label>
      </div>

      <div className="divider" />

      {!enabled && (
        <div className="hint">
          Prefill is disabled for this form. Mappings are preserved but not active.
        </div>
      )}

      <div className={`stack ${!enabled ? "disabled" : ""}`}>
        {fields.map((field) => {
          const ref = mappings[field.id] ?? null;

          if (!ref) {
            return (
              <button
                key={field.id}
                className="prefillRow empty"
                onClick={() => setModalFieldId(field.id)}
              >
                <div className="row spaceBetween">
                  <div className="mono">{field.id}</div>
                  <div className="subtle">Click to map</div>
                </div>
              </button>
            );
          }

          return (
            <div key={field.id} className="prefillRow filled">
              <div className="row spaceBetween">
                <div>
                  <span className="mono">{field.id}</span>
                  <span className="subtle">: </span>
                  <span>{ref.labelPath}</span>
                </div>

                <button
                  className="iconBtn"
                  title="Clear mapping"
                  onClick={() => clearMapping(form.id, field.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <MappingModal
        open={modalFieldId !== null}
        graph={graph}
        targetForm={form}
        onClose={() => setModalFieldId(null)}
        fieldId={modalFieldId}
      />
    </div>
  );
}
