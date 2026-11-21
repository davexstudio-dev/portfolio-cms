#!/usr/bin/env node
// AI PR review agent. Reads a git diff, calls the model, validates, posts ONE comment.
// It never executes anything coming from the model or from the PR.
//   node index.mjs --dry-run --base <ref> --head <ref> [--repo-dir .]
import { appendFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { collectContext } from "./context.mjs";
import { makeCallModel, MODEL } from "./anthropic.mjs";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompt.mjs";
import { runReview } from "./review.mjs";
import { renderComment, renderFailureComment } from "./comment.mjs";
import { upsertComment } from "./github.mjs";

// Never call process.exit(): on Windows it can race with closing fetch handles. Set exitCode and let the loop drain.
async function main() {
  const { values: a } = parseArgs({
    options: {
      "dry-run": { type: "boolean", default: false },
      base: { type: "string" },
      head: { type: "string" },
      "repo-dir": { type: "string", default: "." },
      "rules-dir": { type: "string" },
    },
  });
  const base = a.base ?? process.env.BASE_SHA;
  const head = a.head ?? process.env.HEAD_SHA;
  if (!base || !head) {
    console.error("step=config status=error reason=missing base/head");
    { process.exitCode = 2; return; }
  }
  // Prices in USD per million tokens: an ESTIMATE, override with env if the price list changes.
  const PRICE_IN = Number(process.env.PRICE_IN_PER_MTOK ?? 3);
  const PRICE_OUT = Number(process.env.PRICE_OUT_PER_MTOK ?? 15);
  
  const log = (e) =>
    console.log(
      Object.entries(e)
        .map(([k, v]) => `${k}=${v}`)
        .join(" "),
    );
  const dryRun = a["dry-run"];
  const t0 = Date.now();
  
  if (process.env.PR_IS_FORK === "true") {
    console.log("step=skip status=skipped reason=fork-pr-secrets-unavailable");
    { process.exitCode = 0; return; }
  }
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("step=config status=error reason=ANTHROPIC_API_KEY-not-set");
    { process.exitCode = 2; return; }
  }
  
  const tCtx = Date.now();
  const ctx = collectContext({ repoDir: a["repo-dir"], rulesDir: a["rules-dir"] ?? a["repo-dir"], base, head });
  log({ step: "context", duration_ms: Date.now() - tCtx, files: ctx.files.length, diff_chars: ctx.diffChars, truncated: ctx.diffTruncated });
  if (ctx.diffTruncated) console.log(`step=context warning=diff truncated to ${ctx.diff.length} chars before sending to the model`);
  if (!ctx.diffChars) {
    console.log("step=skip status=skipped reason=empty-diff");
    { process.exitCode = 0; return; }
  }
  
  const callModel = makeCallModel({ apiKey, system: SYSTEM_PROMPT });
  const result = await runReview({
    callModel,
    messages: [{ role: "user", content: buildUserMessage(ctx) }],
    log,
  });
  
  let body;
  let redactions = 0;
  if (result.ok) {
    const note = ctx.diffTruncated ? `Diff truncated to ${ctx.diff.length} of ${ctx.diffChars} chars: part of the change was not reviewed.` : undefined;
    ({ body, redactions } = renderComment(result.review, { note }));
  } else {
    console.log(`step=validate status=failed reason=${result.reason}`);
    body = renderFailureComment(result.reason);
  }
  log({ step: "redaction", redactions });
  
  if (dryRun) {
    console.log("\n===== DRY RUN: comment that would be posted =====\n" + body + "\n===== END =====");
  } else {
    const { GITHUB_TOKEN, GITHUB_REPOSITORY, PR_NUMBER } = process.env;
    const tPost = Date.now();
    const action = await upsertComment({ repo: GITHUB_REPOSITORY, prNumber: PR_NUMBER, token: GITHUB_TOKEN, body });
    log({ step: "post_comment", duration_ms: Date.now() - tPost, action });
  }
  
  const { totals } = result;
  const cost = (totals.tokensIn * PRICE_IN + totals.tokensOut * PRICE_OUT) / 1e6;
  log({ step: "total", duration_ms: Date.now() - t0, tokens_in: totals.tokensIn, tokens_out: totals.tokensOut, iteration: totals.iterations, est_cost_usd: cost.toFixed(4) });
  
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(
      process.env.GITHUB_STEP_SUMMARY,
      [
        "## AI PR review",
        "| Metric | Value |",
        "|---|---|",
        `| Model | \`${MODEL}\` |`,
        `| Outcome | ${result.ok ? "valid review posted" : "no valid output (graceful failure comment)"} |`,
        `| Iterations | ${totals.iterations} / 3 |`,
        `| Tokens in / out | ${totals.tokensIn} / ${totals.tokensOut} |`,
        `| Model latency | ${totals.durationMs} ms |`,
        `| Total duration | ${Date.now() - t0} ms |`,
        `| Estimated cost | $${cost.toFixed(4)} (assumes $${PRICE_IN}/$${PRICE_OUT} per MTok) |`,
        `| Diff | ${ctx.diffChars} chars${ctx.diffTruncated ? " (truncated)" : ""}, ${ctx.files.length} files |`,
        `| Secrets redacted | ${redactions} |`,
        "",
      ].join("\n"),
    );
  }
  // A failed review is reported in the comment and the summary; the job itself stays green (advisory agent).
}

main().catch((e) => {
  console.error(`step=fatal status=error reason=${e.message}`);
  process.exitCode = 1;
});
