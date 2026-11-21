import { useEffect, useState } from "react";
import { links } from "./content.js";

export function Logo({ className = "" }) {
  return (
    <span className={`font-sans font-medium tracking-tight ${className}`}>
      portfolio<span className="mx-[0.03em] font-bold text-primary">-</span>cms
    </span>
  );
}

export function StatusChip({ className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-status-construction-bg px-3 py-1 text-sm font-medium text-status-construction ${className}`}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2.2" />
        <path d="M7 1.5a5.5 5.5 0 0 1 0 11z" fill="currentColor" />
      </svg>
      en construction
    </span>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);
  return (
    <button
      type="button"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Passer au thème clair" : "Passer au thème sombre"}
      className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {dark ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <circle cx="10" cy="10" r="3.5" />
          <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.3 4.3l1.4 1.4M14.3 14.3l1.4 1.4M4.3 15.7l1.4-1.4M14.3 5.7l1.4-1.4" />
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
          <path d="M16.5 11.5A6.5 6.5 0 0 1 8.5 3.5a6.5 6.5 0 1 0 8 8z" />
        </svg>
      )}
    </button>
  );
}

export function SiteHeader({ width = "max-w-6xl" }) {
  return (
    <header className={`mx-auto flex w-full ${width} flex-wrap items-center gap-x-5 gap-y-1 px-5 py-4`}>
      <a href="/" className="inline-flex min-h-11 items-center text-lg no-underline">
        <Logo />
      </a>
      <StatusChip className="order-last sm:order-none" />
      <nav className="ml-auto flex items-center gap-1 text-[0.95rem]">
        <a href={links.docs} className="rounded-full px-3 py-2.5 text-muted-foreground no-underline hover:text-foreground">
          Documentation
        </a>
        <a href={links.repo} className="rounded-full px-3 py-2.5 text-muted-foreground no-underline hover:text-foreground">
          GitHub
        </a>
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function ExternalLinks({ className = "" }) {
  const base =
    "inline-flex min-h-11 items-center underline decoration-border hover:decoration-primary hover:text-primary";
  return (
    <p className={`flex flex-wrap items-center gap-x-5 ${className}`}>
      <a className={base} href={links.repo}>Dépôt GitHub</a>
      <a className={base} href={links.issues}>Tickets</a>
      <a className={base} href={links.docs}>Documentation</a>
    </p>
  );
}
