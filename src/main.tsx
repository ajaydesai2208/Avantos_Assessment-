window.addEventListener("error", (e) => {
  document.body.innerHTML = `<pre style="padding:16px;white-space:pre-wrap;">${String(
    e.error?.stack || e.message
  )}</pre>`;
});

window.addEventListener("unhandledrejection", (e) => {
  document.body.innerHTML = `<pre style="padding:16px;white-space:pre-wrap;">${String(
    (e as PromiseRejectionEvent).reason?.stack || (e as PromiseRejectionEvent).reason
  )}</pre>`;
});

import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import { PrefillProvider } from "./state/prefillStore";
import "./style/app.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootEl = document.getElementById("root");

if (!rootEl) {
  document.body.innerHTML =
    "<pre style='padding:16px'>ERROR: #root element not found. Check index.html</pre>";
  throw new Error("Root element (#root) not found");
}

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <PrefillProvider>
        <App />
      </PrefillProvider>
    </QueryClientProvider>
  </React.StrictMode>
);