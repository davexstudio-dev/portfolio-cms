// Minimal Anthropic Messages API client. Never logs headers, never echoes the key.
export const MODEL = "claude-sonnet-5-5";
const URL_ = "https://api.anthropic.com/v1/messages";

export function makeCallModel({ apiKey, model = MODEL, system, maxTokens = 2000, fetchImpl = fetch }) {
  return async function callModel(messages) {
    const res = await fetchImpl(URL_, {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
    });
    if (!res.ok) {
      // Only status + API error type/message; the body of the request and the headers are never printed.
      let detail = "";
      try {
        const j = await res.json();
        detail = `${j?.error?.type ?? "error"}: ${j?.error?.message ?? ""}`;
      } catch {}
      throw new Error(`Anthropic API HTTP ${res.status} ${detail}`.trim());
    }
    const j = await res.json();
    const text = (j.content ?? []).filter((b) => b.type === "text").map((b) => b.text).join("");
    return { text, tokensIn: j.usage?.input_tokens ?? 0, tokensOut: j.usage?.output_tokens ?? 0 };
  };
}
