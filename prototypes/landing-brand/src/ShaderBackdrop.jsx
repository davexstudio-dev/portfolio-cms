import { useEffect, useState } from "react";
import { GrainGradient, PerlinNoise } from "@paper-design/shaders-react";

// Composant maison (ADR 0014) : fond en shader discret, basé sur @paper-design/shaders-react (Apache-2.0).
// Les couleurs du shader sont des valeurs hexadécimales proches des jetons de la marque
// (le shader n'accepte pas les variables CSS). Elles doivent rester dans ce fichier, à un seul endroit.
const PALETTES = {
  light: {
    back: "#fbfaf6", // ≈ --background
    colors: ["#bfe3cf", "#dcebd9", "#f1e7c4"], // émeraude très atténué, avec une pointe de neutre chaud
    fog: "#ffffff", // brouillard clair : il éclaircit le fond, donc il ne baisse jamais le contraste du texte
  },
  dark: {
    back: "#161512", // ≈ --background (sombre)
    colors: ["#1f4332", "#1b3328", "#35311f"],
    fog: "#284838", // brouillard vert sombre, plus foncé que le texte discret (#b4b2ab)
  },
};

function useIsDark() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));
  useEffect(() => {
    const el = document.documentElement;
    const obs = new MutationObserver(() => setDark(el.classList.contains("dark")));
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return dark;
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

export function ShaderBackdrop({ className = "" }) {
  const dark = useIsDark();
  const reduced = useReducedMotion();
  const p = dark ? PALETTES.dark : PALETTES.light;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)] ${className}`}
    >
      <GrainGradient
        className="absolute inset-0"
        style={{ width: "100%", height: "100%" }}
        colorBack={p.back}
        colors={p.colors}
        shape="wave"
        softness={1}
        intensity={0.6}
        noise={0.18}
        speed={reduced ? 0 : 0.12}
        frame={reduced ? 4000 : undefined}
        scale={1.4}
      />
      <PerlinNoise
        className="absolute inset-0"
        style={{ width: "100%", height: "100%", opacity: dark ? 0.55 : 0.7, filter: "blur(18px)" }}
        colorBack="#00000000"
        colorFront={p.fog}
        proportion={0.42}
        softness={1}
        octaveCount={4}
        persistence={0.55}
        lacunarity={2}
        scale={0.9}
        speed={reduced ? 0 : 0.05}
        frame={reduced ? 9000 : undefined}
      />
    </div>
  );
}
