import { test } from "node:test";
import assert from "node:assert/strict";
import { parseAndValidate, validate } from "../schema.mjs";

const good = () => ({
  risks: [{ severity: "high", file: "a.ts", line: 3, why: "hardcoded credential" }],
  proposed_fix: "Move it to an env var.",
  checks_summary: "No tests for new code.",
  confidence: 0.8,
  needs_human_arbitration: false,
});

test("accepts a valid review", () => {
  assert.deepEqual(validate(good()), []);
  assert.equal(parseAndValidate(JSON.stringify(good())).ok, true);
});
test("accepts a fenced JSON block", () => {
  assert.equal(parseAndValidate("```json\n" + JSON.stringify(good()) + "\n```").ok, true);
});
test("rejects non-JSON", () => {
  const r = parseAndValidate("here is my review");
  assert.equal(r.ok, false);
  assert.match(r.errors[0], /not valid JSON/);
});
test("rejects missing field, bad enum, extra property, out-of-range confidence", () => {
  const bad = { ...good(), confidence: 1.5, extra: 1 };
  delete bad.proposed_fix;
  bad.risks[0].severity = "urgent";
  const errors = validate(bad);
  assert.ok(errors.some((e) => e.includes('missing required property "proposed_fix"')));
  assert.ok(errors.some((e) => e.includes("$.risks[0].severity")));
  assert.ok(errors.some((e) => e.includes('unexpected property "extra"')));
  assert.ok(errors.some((e) => e.includes("$.confidence")));
});
test("rejects wrong types", () => {
  const bad = good();
  bad.needs_human_arbitration = "yes";
  bad.risks[0].line = 1.5;
  assert.equal(validate(bad).length, 2);
});
