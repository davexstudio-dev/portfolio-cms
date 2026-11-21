import { test } from "node:test";
import assert from "node:assert/strict";
import { runReview, MAX_ITERATIONS } from "../review.mjs";

const valid = JSON.stringify({ risks: [], proposed_fix: "none", checks_summary: "fine", confidence: 0.5, needs_human_arbitration: false });
const reply = (text) => ({ text, tokensIn: 10, tokensOut: 5 });

test("returns on first valid output", async () => {
  const r = await runReview({ callModel: async () => reply(valid), messages: [{ role: "user", content: "x" }] });
  assert.equal(r.ok, true);
  assert.equal(r.totals.iterations, 1);
});
test("retries with the validation error, then succeeds", async () => {
  const seen = [];
  const outputs = ["not json", valid];
  const r = await runReview({
    callModel: async (m) => (seen.push(m), reply(outputs.shift())),
    messages: [{ role: "user", content: "x" }],
  });
  assert.equal(r.ok, true);
  assert.equal(r.totals.iterations, 2);
  assert.match(seen[1].at(-1).content, /schema validator/);
  assert.equal(r.totals.tokensIn, 20);
});
test("hard cap: exactly 3 model calls, then graceful failure", async () => {
  let calls = 0;
  const r = await runReview({ callModel: async () => (calls++, reply("{}")), messages: [], maxIterations: 99 });
  assert.equal(MAX_ITERATIONS, 3);
  assert.equal(calls, 3);
  assert.equal(r.ok, false);
  assert.match(r.reason, /3 iterations/);
});
test("a throwing model yields a graceful failure, not an exception", async () => {
  const r = await runReview({ callModel: async () => { throw new Error("boom"); }, messages: [] });
  assert.equal(r.ok, false);
  assert.match(r.reason, /boom/);
});
