import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { VariantA } from "./variants/A.jsx";
import { VariantB } from "./variants/B.jsx";
import { VariantC } from "./variants/C.jsx";
import { VariantD } from "./variants/D.jsx";
import { VariantE } from "./variants/E.jsx";
import { VariantF } from "./variants/F.jsx";

// PROTOTYPE jetable : cinq variantes de la landing, commutables via ?variant=A..E.
const VARIANTS = [
  { key: "A", name: "Texte suivi", C: VariantA },
  { key: "B", name: "Source et rendu", C: VariantB },
  { key: "C", name: "Journal git", C: VariantC },
  { key: "D", name: "Commande d'abord", C: VariantD },
  { key: "E", name: "Schéma", C: VariantE },
  { key: "F", name: "Retenue : E + B + A", C: VariantF },
];

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.documentElement.classList.add("dark");
}

function initial() {
  const v = new URLSearchParams(location.search).get("variant")?.toUpperCase();
  const i = VARIANTS.findIndex((x) => x.key === v);
  return i < 0 ? 0 : i;
}

function App() {
  const [i, setI] = useState(initial);
  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set("variant", VARIANTS[i].key);
    history.replaceState(null, "", u);
  }, [i]);
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowRight") setI((x) => (x + 1) % VARIANTS.length);
      if (e.key === "ArrowLeft") setI((x) => (x + VARIANTS.length - 1) % VARIANTS.length);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);
  const { C, key, name } = VARIANTS[i];
  return (
    <>
      <C key={key} />
      <div className="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-card/95 p-1 text-sm shadow-[0_6px_24px_-8px_rgb(0_0_0/0.25)] backdrop-blur">
        <button
          className="grid size-11 place-items-center rounded-full hover:bg-muted"
          aria-label="Variante précédente"
          onClick={() => setI((x) => (x + VARIANTS.length - 1) % VARIANTS.length)}
        >
          ←
        </button>
        <span className="min-w-44 px-2 text-center font-medium">
          {key} ({name})
        </span>
        <button
          className="grid size-11 place-items-center rounded-full hover:bg-muted"
          aria-label="Variante suivante"
          onClick={() => setI((x) => (x + 1) % VARIANTS.length)}
        >
          →
        </button>
      </div>
    </>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
