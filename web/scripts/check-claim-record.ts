// Check the Claim Gate's export merge: a loaded record whose form fields are unchanged exports
// as the same record, and edits change only what the form edits. The browser round trip
// (check-claim-roundtrip-browser.mjs) checks the same thing through the real page.
import { deepStrictEqual } from "node:assert/strict"
import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { DEFAULT_ACTOR_ROLE, exportClaimRecord, type FormActor } from "../src/lib/claim-record"

type Json = Record<string, any>
const root = path.resolve(import.meta.dirname, "../..")
const read = (file: string): Json => JSON.parse(readFileSync(file, "utf8"))
const sampleDir = path.join(root, "toolkit/samples")
const records = [
  ...readdirSync(sampleDir).filter((name) => name.endsWith(".claim.json")).map((name) => path.join(sampleDir, name)),
  path.join(root, "tests/fixtures/claim-roundtrip-rich.claim.json"),
].map((file) => [path.relative(root, file), read(file)] as const)

const text = ["project", "intendedUse", "workflowBoundary", "workflowCompletion", "movedBottleneck", "unhappyPath",
  "authority", "accountability", "outcomeMeasure", "baseline", "fullRelevantCostBoundary", "optionValue", "nextEvidence", "stopRule"]
const list = ["downstreamHandoffs", "evidenceRefs"]

// What the page's form exports for a record it loaded without edits.
function formOf(item: Json): Json {
  return {
    $schema: "http://localhost/schemas/v1/claim.schema.json",
    schemaVersion: item.schemaVersion,
    targetDecision: item.targetDecision,
    requiredClaimLevel: item.requiredClaimLevel,
    assertedClaimLevel: item.assertedClaimLevel,
    gateChecks: item.gateChecks,
    actors: [],
    ...Object.fromEntries(text.map((key) => [key, item[key] ?? ""])),
    ...Object.fromEntries(list.map((key) => [key, item[key] ?? []])),
  }
}
const actorOf = (item: Json): FormActor => item.actors[0]
  ? { type: item.actors[0].type, ...(item.actors[0].interactionChannel ? { interactionChannel: item.actors[0].interactionChannel } : {}) }
  : null

for (const [name, item] of records) deepStrictEqual(exportClaimRecord(item, formOf(item), actorOf(item)), item, name)

const [, rich] = records[records.length - 1]
const edited: Json = exportClaimRecord(rich, { ...formOf(rich), project: "Edited" }, { type: "human" })
deepStrictEqual(edited.project, "Edited")
deepStrictEqual(edited.notes, rich.notes, "untouched field kept after an edit")
deepStrictEqual(edited.actors[0], { type: "human", role: rich.actors[0].role }, "role kept, cleared channel removed")
deepStrictEqual(edited.actors.slice(1), rich.actors.slice(1), "other actors kept")
deepStrictEqual(exportClaimRecord(rich, formOf(rich), null).actors, rich.actors.slice(1), "unselecting the actor drops only the first")

const fresh = exportClaimRecord(null, { project: "", actors: [] }, { type: "ai-agent", interactionChannel: "mcp" })
deepStrictEqual(fresh, { project: "", actors: [{ role: DEFAULT_ACTOR_ROLE, type: "ai-agent", interactionChannel: "mcp" }] })

console.log(`Claim Gate export keeps every field and actor for ${records.length} records, and edits change only what the form edits.`)
