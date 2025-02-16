import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Performance monitoring in development
if (process.env.NODE_ENV === 'development') {
  const reportWebVitals = async () => {
    const { onCLS, onFID, onFCP, onTTFB, onLCP } = await import('web-vitals');
    onCLS(console.log);
    onFID(console.log);
    onFCP(console.log);
    onLCP(console.log);
    onTTFB(console.log);
  };
  reportWebVitals();
}

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);