// src/components/FormList.tsx
import type { FormNode } from "../domain/graph";

type Props = {
  forms: FormNode[];
  selectedFormId: string | null;
  onSelect: (id: string) => void;
};

export function FormList({ forms, selectedFormId, onSelect }: Props) {
  return (
    <div className="panel">
      <div className="row">
        <strong>Forms</strong>
      </div>

      <div className="list">
        {forms.map((f) => {
          const isActive = selectedFormId === f.id;

          return (
            <button
              key={f.id}
              type="button"
              className={`list-item ${isActive ? "active" : ""}`}
              onClick={() => onSelect(f.id)}
            >
              {f.name ?? f.id}
            </button>
          );
        })}
      </div>
    </div>
  );
}
