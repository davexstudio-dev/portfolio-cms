import { sanitizeForComment } from "./redact.mjs";

export const MARKER = "<!-- ai-pr-review-agent -->";
const FOOTER = "_A human must validate this review before any change is made. This agent is advisory only: it cannot merge, push or deploy._";
const ICON = { low: "🟢", medium: "🟡", high: "🟠", critical: "🔴" };

const cell = (s) => s.replace(/\|/g, "\\|").replace(/\r?\n/g, " ");

/** @returns {{ body: string, redactions: number }} */
export function renderComment(review, meta = {}) {
  let redactions = 0;
  const clean = (s) => {
    const r = sanitizeForComment(s);
    redactions += r.count;
    return r.text;
  };
  const risks = review.risks.length
    ? "| Severity | Location | Why |\n|---|---|---|\n" +
      review.risks.map((r) => `| ${ICON[r.severity]} ${r.severity} | \`${clean(r.file).replace(/`/g, "")}${r.line ? `:${r.line}` : ""}\` | ${cell(clean(r.why))} |`).join("\n")
    : "No risk found.";
  const arbitration = review.needs_human_arbitration ? "\n> ⚖️ **Needs human arbitration**: at least one point is a product-level decision.\n" : "";
  const body = [
    MARKER,
    "## 🤖 AI review",
    `Confidence: **${Math.round(review.confidence * 100)}%**${arbitration ? "" : ""}`,
    arbitration,
    "### Risks",
    risks,
    "### Proposed fix",
    clean(review.proposed_fix),
    "### Checks summary",
    clean(review.checks_summary),
    meta.note ? `\n_${clean(meta.note)}_` : "",
    "---",
    FOOTER,
  ].filter((x) => x !== "").join("\n\n");
  return { body, redactions };
}

export function renderFailureComment(reason) {
  return [
    MARKER,
    "## 🤖 AI review",
    `The agent could not produce a valid review (${sanitizeForComment(reason).text}). No analysis is available for this commit.`,
    "---",
    FOOTER,
  ].join("\n\n");
}
