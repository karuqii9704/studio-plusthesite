import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import ErrorBoundary from "@/components/ErrorBoundary";
import ThemeProvider from "@/components/ThemeProvider";
import { I18nProvider } from "@/i18n/I18nProvider";
import StudioApp from "@/studio/StudioApp";
import "./index.css";

const container = document.getElementById("root");
if (!container) throw new Error("Root element #root is missing from index.html");

createRoot(container).render(
    <StrictMode>
        {/* Outside the providers on purpose: it is the net for them too. */}
        <ErrorBoundary>
            <ThemeProvider>
                <I18nProvider>
                    <StudioApp />
                </I18nProvider>
            </ThemeProvider>
        </ErrorBoundary>
    </StrictMode>,
);
