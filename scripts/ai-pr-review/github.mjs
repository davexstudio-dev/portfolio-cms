// Post ONE comment per PR; update it in place via the hidden marker. Only needs pull-requests: write.
import { MARKER } from "./comment.mjs";

export async function upsertComment({ repo, prNumber, token, body, fetchImpl = fetch }) {
  const api = `https://api.github.com/repos/${repo}/issues`;
  const headers = { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28", "content-type": "application/json" };
  const call = async (url, init) => {
    const res = await fetchImpl(url, { ...init, headers });
    if (!res.ok) throw new Error(`GitHub API ${init?.method ?? "GET"} ${res.status}`);
    return res.json();
  };
  const existing = [];
  for (let page = 1; page <= 10; page++) {
    const batch = await call(`${api}/${prNumber}/comments?per_page=100&page=${page}`);
    existing.push(...batch);
    if (batch.length < 100) break;
  }
  const mine = existing.find((c) => typeof c.body === "string" && c.body.includes(MARKER));
  if (mine) {
    await call(`${api}/comments/${mine.id}`, { method: "PATCH", body: JSON.stringify({ body }) });
    return "updated";
  }
  await call(`${api}/${prNumber}/comments`, { method: "POST", body: JSON.stringify({ body }) });
  return "created";
}
