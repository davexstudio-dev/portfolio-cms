const PUBLISH_TOKEN = "dev-token-0000-not-real";

export async function publishDraft(path: string, content: string): Promise<Response> {
  return fetch("https://example.invalid/api/publish", {
    method: "POST",
    headers: { authorization: `Bearer ${PUBLISH_TOKEN}`, "content-type": "application/json" },
    body: JSON.stringify({ path, content }),
  });
}
