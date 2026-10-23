// SPDX-License-Identifier: Apache-2.0
import { readFileSync } from "node:fs";

import { evaluateClaim as evaluateWithSchema, getStopRule } from "./gate-core.mjs";

export const DEFAULT_PUBLICATION_URL = "https://milleleaf.github.io/ai-output-to-value/";

const bundledClaimSchema = JSON.parse(
  readFileSync(new URL("../schemas/v1/claim.schema.json", import.meta.url), "utf8")
);
const bundledGates = JSON.parse(
  readFileSync(new URL("../schemas/v1/decision-gates.json", import.meta.url), "utf8")
);

export async function fetchJson(baseUrl, path) {
  const url = new URL(path, baseUrl).href;
  const response = await fetch(url, { headers: { accept: "application/json" } });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

export function loadBundledGates() {
  return bundledGates;
}

export function loadBundledClaimSchema() {
  return bundledClaimSchema;
}

export async function loadGateContract({ liveRules = false, publicationUrl = DEFAULT_PUBLICATION_URL } = {}) {
  if (liveRules) {
    const [gates, claimSchema] = await Promise.all([
      fetchJson(publicationUrl, "api/v1/gates.json"),
      fetchJson(publicationUrl, "schemas/v1/claim.schema.json")
    ]);
    return { gates, claimSchema, rulesSource: "live-publication" };
  }

  return {
    gates: bundledGates,
    claimSchema: bundledClaimSchema,
    rulesSource: "bundled"
  };
}

export function evaluateClaim(record, gates, claimSchema = bundledClaimSchema) {
  return evaluateWithSchema(record, gates, claimSchema);
}

export function blankDecisionRecord() {
  return {
    instructions:
      "One row per decision. The same project may have several rows. Status is only PASS, BLOCKED, or INSUFFICIENT_EVIDENCE. Leave status empty until a gate result exists for that row. Do not average rows and do not report a count of claims.",
    statusValues: ["PASS", "BLOCKED", "INSUFFICIENT_EVIDENCE"],
    row: {
      decision: "",
      intendedUse: "",
      subjectScope: "",
      requiredClaim: "",
      status: "",
      owner: "",
      nextEvidence: "",
      stopDate: ""
    }
  };
}

export { getStopRule };
