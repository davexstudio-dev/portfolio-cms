import { SiteHeader, StatusChip, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status } from "../content.js";

// E (Schéma) : une ligne de stations. La branche de travail part de develop et y revient par une pull request ;
// main et develop ne sont jamais traversées par le CMS.
const X = [320, 580, 840];

function Wrap({ x, y, lines, className, anchor = "start" }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className={className}>
      {lines.map((l, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : 23}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

const split = {
  0: [["Connectez votre", "dépôt GitHub"], ["Installez la GitHub App :", "elle ne demande que le", "contenu et les pull requests."]],
  1: [["Éditez"], ["Ouvrez un article ou un tutoriel,", "modifiez le frontmatter et le", "texte, avec l'aperçu en direct."]],
  2: [["Ouvrez une", "pull request"], ["Un commit sur la branche de", "travail, puis une pull request", "vers develop."]],
};

export function VariantE() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-5 pt-12 sm:pt-20">
        <h1 className="rise max-w-[18ch] font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-[4.5rem]">{hook}</h1>
        <p className="mt-6 max-w-[38rem] text-xl text-muted-foreground">{lead}</p>

        {/* Grand écran : schéma */}
        <figure className="mt-14 hidden xl:block" aria-label="Schéma : la branche de travail part de develop et y revient par une pull request">
          <svg viewBox="0 125 1100 335" className="w-full" role="img" aria-labelledby="e-title">
            <title id="e-title">Trois étapes sur une branche de travail, entre develop et la pull request</title>
            {/* branches protégées */}
            <g className="stroke-border" strokeWidth="2">
              <line x1="40" y1="395" x2="1060" y2="395" />
              <line x1="40" y1="440" x2="1060" y2="440" />
            </g>
            <text x="40" y="382" className="fill-muted-foreground font-mono text-[14px]">develop</text>
            <text x="40" y="427" className="fill-muted-foreground font-mono text-[14px]">main</text>
            <text x="250" y="382" className="fill-muted-foreground text-[15px]">
              Le CMS n'écrit jamais directement sur develop ni sur main.
            </text>

            {/* branche de travail */}
            <path d="M110 395 C110 290 130 215 190 215" className="fill-none stroke-primary" strokeWidth="2.5" />
            <line x1="190" y1="215" x2="1000" y2="215" className="stroke-primary" strokeWidth="2.5" />
            <path d="M1000 215 C1040 215 1040 300 1040 395" className="fill-none stroke-primary" strokeWidth="2.5" />
            <circle cx="1040" cy="395" r="7" className="fill-primary" />
            <text x="1060" y="424" textAnchor="end" className="fill-muted-foreground text-[14px]">
              fusion par vous, sur GitHub
            </text>

            {X.map((x, i) => (
              <g key={x}>
                <circle cx={x} cy="215" r="17" className="fill-primary" />
                <text x={x} y="221" textAnchor="middle" className="fill-primary-foreground text-[16px] font-semibold">
                  {i + 1}
                </text>
                <Wrap x={x} y={150} anchor="middle" lines={split[i][0]} className="fill-foreground font-serif text-[22px]" />
                <Wrap x={x} y={255} anchor="middle" lines={split[i][1]} className="fill-muted-foreground text-[15px]" />
              </g>
            ))}
          </svg>
        </figure>

        {/* Petit écran : la même ligne, à la verticale */}
        <ol className="relative mt-12 space-y-10 xl:hidden">
          <span aria-hidden className="absolute bottom-3 left-[1.05rem] top-3 w-px bg-primary" />
          {steps.map((s, i) => (
            <li key={s.title} className="relative grid grid-cols-[2.25rem_1fr] gap-x-4">
              <span className="relative z-10 grid size-[2.1rem] place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="font-serif text-2xl leading-snug">{s.title}</h2>
                <p className="mt-1 text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="mt-14 sm:mt-20" aria-labelledby="e-principles">
          <h2 id="e-principles" className="font-serif text-3xl">
            Les cinq principes
          </h2>
          <ul className="mt-6 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x">
            {principles.map((p) => (
              <li key={p.t} className="py-5 lg:px-5 lg:first:pl-0 lg:last:pr-0">
                <p className="font-semibold leading-snug">{p.t}</p>
                <p className="mt-1.5 text-[0.95rem] text-muted-foreground">{p.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-14 sm:mt-20" aria-labelledby="e-status">
          <div className="max-w-[40rem] rounded-xl border border-dashed border-status-construction/70 p-6">
            <StatusChip />
            <h2 id="e-status" className="mt-3 font-serif text-3xl">
              {status.title}
            </h2>
            <p className="mt-2 text-muted-foreground">{status.body}</p>
            <ExternalLinks className="mt-4" />
          </div>
        </section>
      </main>
    </div>
  );
}
