// Strict output schema for the review + a tiny JSON-Schema-subset validator
// (type, enum, required, properties, additionalProperties, items, min/max, minLength/maxLength).
// Zero dependency on purpose: the workflow needs no `pnpm install` step.

export const SEVERITIES = ["low", "medium", "high", "critical"];

export const REVIEW_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["risks", "proposed_fix", "checks_summary", "confidence", "needs_human_arbitration"],
  properties: {
    risks: {
      type: "array",
      maxItems: 15,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["severity", "file", "line", "why"],
        properties: {
          severity: { enum: SEVERITIES },
          file: { type: "string", minLength: 1, maxLength: 300 },
          line: { type: "integer", minimum: 0 },
          why: { type: "string", minLength: 1, maxLength: 800 },
        },
      },
    },
    proposed_fix: { type: "string", minLength: 1, maxLength: 3000 },
    checks_summary: { type: "string", minLength: 1, maxLength: 1500 },
    confidence: { type: "number", minimum: 0, maximum: 1 },
    needs_human_arbitration: { type: "boolean" },
  },
};

/** @returns {string[]} list of human-readable errors; empty when valid. */
export function validate(value, schema = REVIEW_SCHEMA, path = "$") {
  const errors = [];
  const fail = (msg) => errors.push(`${path}: ${msg}`);

  if (schema.enum && !schema.enum.includes(value)) {
    fail(`must be one of ${JSON.stringify(schema.enum)}`);
    return errors;
  }
  switch (schema.type) {
    case undefined:
      break;
    case "object": {
      if (value === null || typeof value !== "object" || Array.isArray(value)) {
        fail("must be an object");
        return errors;
      }
      for (const key of schema.required ?? []) {
        if (!(key in value)) fail(`missing required property "${key}"`);
      }
      const props = schema.properties ?? {};
      for (const [key, sub] of Object.entries(props)) {
        if (key in value) errors.push(...validate(value[key], sub, `${path}.${key}`));
      }
      if (schema.additionalProperties === false) {
        for (const key of Object.keys(value)) {
          if (!(key in props)) fail(`unexpected property "${key}"`);
        }
      }
      break;
    }
    case "array": {
      if (!Array.isArray(value)) {
        fail("must be an array");
        return errors;
      }
      if (schema.maxItems !== undefined && value.length > schema.maxItems) fail(`must have at most ${schema.maxItems} items`);
      if (schema.items) value.forEach((v, i) => errors.push(...validate(v, schema.items, `${path}[${i}]`)));
      break;
    }
    case "string": {
      if (typeof value !== "string") {
        fail("must be a string");
        return errors;
      }
      if (schema.minLength !== undefined && value.length < schema.minLength) fail(`must be at least ${schema.minLength} chars`);
      if (schema.maxLength !== undefined && value.length > schema.maxLength) fail(`must be at most ${schema.maxLength} chars`);
      break;
    }
    case "integer":
    case "number": {
      if (typeof value !== "number" || !Number.isFinite(value) || (schema.type === "integer" && !Number.isInteger(value))) {
        fail(`must be ${schema.type === "integer" ? "an integer" : "a number"}`);
        return errors;
      }
      if (schema.minimum !== undefined && value < schema.minimum) fail(`must be >= ${schema.minimum}`);
      if (schema.maximum !== undefined && value > schema.maximum) fail(`must be <= ${schema.maximum}`);
      break;
    }
    case "boolean":
      if (typeof value !== "boolean") fail("must be a boolean");
      break;
    default:
      fail(`unsupported schema type ${schema.type}`);
  }
  return errors;
}

/** Parse model text as JSON (tolerates a ```json fence) then validate. */
export function parseAndValidate(text) {
  let raw = String(text ?? "").trim();
  const fence = raw.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fence) raw = fence[1];
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    return { ok: false, errors: [`output is not valid JSON: ${e.message}`] };
  }
  const errors = validate(data);
  return errors.length ? { ok: false, errors } : { ok: true, data };
}
