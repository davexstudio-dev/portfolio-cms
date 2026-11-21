// Review loop: ask the model, validate, retry with the validation error, hard cap on iterations.
// The model is injected (callModel) so tests never touch the network.
import { parseAndValidate } from "./schema.mjs";

export const MAX_ITERATIONS = 3;

/**
 * @param {object} p
 * @param {(messages: {role: string, content: string}[]) => Promise<{text: string, tokensIn: number, tokensOut: number}>} p.callModel
 * @param {{role: string, content: string}[]} p.messages initial conversation
 * @param {(entry: object) => void} [p.log] structured step log sink
 * @param {number} [p.maxIterations]
 */
export async function runReview({ callModel, messages, log = () => {}, maxIterations = MAX_ITERATIONS }) {
  const cap = Math.min(maxIterations, MAX_ITERATIONS); // never exceed the hard cap
  const convo = [...messages];
  const totals = { tokensIn: 0, tokensOut: 0, durationMs: 0, iterations: 0 };
  let lastErrors = [];

  for (let iteration = 1; iteration <= cap; iteration++) {
    const t0 = Date.now();
    let res;
    try {
      res = await callModel(convo);
    } catch (e) {
      totals.iterations = iteration;
      log({ step: "model_call", duration_ms: Date.now() - t0, tokens_in: 0, tokens_out: 0, iteration, status: "error" });
      return { ok: false, reason: `model call failed: ${e.message}`, totals };
    }
    const duration = Date.now() - t0;
    totals.iterations = iteration;
    totals.tokensIn += res.tokensIn;
    totals.tokensOut += res.tokensOut;
    totals.durationMs += duration;

    const parsed = parseAndValidate(res.text);
    log({
      step: "model_call",
      duration_ms: duration,
      tokens_in: res.tokensIn,
      tokens_out: res.tokensOut,
      iteration,
      status: parsed.ok ? "valid" : "invalid",
    });
    if (parsed.ok) return { ok: true, review: parsed.data, totals };

    lastErrors = parsed.errors;
    convo.push({ role: "assistant", content: res.text || "(empty)" });
    convo.push({
      role: "user",
      content:
        "Your previous output was rejected by the JSON schema validator:\n- " +
        parsed.errors.slice(0, 10).join("\n- ") +
        "\nReturn ONLY a corrected JSON object that satisfies the schema.",
    });
  }
  return { ok: false, reason: `no valid output after ${cap} iterations`, errors: lastErrors, totals };
}
