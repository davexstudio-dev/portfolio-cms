// Language of the review. Set REVIEW_LANGUAGE ("French" default, or "English") without touching code.
export function resolveLanguage(value = process.env.REVIEW_LANGUAGE) {
  const v = String(value ?? "").trim().toLowerCase();
  return v === "english" || v === "en" ? "English" : "French";
}

const STRINGS = {
  French: {
    title: "🤖 Revue automatique",
    confidence: "Confiance",
    colon: " : ",
    arbitration: "⚖️ **Décision humaine requise** : au moins un point relève d'un choix produit.",
    risks: "Risques",
    colSeverity: "Gravité",
    colLocation: "Emplacement",
    colWhy: "Pourquoi",
    noRisk: "Aucun risque relevé.",
    proposedFix: "Correctif proposé",
    checks: "Résumé des vérifications",
    truncated: (sent, total) => `Diff tronqué à ${sent} caractères sur ${total} : une partie du changement n'a pas été relue.`,
    failure: (reason) => `L'agent n'a pas produit de revue valide (${reason}). Aucune analyse n'est disponible pour ce commit.`,
    footer: "_Une personne doit valider cette revue avant tout changement. Cet agent est consultatif : il ne peut ni fusionner, ni pousser, ni déployer._",
  },
  English: {
    title: "🤖 AI review",
    confidence: "Confidence",
    colon: ": ",
    arbitration: "⚖️ **Needs human arbitration**: at least one point is a product-level decision.",
    risks: "Risks",
    colSeverity: "Severity",
    colLocation: "Location",
    colWhy: "Why",
    noRisk: "No risk found.",
    proposedFix: "Proposed fix",
    checks: "Checks summary",
    truncated: (sent, total) => `Diff truncated to ${sent} of ${total} chars: part of the change was not reviewed.`,
    failure: (reason) => `The agent could not produce a valid review (${reason}). No analysis is available for this commit.`,
    footer: "_A human must validate this review before any change is made. This agent is advisory only: it cannot merge, push or deploy._",
  },
};

export function getStrings(language) {
  return STRINGS[resolveLanguage(language)];
}
