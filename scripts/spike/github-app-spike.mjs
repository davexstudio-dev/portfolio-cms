// Spike portfolio-cms : lire un fichier MDX sur GitHub, le modifier, ouvrir une PR.
//
// Usage :
//   node scripts/spike/github-app-spike.mjs            # simulation, n'écrit rien
//   node scripts/spike/github-app-spike.mjs --apply    # crée branche, commit, PR (brouillon)
//   node scripts/spike/github-app-spike.mjs --cleanup <numéro-pr>   # ferme la PR et supprime la branche
//
// Config lue dans ~/.config/portfolio-cms/spike.env (jamais dans le dépôt) :
//   GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY_PATH
//
// Garde-fous : la branche de base est `develop`, jamais `main` ; la PR est en brouillon.

import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";

const OWNER = "davexstudio-dev";
const REPO = "davex-studio";
const BASE = "develop";
const FILE = "apps/web/src/content/tutorials/fr/gagner-de-la-reputation.mdx";
const MARKER = "<!-- portfolio-cms spike -->";
const API = "https://api.github.com";

const args = process.argv.slice(2);
const apply = args.includes("--apply");
const cleanupIdx = args.indexOf("--cleanup");

function loadEnv() {
  const path = join(homedir(), ".config", "portfolio-cms", "spike.env");
  const env = {};
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

function appJwt(appId, pem) {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const head = b64({ alg: "RS256", typ: "JWT" });
  const body = b64({ iat: now - 60, exp: now + 540, iss: appId });
  const sig = createSign("RSA-SHA256").update(`${head}.${body}`).sign(pem, "base64url");
  return `${head}.${body}.${sig}`;
}

async function gh(method, path, token, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${data?.message ?? text}`);
  return data;
}

async function main() {
  const env = loadEnv();
  const pem = readFileSync(env.GITHUB_APP_PRIVATE_KEY_PATH, "utf8");
  const jwt = appJwt(env.GITHUB_APP_ID, pem);

  const inst = await gh("GET", `/repos/${OWNER}/${REPO}/installation`, jwt);
  const { token } = await gh("POST", `/app/installations/${inst.id}/access_tokens`, jwt, {
    repositories: [REPO],
    permissions: { contents: "write", pull_requests: "write" },
  });
  console.log(`✓ jeton d'installation obtenu (installation ${inst.id})`);

  if (cleanupIdx !== -1) {
    const n = args[cleanupIdx + 1];
    const pr = await gh("GET", `/repos/${OWNER}/${REPO}/pulls/${n}`, token);
    await gh("PATCH", `/repos/${OWNER}/${REPO}/pulls/${n}`, token, { state: "closed" });
    await gh("DELETE", `/repos/${OWNER}/${REPO}/git/refs/heads/${pr.head.ref}`, token);
    console.log(`✓ PR #${n} fermée, branche ${pr.head.ref} supprimée`);
    return;
  }

  const base = await gh("GET", `/repos/${OWNER}/${REPO}/git/ref/heads/${BASE}`, token);
  const file = await gh("GET", `/repos/${OWNER}/${REPO}/contents/${FILE}?ref=${BASE}`, token);
  const original = Buffer.from(file.content, "base64").toString("utf8");
  if (original.includes(MARKER)) throw new Error("le marqueur du spike est déjà présent");
  const edited = `${original.replace(/\n*$/, "\n")}\n${MARKER}\n`;

  const branch = `cms-spike-${Date.now()}`;
  console.log(`• base : ${BASE} @ ${base.object.sha.slice(0, 7)}`);
  console.log(`• fichier : ${FILE} (${original.length} → ${edited.length} caractères)`);
  console.log(`• branche : ${branch}`);

  if (!apply) {
    console.log("Simulation : rien n'a été écrit. Relancer avec --apply.");
    return;
  }

  await gh("POST", `/repos/${OWNER}/${REPO}/git/refs`, token, {
    ref: `refs/heads/${branch}`,
    sha: base.object.sha,
  });
  await gh("PUT", `/repos/${OWNER}/${REPO}/contents/${FILE}`, token, {
    message: "Ajoute le marqueur du spike portfolio-cms\n\nCo-Authored-By: Claude Haiku 5.5 <noreply@anthropic.com>",
    content: Buffer.from(edited, "utf8").toString("base64"),
    sha: file.sha,
    branch,
  });
  const pr = await gh("POST", `/repos/${OWNER}/${REPO}/pulls`, token, {
    title: "Spike portfolio-cms : marqueur de test (ne pas fusionner)",
    head: branch,
    base: BASE,
    body: "Spike technique pour portfolio-cms : lecture et modification d'un MDX via GitHub App, PR en brouillon. À fermer après vérification.",
    draft: true,
  });
  console.log(`✓ PR brouillon #${pr.number} : ${pr.html_url}`);
}

main().catch((e) => {
  console.error(`✗ ${e.message}`);
  process.exit(1);
});
