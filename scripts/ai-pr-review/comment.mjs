import { sanitizeForComment } from "./redact.mjs";
import { getStrings } from "./strings.mjs";

export const MARKER = "<!-- ai-pr-review-agent -->";
const ICON = { low: "🟢", medium: "🟡", high: "🟠", critical: "🔴" };

const cell = (s) => s.replace(/\|/g, "\|").replace(/\r?\n/g, " ");

/**
 * @param {object} review validated review
 * @param {{ truncated?: { sent: number, total: number }, language?: string }} [meta]
 * @returns {{ body: string, redactions: number }}
 */
export function renderComment(review, meta = {}) {
  const t = getStrings(meta.language);
  let redactions = 0;
  const clean = (s) => {
    const r = sanitizeForComment(s);
    redactions += r.count;
    return r.text;
  };
  const risks = review.risks.length
    ? `| ${t.colSeverity} | ${t.colLocation} | ${t.colWhy} |\n|---|---|---|\n` +
      review.risks.map((r) => `| ${ICON[r.severity]} ${r.severity} | \`${clean(r.file).replace(/`/g, "")}${r.line ? `:${r.line}` : ""}\` | ${cell(clean(r.why))} |`).join("\n")
    : t.noRisk;
  const body = [
    MARKER,
    `## ${t.title}`,
    `${t.confidence}${t.colon}**${Math.round(review.confidence * 100)}%**`,
    review.needs_human_arbitration ? `> ${t.arbitration}` : "",
    `### ${t.risks}`,
    risks,
    `### ${t.proposedFix}`,
    clean(review.proposed_fix),
    `### ${t.checks}`,
    clean(review.checks_summary),
    meta.truncated ? `_${t.truncated(meta.truncated.sent, meta.truncated.total)}_` : "",
    "---",
    t.footer,
  ].filter((x) => x !== "").join("\n\n");
  return { body, redactions };
}

export function renderFailureComment(reason, language) {
  const t = getStrings(language);
  return [MARKER, `## ${t.title}`, t.failure(sanitizeForComment(reason).text), "---", t.footer].join("\n\n");
}
