// Guardrail: anything that looks like a secret is replaced before it can reach a public PR comment.
// Also neutralises @mentions so the bot can never ping people.

export const REDACTED = "[REDACTED]";

const PATTERNS = [
  /sk-ant-[A-Za-z0-9_-]{10,}/g, // Anthropic keys
  /sk-[A-Za-z0-9]{20,}/g, // generic "sk-" keys
  /gh[pousr]_[A-Za-z0-9]{20,}/g, // GitHub tokens
  /github_pat_[A-Za-z0-9_]{20,}/g,
  /AKIA[0-9A-Z]{16}/g, // AWS access key id
  /xox[abprs]-[A-Za-z0-9-]{10,}/g, // Slack
  /AIza[0-9A-Za-z_-]{30,}/g, // Google API key
  /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?(?:-----END [A-Z ]*PRIVATE KEY-----|$)/g,
  /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, // JWT
  // key = "value" assignments with a secret-looking name (the demo fake token is caught here on purpose)
  /\b([A-Za-z0-9_]*(?:SECRET|TOKEN|PASSWORD|PASSWD|API_?KEY|PRIVATE_?KEY|CREDENTIAL)[A-Za-z0-9_]*)(\s*[:=]\s*)(["'`])[^"'`\n]{6,}\3/gi,
];

/** @returns {{ text: string, count: number }} */
export function redact(input) {
  let text = String(input ?? "");
  let count = 0;
  for (const re of PATTERNS) {
    text = text.replace(re, (...m) => {
      count += 1;
      // keep the variable name for assignments so the comment stays readable
      if (typeof m[1] === "string" && m[2] !== undefined && m[3] !== undefined && /^[A-Za-z0-9_]+$/.test(m[1])) {
        return `${m[1]}${m[2]}${m[3]}${REDACTED}${m[3]}`;
      }
      return REDACTED;
    });
  }
  return { text, count };
}

// Wrap @mentions in an inline code span: GitHub does not notify for code, and the visible text is unchanged.
// Text already inside a code span is left alone; an @ glued to a word (an email address) is not a mention.
export function defuseMentions(text) {
  return text
    .split("`")
    .map((part, i) => (i % 2 === 1 ? part : part.replace(/(^|[^\w`])@([A-Za-z0-9][\w-]*(?:\/[\w.-]+)?)/g, "$1`@$2`")))
    .join("`");
}

export function sanitizeForComment(text) {
  const r = redact(text);
  return { text: defuseMentions(r.text), count: r.count };
}
