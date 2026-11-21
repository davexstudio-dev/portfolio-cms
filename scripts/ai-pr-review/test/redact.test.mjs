import { test } from "node:test";
import assert from "node:assert/strict";
import { redact, sanitizeForComment } from "../redact.mjs";
import { renderComment } from "../comment.mjs";

// Fake values assembled at runtime so no real-looking secret sits in the repo.
const fakeAnthropic = "sk-ant-" + "a1b2c3d4e5f6g7h8i9j0";
const fakeGh = "ghp_" + "A".repeat(36);

test("redacts known token formats", () => {
  for (const s of [fakeAnthropic, fakeGh, "AKIA" + "ABCDEFGHIJKLMNOP"]) {
    const r = redact(`leak: ${s} end`);
    assert.equal(r.count, 1);
    assert.ok(!r.text.includes(s));
  }
});
test("redacts secret-looking assignments but keeps the variable name", () => {
  const r = redact('const DEMO_FAKE_TOKEN = "not-a-real-secret-demo-only";');
  assert.equal(r.count, 1);
  assert.match(r.text, /DEMO_FAKE_TOKEN = "\[REDACTED\]"/);
  assert.ok(!r.text.includes("not-a-real"));
});
test("redacts private key blocks", () => {
  assert.ok(!redact("-----BEGIN PRIVATE KEY-----\nabc\n-----END PRIVATE KEY-----").text.includes("abc"));
});
test("leaves clean text untouched", () => {
  assert.deepEqual(redact("Add a unit test for slugify()."), { text: "Add a unit test for slugify().", count: 0 });
});
test("defuses @mentions", () => {
  assert.ok(!/@[a-z]/.test(sanitizeForComment("ping @someone").text));
});
test("rendered comment never contains a secret echoed by the model, and has the 3 blocks + footer", () => {
  const { body, redactions } = renderComment({
    risks: [{ severity: "high", file: "x.ts", line: 1, why: `key ${fakeAnthropic} is exposed` }],
    proposed_fix: `Rotate ${fakeGh}`,
    checks_summary: "ok",
    confidence: 0.9,
    needs_human_arbitration: true,
  });
  assert.equal(redactions, 2);
  assert.ok(!body.includes(fakeAnthropic) && !body.includes(fakeGh));
  for (const h of ["### Risks", "### Proposed fix", "### Checks summary", "A human must validate"]) assert.ok(body.includes(h), h);
  assert.ok(body.startsWith("<!-- ai-pr-review-agent -->"));
});
