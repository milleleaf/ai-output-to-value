import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

import { caseInput, checkCase } from "../../../tests/conformance-harness.mjs";

import {
  blankDecisionRecord,
  evaluateClaim,
  getStopRule,
  loadBundledClaimSchema,
  loadBundledGates,
  loadGateContract
} from "../src/core.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const canonicalGates = JSON.parse(await readFile(resolve(here, "../../../schemas/v1/decision-gates.json"), "utf8"));
const canonicalClaimSchema = JSON.parse(await readFile(resolve(here, "../../../schemas/v1/claim.schema.json"), "utf8"));
const conformance = JSON.parse(await readFile(resolve(here, "../../../tests/fixtures/claim-gate-conformance.json"), "utf8"));
const gates = loadBundledGates();
const claimSchema = loadBundledClaimSchema();

function record() {
  return structuredClone(conformance.baseRecord);
}

function evaluate(value) {
  return evaluateClaim(value, gates, claimSchema);
}

test("blank decision record is one empty row and does not score a project", () => {
  const blank = blankDecisionRecord();
  assert.deepEqual(Object.keys(blank.row), [
    "decision",
    "intendedUse",
    "subjectScope",
    "requiredClaim",
    "status",
    "owner",
    "nextEvidence",
    "stopDate"
  ]);
  assert.deepEqual(blank.statusValues, ["PASS", "BLOCKED", "INSUFFICIENT_EVIDENCE"]);
  assert.equal(blank.row.status, "");
  assert.equal("score" in blank, false);
  assert.equal("score" in blank.row, false);
  assert.match(blank.instructions, /One row per decision/);
  assert.match(blank.instructions, /Do not average/);
});

test("bundled decision rules match canonical repository rules", () => {
  assert.deepEqual(gates, canonicalGates);
});

test("bundled claim schema matches canonical repository schema", () => {
  assert.deepEqual(claimSchema, canonicalClaimSchema);
});

test("default gate contract is bundled and performs no publication fetch", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("default gate contract must not fetch publication rules");
  };
  try {
    const contract = await loadGateContract({ publicationUrl: "https://example.invalid/" });
    assert.equal(contract.rulesSource, "bundled");
    assert.deepEqual(contract.gates, canonicalGates);
    assert.deepEqual(contract.claimSchema, canonicalClaimSchema);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("live publication gate contract requires explicit opt-in", async () => {
  const originalFetch = globalThis.fetch;
  const requested = [];
  globalThis.fetch = async (url) => {
    requested.push(String(url));
    return {
      ok: true,
      async json() {
        return String(url).includes("claim.schema.json") ? canonicalClaimSchema : canonicalGates;
      }
    };
  };
  try {
    const contract = await loadGateContract({ liveRules: true, publicationUrl: "https://example.test/base/" });
    assert.equal(contract.rulesSource, "live-publication");
    assert.equal(requested.length, 2);
    assert.ok(requested.some((url) => url.endsWith("/base/api/v1/gates.json")));
    assert.ok(requested.some((url) => url.endsWith("/base/schemas/v1/claim.schema.json")));
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("shared conformance fixture matches the MCP evaluator", async (t) => {
  for (const item of conformance.cases) {
    await t.test(item.name, () => {
      assert.equal(checkCase(item, evaluate(caseInput(conformance, item)), gates), null);
    });
  }
});

test("not-applicable required evidence remains insufficient and is preserved", () => {
  const value = record();
  value.gateChecks["acceptance-criteria-met"] = "not-applicable";
  const result = evaluate(value);
  assert.equal(result.status, "INSUFFICIENT_EVIDENCE");
  assert.equal(result.unknownChecks[0].state, "not-applicable");
});

test("empty decision-record text is structurally blocked by schema", () => {
  const value = record();
  value.authority = "";
  const result = evaluate(value);
  assert.equal(result.status, "BLOCKED");
  assert.deepEqual(result.missingFields, ["authority"]);
  assert.ok(result.structuralErrors.some((message) => message.includes("authority")));
});

test("schema enforces field length constraints", () => {
  const value = record();
  value.authority = "x".repeat(1001);
  const result = evaluate(value);
  assert.equal(result.status, "BLOCKED");
  assert.ok(result.structuralErrors.some((message) => message.includes("authority")));
});

test("actor identity does not change the gate", () => {
  const ai = record();
  const human = record();
  human.actors = [{ type: "human", role: "Author" }];
  assert.equal(evaluate(ai).status, evaluate(human).status);
});

test("stop rule comes from target decision and records contract version", () => {
  const result = getStopRule(gates, "operate");
  assert.equal(result.requiredClaimLevel, "04-capability");
  assert.equal(result.gateVersion, gates.version);
  assert.equal(result.principle, gates.principle);
});
