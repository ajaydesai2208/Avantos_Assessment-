import type { Graph, FormNode } from "../domain/graph";
import { getDirectParents, getTransitiveParents } from "../utils/graphTraversal";
import { PrefillPanel } from "./PrefillPanel";

export function FormDetails({ graph, form} : { graph: Graph; form: FormNode }) {
    const direct = getDirectParents(graph, form.id);
    const transitive = getTransitiveParents(graph, form.id);

    return (
        <div className="stack">
            <div className="panel">
                <div className="row spaceBetween">
                <div>
                    <div className="panelTitle">{form.name}</div>
                    <div className="subtitle">Form id: {form.schemaId ?? form.id}</div>
                </div>
                </div>

                <div className="divider" />

                <div className="grid2">
                <div>
                    <div className="subtle bold">Direct dependencies</div>
                    {direct.length === 0 ? (
                    <div className="subtle">None</div>
                    ) : (
                    <ul className="ul">
                        {direct.map((p) => (
                        <li key={p.id}>
                            {p.name} <span className="subtle">({p.id})</span>
                        </li>
                        ))}
                    </ul>
                    )}
                </div>

                <div>
                    <div className="subtle bold">Transitive dependencies</div>
                    {transitive.length === 0 ? (
                        <div className="subtle">None</div>
                    ) : (
                        <ul className="ul">
                            {transitive.map((p) => (
                                <li key={p.id}>
                                    {p.name} <span className="subtle">({p.id})</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
        <PrefillPanel graph={graph} form={form} />
    </div>
    );
}