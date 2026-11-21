import { useState } from "react";
import { ShaderBackdrop } from "../ShaderBackdrop.jsx";
import { SiteHeader, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status, links } from "../content.js";

// F (Retenue) : schéma de E, panneau de fichier de B, fond éditorial de A.
const X = [320, 580, 840];
const split = [
  [["Connectez votre", "dépôt GitHub"], ["Installez la GitHub App :", "elle ne demande que le", "contenu et les pull requests."]],
  [["Éditez"], ["Ouvrez un article ou un tutoriel,", "modifiez le frontmatter et le", "texte, avec l'aperçu en direct."]],
  [["Ouvrez une", "pull request"], ["Un commit sur la branche de", "travail, puis une pull request", "vers develop."]],
];

function Wrap({ x, y, lines, className }) {
  return (
    <text x={x} y={y} textAnchor="middle" className={className}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 23}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

const source = [
  { id: "meta", t: "---" },
  { id: "meta", t: "title: Éditez votre portfolio en MDX" },
  { id: "meta", t: "etat: brouillon" },
  { id: "meta", t: "---" },
  { id: "meta", t: "" },
  { id: "meta", t: "# Éditez votre portfolio en MDX," },
  { id: "meta", t: "  sans quitter Git." },
  { id: "meta", t: "" },
  { id: "meta", t: "## Principes" },
  ...principles.map((p, i) => ({ id: `p${i}`, t: `- ${p.t}` })),
];

export function VariantF() {
  const [active, setActive] = useState(null);
  return (
    <div className="relative isolate min-h-screen bg-background pb-32">
      <ShaderBackdrop className="h-[46rem]" />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pt-12 sm:pt-20">
        <h1 className="rise max-w-[18ch] font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-[4.5rem]">{hook}</h1>
        <p className="mt-6 max-w-[38rem] text-xl leading-[1.55] text-muted-foreground">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={links.repo}
            className="inline-flex min-h-12 items-center rounded-lg bg-primary px-6 font-medium text-primary-foreground no-underline transition-[background-color,transform] duration-150 hover:bg-primary/90 active:translate-y-px"
          >
            Suivre le projet sur GitHub
          </a>
          <a
            href={links.docs}
            className="inline-flex min-h-12 items-center rounded-lg border border-input px-6 font-medium text-foreground no-underline transition-[background-color,transform] duration-150 hover:bg-muted active:translate-y-px"
          >
            Lire la documentation
          </a>
        </div>

        <figure className="mt-14 hidden xl:block" aria-label="Schéma : la branche de travail part de develop et y revient par une pull request">
          <svg viewBox="0 125 1100 335" className="w-full" role="img" aria-labelledby="f-title">
            <title id="f-title">Trois étapes sur une branche de travail, entre develop et la pull request</title>
            <g className="stroke-border" strokeWidth="2">
              <line x1="40" y1="395" x2="1060" y2="395" />
              <line x1="40" y1="440" x2="1060" y2="440" />
            </g>
            <text x="40" y="382" className="fill-muted-foreground font-mono text-[14px]">develop</text>
            <text x="40" y="427" className="fill-muted-foreground font-mono text-[14px]">main</text>
            <text x="250" y="378" className="fill-foreground text-[17px] font-medium">
              Le CMS n'écrit jamais directement sur develop ni sur main.
            </text>
            <path d="M110 395 C110 290 130 215 190 215" className="fill-none stroke-primary" strokeWidth="2.5" />
            <line x1="190" y1="215" x2="1000" y2="215" className="stroke-primary" strokeWidth="2.5" />
            <path d="M1000 215 C1040 215 1040 300 1040 395" className="fill-none stroke-primary" strokeWidth="2.5" />
            <circle cx="1040" cy="395" r="7" className="fill-primary" />
            <text x="1060" y="424" textAnchor="end" className="fill-muted-foreground text-[14px]">fusion par vous, sur GitHub</text>
            {X.map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="215" r="17" className="fill-primary" />
                <text x={x} y="221" textAnchor="middle" className="fill-primary-foreground text-[16px] font-semibold">{i + 1}</text>
                <Wrap x={x} y={150} lines={split[i][0]} className="fill-foreground font-serif text-[22px]" />
                <Wrap x={x} y={255} lines={split[i][1]} className="fill-muted-foreground text-[16px]" />
              </g>
            ))}
          </svg>
        </figure>

        <ol className="relative mt-12 space-y-10 xl:hidden">
          <span aria-hidden className="absolute bottom-3 left-[1.05rem] top-3 w-px bg-primary" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.25rem_1fr] gap-x-4">
              <span className="relative z-10 grid size-[2.1rem] place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
              <div>
                <h2 className="font-serif text-2xl leading-snug">{s.title}</h2>
                <p className="mt-1 text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:mt-28 lg:grid-cols-[minmax(0,1fr)_24rem] lg:gap-16">
          <section aria-labelledby="f-principles">
            <h2 id="f-principles" className="font-serif text-3xl tracking-[-0.01em]">Nos principes</h2>
            <dl className="mt-8 divide-y divide-border border-y border-border">
              {principles.map((p, i) => (
                <div
                  key={p.t}
                  tabIndex={0}
                  onMouseEnter={() => setActive(`p${i}`)}
                  onFocus={() => setActive(`p${i}`)}
                  onMouseLeave={() => setActive(null)}
                  onBlur={() => setActive(null)}
                  className={`grid gap-1 px-2 py-5 transition-colors duration-200 sm:grid-cols-[14rem_1fr] sm:gap-8 ${active === `p${i}` ? "bg-accent/60" : ""}`}
                >
                  <dt className="font-serif text-xl italic">{p.t}</dt>
                  <dd className="text-muted-foreground">{p.d}</dd>
                </div>
              ))}
            </dl>
          </section>

          <aside className="min-w-0 lg:sticky lg:top-8 lg:self-start" aria-label="Exemple de fichier MDX">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <div className="border-b border-border px-4 py-2.5 font-mono text-sm text-muted-foreground">exemple.mdx</div>
              <pre className="overflow-x-auto py-3 font-mono text-[12px] leading-6" tabIndex={0}>
                {source.map((l, i) => (
                  <div
                    key={i}
                    className={`px-4 transition-colors duration-200 ${active === l.id ? "bg-accent text-accent-foreground" : l.id === "meta" ? "text-muted-foreground" : "text-card-foreground"}`}
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
        </div>

        <section className="mt-20 sm:mt-28" aria-labelledby="f-status">
          <h2 id="f-status" className="font-serif text-3xl tracking-[-0.01em]">{status.title}</h2>
          <p className="mt-3 max-w-prose text-muted-foreground">{status.body}</p>
          <ExternalLinks className="mt-4 text-lg" />
        </section>

        <footer className="mt-24 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border pt-6 text-[0.95rem] text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">portfolio-cms</span> · Licence MIT · Davex Studio Development
          </p>
          <p>
            <a className="inline-flex min-h-11 items-center underline decoration-border hover:text-primary hover:decoration-primary" href={links.repo}>Code source</a>
          </p>
        </footer>
      </main>
    </div>
  );
}
