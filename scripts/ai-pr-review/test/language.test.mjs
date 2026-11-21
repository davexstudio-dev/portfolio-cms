import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveLanguage, getStrings } from "../strings.mjs";
import { renderComment, renderFailureComment, MARKER } from "../comment.mjs";
import { buildSystemPrompt } from "../prompt.mjs";

const review = {
  risks: [{ severity: "high", file: "a.ts", line: 2, why: "x" }],
  proposed_fix: "fix",
  checks_summary: "ok",
  confidence: 0.9,
  needs_human_arbitration: true,
};

test("language defaults to French, English only on explicit override", () => {
  assert.equal(resolveLanguage(undefined), "French");
  assert.equal(resolveLanguage(""), "French");
  assert.equal(resolveLanguage("klingon"), "French");
  assert.equal(resolveLanguage("English"), "English");
  assert.equal(resolveLanguage(" english "), "English");
});
test("French comment by default", () => {
  const { body } = renderComment(review, { truncated: { sent: 10, total: 20 } });
  for (const s of ["### Risques", "### Correctif proposé", "### Résumé des vérifications", "Décision humaine requise", "Confiance : **90%**", "Diff tronqué à 10 caractères sur 20", "Une personne doit valider"]) {
    assert.ok(body.includes(s), s);
  }
  assert.ok(!body.includes("### Risks"));
});
test("English override", () => {
  const { body } = renderComment(review, { language: "English", truncated: { sent: 10, total: 20 } });
  for (const s of ["### Risks", "### Proposed fix", "### Checks summary", "Needs human arbitration", "Confidence: **90%**", "Diff truncated to 10 of 20", "A human must validate"]) {
    assert.ok(body.includes(s), s);
  }
});
test("marker is unchanged in both languages and in the failure comment", () => {
  assert.equal(MARKER, "<!-- ai-pr-review-agent -->");
  for (const l of ["French", "English"]) {
    assert.ok(renderComment(review, { language: l }).body.startsWith(MARKER));
    assert.ok(renderFailureComment("boom", l).startsWith(MARKER));
  }
});
test("arbitration banner has no stray blank lines and mentions keep their visible text", () => {
  const { body } = renderComment({ ...review, why: "", proposed_fix: "ask @someone" });
  assert.ok(!body.includes("\n\n\n"));
  assert.ok(body.includes("ask `@someone`"));
  assert.ok(!body.includes("​"));
});
test("prompt pins the language and keeps keys/enums untranslated", () => {
  assert.match(buildSystemPrompt("French"), /in French/);
  assert.match(buildSystemPrompt("English"), /in English/);
  assert.match(buildSystemPrompt("French"), /JSON keys, the severity values/);
  assert.equal(getStrings("English").risks, "Risks");
});
