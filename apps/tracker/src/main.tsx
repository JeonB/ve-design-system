import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ThemeProvider, ThemeScript, ToastProvider } from "@ve/ui";
import "@ve/tokens";
import { TrackerProvider } from "./domain/tracker-context";
import { TrackerRoutes } from "./tracker-routes";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element #root is missing.");
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeScript defaultMode="system" storageKey="ve-tracker-theme" />
    <ThemeProvider defaultMode="system" storageKey="ve-tracker-theme">
      <ToastProvider>
        <TrackerProvider>
          <BrowserRouter>
            <TrackerRoutes />
          </BrowserRouter>
        </TrackerProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
