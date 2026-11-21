import { useState } from "react";
import { SiteHeader, StatusChip, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status } from "../content.js";

// B (Source et rendu) : le fichier MDX à gauche, la page rendue à droite.
// Survoler un bloc rendu surligne les lignes du fichier qui le produisent.
const source = [
  { id: "meta", t: "---" },
  { id: "meta", t: "title: Éditez votre portfolio en MDX" },
  { id: "meta", t: "etat: brouillon" },
  { id: "meta", t: "---" },
  { id: "hook", t: "" },
  { id: "hook", t: `# ${hook}` },
  { id: "hook", t: "" },
  { id: "hook", t: "portfolio-cms est un éditeur web pour" },
  { id: "hook", t: "les fichiers MDX de votre dépôt GitHub." },
  { id: "steps", t: "" },
  { id: "steps", t: "## Trois étapes" },
  { id: "steps", t: "1. Connectez votre dépôt GitHub" },
  { id: "steps", t: "2. Éditez" },
  { id: "steps", t: "3. Ouvrez une pull request" },
  { id: "principles", t: "" },
  { id: "principles", t: "## Principes" },
  { id: "principles", t: "- Du MDX dans votre dépôt" },
  { id: "principles", t: "- Aucune base de données" },
  { id: "principles", t: "- Jamais d'écriture sur main ni develop" },
  { id: "principles", t: "- Dépôts privés pris en charge" },
  { id: "principles", t: "- Licence MIT" },
  { id: "status", t: "" },
  { id: "status", t: "## En construction" },
];

function Block({ id, active, setActive, children, className = "" }) {
  return (
    <section
      onMouseEnter={() => setActive(id)}
      onFocus={() => setActive(id)}
      onMouseLeave={() => setActive(null)}
      onBlur={() => setActive(null)}
      className={`-mx-3 rounded-lg px-3 py-3 transition-colors duration-200 ${active === id ? "bg-accent/60" : ""} ${className}`}
    >
      {children}
    </section>
  );
}

export function VariantB() {
  const [active, setActive] = useState(null);
  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader />
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-5 pt-8 sm:pt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-16 xl:grid-cols-[minmax(0,1fr)_26rem]">
        <div>
          <Block id="hook" active={active} setActive={setActive}>
            <h1 className="rise font-serif text-[2.5rem] leading-[1.05] tracking-[-0.02em] sm:text-6xl">{hook}</h1>
            <p className="mt-6 max-w-[34rem] text-xl text-muted-foreground">{lead}</p>
          </Block>

          <Block id="steps" active={active} setActive={setActive} className="mt-12">
            <h2 className="font-serif text-3xl">Trois étapes</h2>
            <ol className="mt-5 space-y-4">
              {steps.map((s, i) => (
                <li key={s.title} className="flex gap-4">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full border border-primary/50 text-sm font-medium text-primary">
                    {i + 1}
                  </span>
                  <p>
                    <strong className="font-semibold">{s.title}.</strong>{" "}
                    <span className="text-muted-foreground">{s.body}</span>
                  </p>
                </li>
              ))}
            </ol>
          </Block>

          <Block id="principles" active={active} setActive={setActive} className="mt-10">
            <h2 className="font-serif text-3xl">Principes</h2>
            <ul className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {principles.map((p) => (
                <li key={p.t}>
                  <p className="font-semibold">{p.t}</p>
                  <p className="text-muted-foreground">{p.d}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block id="status" active={active} setActive={setActive} className="mt-10">
            <StatusChip />
            <h2 className="mt-3 font-serif text-3xl">{status.title}</h2>
            <p className="mt-2 max-w-prose text-muted-foreground">{status.body}</p>
            <ExternalLinks className="mt-4" />
          </Block>
        </div>

        <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start" aria-label="Exemple de fichier MDX">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 text-sm text-muted-foreground">
              <span className="font-mono">exemple.mdx</span>
            </div>
            <pre className="overflow-x-auto py-3 font-mono text-[12px] leading-6" tabIndex={0}>
              {source.map((l, i) => (
                <div
                  key={i}
                  className={`px-4 transition-colors duration-200 ${active === l.id ? "bg-accent text-accent-foreground" : "text-card-foreground"} ${l.id === "meta" ? "text-muted-foreground" : ""}`}
                >
                  {l.t || " "}
                </div>
              ))}
            </pre>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Un fichier d'exemple, tel que le CMS le lit et le réécrit. Ce n'est pas une capture du produit.
          </p>
        </aside>
      </main>
    </div>
  );
}
