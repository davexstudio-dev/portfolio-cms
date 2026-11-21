import { SiteHeader, StatusChip, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status } from "../content.js";

// A (Texte suivi) : un essai en une colonne. Rien d'autre que de la typographie.
export function VariantA() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader width="max-w-5xl" />
      <main className="mx-auto w-full max-w-[42rem] px-5 pt-14 sm:pt-24">
        <h1 className="rise font-serif text-[2.6rem] font-normal leading-[1.04] tracking-[-0.02em] sm:text-[4.25rem]">
          {hook}
        </h1>
        <p className="rise mt-8 text-[1.3rem] leading-[1.55] text-muted-foreground [animation-delay:80ms]">
          {lead}
        </p>

        <section className="mt-20 sm:mt-28" aria-labelledby="a-steps">
          <h2 id="a-steps" className="font-serif text-3xl tracking-[-0.01em]">
            Comment cela se passe
          </h2>
          <ol className="mt-8 space-y-9">
            {steps.map((s, i) => (
              <li key={s.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 sm:grid-cols-[3rem_1fr]">
                <span className="font-serif text-[2.25rem] italic leading-none text-primary sm:text-5xl">{i + 1}</span>
                <div>
                  <h3 className="font-serif text-2xl leading-snug">{s.title}</h3>
                  <p className="mt-1.5 text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-20 sm:mt-28" aria-labelledby="a-principles">
          <h2 id="a-principles" className="font-serif text-3xl tracking-[-0.01em]">
            Ce que nous ne ferons pas
          </h2>
          <p className="mt-3 text-muted-foreground">Cinq principes, que le projet s'impose à lui-même.</p>
          <dl className="mt-8 divide-y divide-border border-y border-border">
            {principles.map((p) => (
              <div key={p.t} className="grid gap-1 py-5 sm:grid-cols-[15rem_1fr] sm:gap-8">
                <dt className="font-serif text-xl italic">{p.t}</dt>
                <dd className="text-muted-foreground">{p.d}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-20 sm:mt-28" aria-labelledby="a-status">
          <StatusChip />
          <h2 id="a-status" className="mt-4 font-serif text-3xl tracking-[-0.01em]">
            {status.title}
          </h2>
          <p className="mt-3 max-w-prose text-muted-foreground">{status.body}</p>
          <ExternalLinks className="mt-6 text-lg" />
        </section>
      </main>
    </div>
  );
}
