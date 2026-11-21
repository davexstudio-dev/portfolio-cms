import { useId, useState } from "react";
import { SiteHeader, StatusChip, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status } from "../content.js";

// D (Commande d'abord) : une palette en point d'entrée ; le contenu s'affiche à la demande.
const items = [
  {
    id: "what",
    label: "Comprendre ce que c'est",
    panel: () => (
      <>
        <h2 className="font-serif text-3xl leading-tight">Un éditeur web pour vos fichiers MDX</h2>
        <p className="mt-3 text-muted-foreground">{lead}</p>
        <p className="mt-3 text-muted-foreground">Votre contenu reste dans votre dépôt, en MDX. Aucune base de données.</p>
      </>
    ),
  },
  {
    id: "steps",
    label: "Voir les trois étapes",
    panel: () => (
      <>
        <h2 className="font-serif text-3xl leading-tight">Trois étapes</h2>
        <ol className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[1.75rem_1fr] gap-3">
              <span className="font-serif text-2xl italic leading-none text-primary">{i + 1}</span>
              <p>
                <strong className="font-semibold">{s.title}.</strong>{" "}
                <span className="text-muted-foreground">{s.body}</span>
              </p>
            </li>
          ))}
        </ol>
      </>
    ),
  },
  {
    id: "principles",
    label: "Lire les principes",
    panel: () => (
      <>
        <h2 className="font-serif text-3xl leading-tight">Cinq principes</h2>
        <ul className="mt-4 space-y-3">
          {principles.map((p) => (
            <li key={p.t}>
              <p className="font-semibold">{p.t}</p>
              <p className="text-muted-foreground">{p.d}</p>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "status",
    label: "Savoir où en est le projet",
    panel: () => (
      <>
        <StatusChip />
        <h2 className="mt-3 font-serif text-3xl leading-tight">{status.title}</h2>
        <p className="mt-3 text-muted-foreground">{status.body}</p>
        <ExternalLinks className="mt-4" />
      </>
    ),
  },
];

export function VariantD() {
  const [sel, setSel] = useState(0);
  const [q, setQ] = useState("");
  const listId = useId();
  const shown = items.filter((i) => i.label.toLowerCase().includes(q.trim().toLowerCase()));
  const current = shown[Math.min(sel, shown.length - 1)];

  const onKey = (e) => {
    if (!shown.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSel((s) => (s + 1) % shown.length);
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSel((s) => (s + shown.length - 1) % shown.length);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader width="max-w-5xl" />
      <main className="mx-auto w-full max-w-4xl px-5 pt-12 sm:pt-20">
        <h1 className="rise mx-auto max-w-[16ch] text-center font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-[4.5rem]">
          {hook}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-center text-lg text-muted-foreground">
          Posez votre question, ou parcourez la liste.
        </p>

        <div className="mt-10 overflow-hidden rounded-xl border border-border bg-card shadow-[0_18px_40px_-24px_rgb(0_0_0/0.35)]">
          <div className="flex items-center gap-3 border-b border-border px-4">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="shrink-0 text-muted-foreground" aria-hidden="true">
              <circle cx="8" cy="8" r="5.25" />
              <path d="M12 12l4 4" />
            </svg>
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setSel(0);
              }}
              onKeyDown={onKey}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-label="Que voulez-vous savoir ?"
              placeholder="Que voulez-vous savoir ?"
              className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
            <kbd className="hidden shrink-0 rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:block">↑ ↓</kbd>
          </div>

          <div className="grid md:grid-cols-[17rem_1fr]">
            <ul id={listId} role="listbox" aria-label="Sujets" className="border-b border-border p-2 md:border-b-0 md:border-r">
              {shown.map((it, i) => {
                const on = current && it.id === current.id;
                return (
                  <li key={it.id} role="option" aria-selected={on}>
                    <button
                      type="button"
                      onClick={() => setSel(i)}
                      className={`flex min-h-11 w-full items-center rounded-md px-3 py-2 text-left transition-colors ${on ? "bg-accent text-accent-foreground" : "hover:bg-muted"}`}
                    >
                      {it.label}
                    </button>
                  </li>
                );
              })}
              {!shown.length && <li className="px-3 py-3 text-muted-foreground">Aucun résultat. Effacez la recherche.</li>}
            </ul>
            <div className="min-h-[19rem] p-6 sm:p-8" aria-live="polite" key={current?.id}>
              {current ? <div className="rise">{current.panel()}</div> : null}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
