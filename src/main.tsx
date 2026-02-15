import React from "react";
// App entry point
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Apply theme before React renders to prevent flash
(() => {
  const mode = localStorage.getItem("theme-mode") || "dark";
  const isDark =
    mode === "dark" || (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.add(isDark ? "dark" : "light");
})();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
