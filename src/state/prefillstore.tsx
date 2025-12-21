import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";

export type DataElementRef = {
  sourceId: string;     // ex: "upstreamForms" or "global"
  valuePath: string;    // ex: "forms.formA.email"
  labelPath: string;    // ex: "Form A.email"
};

type State = {
  enabledByFormId: Record<string, boolean>;
  mappingByFormId: Record<string, Record<string, DataElementRef | null>>;
};

type Action =
  | { type: "toggleEnabled"; formId: string; enabled: boolean }
  | { type: "setMapping"; formId: string; fieldId: string; ref: DataElementRef }
  | { type: "clearMapping"; formId: string; fieldId: string }
  | { type: "hydrate"; state: State };

const DEFAULT_STATE: State = {
  enabledByFormId: {},
  mappingByFormId: {},
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "toggleEnabled": {
      return {
        ...state,
        enabledByFormId: { ...state.enabledByFormId, [action.formId]: action.enabled },
      };
    }

    case "setMapping": {
      const current = state.mappingByFormId[action.formId] ?? {};
      return {
        ...state,
        mappingByFormId: {
          ...state.mappingByFormId,
          [action.formId]: { ...current, [action.fieldId]: action.ref },
        },
      };
    }

    case "clearMapping": {
      const current = state.mappingByFormId[action.formId] ?? {};
      return {
        ...state,
        mappingByFormId: {
          ...state.mappingByFormId,
          [action.formId]: { ...current, [action.fieldId]: null },
        },
      };
    }

    case "hydrate":
      return action.state;

    default:
      return state;
  }
}

const STORAGE_KEY = "journey_builder_prefill_v1";

const PrefillContext = createContext<{
  state: State;
  toggleEnabled: (formId: string, enabled: boolean) => void;
  setMapping: (formId: string, fieldId: string, ref: DataElementRef) => void;
  clearMapping: (formId: string, fieldId: string) => void;
} | null>(null);

export function PrefillProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  // Hydrate once
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as State;
      dispatch({ type: "hydrate", state: parsed });
    } catch {
      // ignore bad storage
    }
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    return {
      state,
      toggleEnabled: (formId: string, enabled: boolean) =>
        dispatch({ type: "toggleEnabled", formId, enabled }),
      setMapping: (formId: string, fieldId: string, ref: DataElementRef) =>
        dispatch({ type: "setMapping", formId, fieldId, ref }),
      clearMapping: (formId: string, fieldId: string) =>
        dispatch({ type: "clearMapping", formId, fieldId }),
    };
  }, [state]);

  return <PrefillContext.Provider value={api}>{children}</PrefillContext.Provider>;
}

export function usePrefillStore() {
  const ctx = useContext(PrefillContext);
  if (!ctx) throw new Error("usePrefillStore must be used inside PrefillProvider");
  return ctx;
}
