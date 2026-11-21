import { SiteHeader, StatusChip, ExternalLinks } from "../shared.jsx";
import { hook, lead, steps, principles, status } from "../content.js";

// C (Journal git) : la page se lit comme un historique, de haut en bas, le long d'un fil de branches.
function Node({ kind }) {
  const base = "relative z-10 mt-[0.45rem] size-[0.95rem] rounded-full";
  if (kind === "filled") return <span className={`${base} bg-primary`} />;
  if (kind === "ring") return <span className={`${base} border-2 border-primary bg-background`} />;
  return <span className={`${base} border-2 border-dashed border-status-construction bg-background`} />;
}

function Entry({ kind, last, children }) {
  return (
    <li className="relative grid grid-cols-[2.25rem_1fr] gap-x-3 pb-12 last:pb-0 sm:grid-cols-[3rem_1fr] sm:gap-x-5">
      {!last && <span aria-hidden className="absolute bottom-0 left-[0.45rem] top-[1.4rem] w-px bg-border sm:left-[0.45rem]" />}
      <Node kind={kind} />
      <div>{children}</div>
    </li>
  );
}

export function VariantC() {
  return (
    <div className="min-h-screen bg-background pb-32">
      <SiteHeader width="max-w-4xl" />
      <main className="mx-auto w-full max-w-4xl px-5 pt-12 sm:pt-20">
        <h1 className="rise max-w-[17ch] font-serif text-[2.6rem] leading-[1.04] tracking-[-0.02em] sm:text-[4.5rem]">{hook}</h1>
        <p className="mt-7 max-w-[36rem] text-xl text-muted-foreground">{lead}</p>
        <p className="mt-6 font-mono text-sm text-muted-foreground">
          <span className="text-foreground">main</span> ← <span className="text-foreground">develop</span> ←{" "}
          <span className="text-primary">travail/mon-article</span>
        </p>

        <ol className="mt-16 sm:mt-24">
          {steps.map((s, i) => (
            <Entry key={s.title} kind="filled">
              <h2 className="font-serif text-[1.75rem] leading-snug sm:text-3xl">{s.title}</h2>
              <p className="mt-2 max-w-[34rem] text-muted-foreground">{s.body}</p>
              {i === 2 && (
                <p className="mt-3 inline-block rounded-md bg-accent px-2.5 py-1 font-mono text-sm text-accent-foreground">
                  travail/mon-article → develop
                </p>
              )}
            </Entry>
          ))}

          <Entry kind="ring">
            <h2 className="font-serif text-[1.75rem] leading-snug sm:text-3xl">Ce que cela garantit</h2>
            <ul className="mt-4 max-w-[38rem] space-y-4">
              {principles.map((p) => (
                <li key={p.t}>
                  <p className="font-semibold">{p.t}</p>
                  <p className="text-muted-foreground">{p.d}</p>
                </li>
              ))}
            </ul>
          </Entry>

          <Entry kind="dashed" last>
            <StatusChip />
            <h2 className="mt-3 font-serif text-[1.75rem] leading-snug sm:text-3xl">{status.title}</h2>
            <p className="mt-2 max-w-[34rem] text-muted-foreground">{status.body}</p>
            <ExternalLinks className="mt-4" />
          </Entry>
        </ol>
      </main>
    </div>
  );
}
