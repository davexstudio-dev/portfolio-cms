// Builds the minimal context from git data only. Reads the diff; executes nothing from the PR.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

export const MAX_DIFF_CHARS = 60_000;
export const MAX_RULE_CHARS = 3_000;

const git = (cwd, args) => execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

export function truncate(text, max) {
  return text.length <= max ? { text, truncated: false } : { text: text.slice(0, max) + "\n[... truncated ...]", truncated: true };
}

export function collectContext({ repoDir, rulesDir = repoDir, base, head }) {
  const range = `${base}...${head}`;
  const files = git(repoDir, ["diff", "--name-only", range]).split("\n").filter(Boolean);
  const fullDiff = git(repoDir, ["diff", "--unified=3", range]);
  const diff = truncate(fullDiff, MAX_DIFF_CHARS);
  const rules = ["README.md", "DESIGN.md", "PRODUCT.md"]
    .filter((f) => existsSync(join(rulesDir, f)))
    .map((f) => `## ${f}\n${truncate(readFileSync(join(rulesDir, f), "utf8"), MAX_RULE_CHARS).text}`)
    .join("\n\n");
  return { files, diff: diff.text, diffChars: fullDiff.length, diffTruncated: diff.truncated, rules };
}
