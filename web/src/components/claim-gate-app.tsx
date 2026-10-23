import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { formVerdict } from "@/lib/verdict"
import { DEFAULT_ACTOR_ROLE, exportClaimRecord } from "@/lib/claim-record"
import { evaluateClaim } from "@gate-core"

type CheckState = "unknown" | "pass" | "fail" | "not-applicable"
type GateCheck = { id: string; label: string }
type ClaimLevel = "01-access" | "02-output" | "03-deliverable" | "04-capability" | "05-outcome" | "06-value"
type GateRule = {
  label: string
  description: string
  requiredClaimLevel: ClaimLevel
  requiredChecks: GateCheck[]
}
type GateRules = { decisions: Record<string, GateRule> }
type SoftwareOutcomeTemplate = {
  targetDecision?: string
  requiredClaimLevel?: ClaimLevel
  recommendedRecordFields?: {
    outcomeMeasure?: string
    baseline?: string
    fullRelevantCostBoundary?: string
    nextEvidence?: string
  }
}

type FormState = {
  project: string
  decision: string
  assertedClaim: ClaimLevel
  intendedUse: string
  workflowBoundary: string
  workflowCompletion: string
  downstreamHandoffs: string
  movedBottleneck: string
  unhappyPath: string
  actor: string
  channel: string
  authority: string
  accountability: string
  evidence: string
  outcomeMeasure: string
  baseline: string
  fullRelevantCostBoundary: string
  optionValue: string
  nextEvidence: string
  stopRule: string
  checks: Record<string, CheckState>
}

const claimLabels: Record<ClaimLevel, string> = {
  "01-access": "01 Access",
  "02-output": "02 Output",
  "03-deliverable": "03 Deliverable",
  "04-capability": "04 Operating capability",
  "05-outcome": "05 Outcome",
  "06-value": "06 Value",
}

const claimOptions = Object.entries(claimLabels).map(([value, label]) => ({ value: value as ClaimLevel, label }))
const actorOptions = [
  { value: "unselected", label: "Select actor" },
  { value: "human", label: "Human" },
  { value: "ai-agent", label: "AI agent" },
  { value: "deterministic-system", label: "Deterministic system" },
  { value: "specialist-tool", label: "Specialist tool" },
  { value: "hybrid", label: "Hybrid" },
]
const channelOptions = [
  { value: "unselected", label: "Select channel" },
  { value: "human-ui", label: "Human UI" },
  { value: "webmcp", label: "WebMCP" },
  { value: "mcp", label: "MCP" },
  { value: "api", label: "API" },
  { value: "cli", label: "CLI" },
  { value: "ide-agent", label: "IDE agent" },
  { value: "other-agent-tool", label: "Other agent tool" },
  { value: "hybrid", label: "Hybrid" },
  { value: "other", label: "Other" },
]
const checkOptions = [
  { value: "unknown", label: "Unknown / not evidenced" },
  { value: "pass", label: "Pass" },
  { value: "fail", label: "Fail" },
  { value: "not-applicable", label: "Not applicable / evidence still required" },
]
const samples = [
  {
    label: "Website — Explore PASS",
    path: "../samples/website-explore-pass.claim.json",
    note: "A reproducible prototype is enough for the exploration decision.",
  },
  {
    label: "Same website — Operate BLOCKED",
    path: "../samples/website-operate-blocked.claim.json",
    note: "The visible artefact is unchanged; the requested decision is stronger.",
  },
  {
    label: "Internal tool — Rely PASS",
    path: "../samples/internal-tool-rely-pass.claim.json",
    note: "A bounded internal use passes after its acceptance evidence is supplied.",
  },
  {
    label: "Killed idea — Outcome PASS",
    path: "../samples/killed-idea-outcome-pass.claim.json",
    note: "Learning can be the Outcome even when productisation stops.",
  },
]

function lines(value: string) {
  return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean)
}

function objectValue(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null
}

function textValue(value: unknown) {
  return typeof value === "string" ? value : ""
}

function listValue(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []
}

function isClaimLevel(value: unknown): value is ClaimLevel {
  return typeof value === "string" && value in claimLabels
}

function isCheckState(value: unknown): value is CheckState {
  return value === "unknown" || value === "pass" || value === "fail" || value === "not-applicable"
}

function optionOrFallback(options: { value: string }[], value: unknown, fallback: string) {
  return typeof value === "string" && options.some((option) => option.value === value) ? value : fallback
}

function optionLabel(options: { value: string; label: string }[], value: string) {
  return options.find((option) => option.value === value)?.label ?? value
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "")
  textarea.style.position = "fixed"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  textarea.remove()
}

function NativeFieldSelect({
  value,
  options,
  onChange,
  ariaLabel,
}: {
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  ariaLabel: string
}) {
  return (
    <Select value={value} onValueChange={(next) => onChange(String(next))} items={options}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((item) => (
          <SelectItem key={item.value} value={item.value}>{item.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function Field({ label, children, full = false }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={cn("grid gap-2", full && "md:col-span-2")}>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function PrintField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="aiov-print-field">
      <dt>{label}</dt>
      <dd>{value || "Not supplied"}</dd>
    </div>
  )
}

function blankState(): FormState {
  return {
    project: "",
    decision: "",
    assertedClaim: "02-output",
    intendedUse: "",
    workflowBoundary: "",
    workflowCompletion: "",
    downstreamHandoffs: "",
    movedBottleneck: "",
    unhappyPath: "",
    actor: "unselected",
    channel: "unselected",
    authority: "",
    accountability: "",
    evidence: "",
    outcomeMeasure: "",
    baseline: "",
    fullRelevantCostBoundary: "",
    optionValue: "",
    nextEvidence: "",
    stopRule: "",
    checks: {},
  }
}

export function ClaimGateApp() {
  const [gates, setGates] = React.useState<GateRules | null>(null)
  const [claimSchema, setClaimSchema] = React.useState<unknown>(null)
  const [loadError, setLoadError] = React.useState<string | null>(null)
  const [handoffMessage, setHandoffMessage] = React.useState<string | null>(null)
  const importRef = React.useRef<HTMLInputElement>(null)
  const [state, setState] = React.useState<FormState>(blankState)
  // The last record loaded into the form; its fields the form does not edit are exported unchanged.
  const [loaded, setLoaded] = React.useState<Record<string, unknown> | null>(null)

  React.useEffect(() => {
    Promise.all([
      fetch("../schemas/v1/decision-gates.json").then(async (response) => {
        if (!response.ok) throw new Error(`Gate rules returned HTTP ${response.status}`)
        return (await response.json()) as GateRules
      }),
      fetch("../schemas/v1/claim.schema.json").then(async (response) => {
        if (!response.ok) throw new Error(`Claim schema returned HTTP ${response.status}`)
        return (await response.json()) as unknown
      }),
    ])
      .then(([payload, schema]) => {
        setClaimSchema(schema)
        // Open on "Keep exploring": the everyday starting point, not the lowest rung of the ladder.
        const firstDecision = "explore" in payload.decisions ? "explore" : Object.keys(payload.decisions)[0]
        const firstRule = payload.decisions[firstDecision]
        setGates(payload)
        setState((previous) => ({
          ...previous,
          decision: firstDecision,
          assertedClaim: firstRule.requiredClaimLevel,
          checks: Object.fromEntries(firstRule.requiredChecks.map((check) => [check.id, "unknown"])) as Record<string, CheckState>,
        }))
      })
      .catch((error) => setLoadError(error instanceof Error ? error.message : String(error)))
  }, [])

  function applyClaimRecord(input: unknown, source: string) {
    if (!gates) throw new Error("Gate rules have not loaded yet.")
    const item = objectValue(input)
    if (!item) throw new Error("Claim record must be a JSON object.")
    if (item.schemaVersion !== "1.0") throw new Error("claim.json schemaVersion must be 1.0.")

    const decision = textValue(item.targetDecision)
    const nextRule = gates.decisions[decision]
    if (!nextRule) throw new Error(`Unknown targetDecision: ${decision || "(missing)"}`)
    if (item.requiredClaimLevel !== nextRule.requiredClaimLevel) {
      throw new Error(`requiredClaimLevel must be ${nextRule.requiredClaimLevel} for targetDecision ${decision}.`)
    }
    if (!isClaimLevel(item.assertedClaimLevel)) throw new Error("assertedClaimLevel is missing or invalid.")

    const firstActor = Array.isArray(item.actors) ? objectValue(item.actors[0]) : null
    const rawChecks = objectValue(item.gateChecks) ?? {}
    const checks = Object.fromEntries(
      nextRule.requiredChecks.map((check) => {
        const supplied = rawChecks[check.id]
        return [check.id, isCheckState(supplied) ? supplied : "unknown"]
      }),
    ) as Record<string, CheckState>

    // Loading into the form is deliberately forgiving (an agent may hand over a draft for a
    // person to finish), but say what the shared gate would reject rather than coerce it away.
    const problems = claimSchema ? evaluateClaim(input, gates, claimSchema).structuralErrors : []

    setState({
      project: textValue(item.project),
      decision,
      assertedClaim: item.assertedClaimLevel,
      intendedUse: textValue(item.intendedUse),
      workflowBoundary: textValue(item.workflowBoundary),
      workflowCompletion: textValue(item.workflowCompletion),
      downstreamHandoffs: listValue(item.downstreamHandoffs).join("\n"),
      movedBottleneck: textValue(item.movedBottleneck),
      unhappyPath: textValue(item.unhappyPath),
      actor: optionOrFallback(actorOptions, firstActor?.type, "unselected"),
      channel: optionOrFallback(channelOptions, firstActor?.interactionChannel, "unselected"),
      authority: textValue(item.authority),
      accountability: textValue(item.accountability),
      evidence: listValue(item.evidenceRefs).join("\n"),
      outcomeMeasure: textValue(item.outcomeMeasure),
      baseline: textValue(item.baseline),
      fullRelevantCostBoundary: textValue(item.fullRelevantCostBoundary),
      optionValue: textValue(item.optionValue),
      nextEvidence: textValue(item.nextEvidence),
      stopRule: textValue(item.stopRule),
      checks,
    })
    setLoaded(item)
    setHandoffMessage(
      problems.length
        ? `${source} loaded into the local form with ${problems.length} problem${problems.length === 1 ? "" : "s"} the gate would reject: ${problems.slice(0, 3).join("; ")}${problems.length > 3 ? "; …" : ""}. Fix them before relying on the result.`
        : `${source} loaded into the local form. Review or edit it before relying on the result.`,
    )
  }

  React.useEffect(() => {
    if (!gates) return
    const host = document.getElementById("claim-gate-root")
    if (host) host.dataset.claimGateReady = "true"

    const handleAgentLoad = (event: Event) => {
      const detail = (event as CustomEvent<{ claim?: unknown; requestId?: string }>).detail
      try {
        applyClaimRecord(detail?.claim ?? detail, "Agent-prepared claim record")
        window.dispatchEvent(new CustomEvent("aiov:claim-record-loaded", {
          detail: { requestId: detail?.requestId ?? null, accepted: true },
        }))
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        setHandoffMessage(`Could not load agent record: ${message}`)
        window.dispatchEvent(new CustomEvent("aiov:claim-record-loaded", {
          detail: { requestId: detail?.requestId ?? null, accepted: false, error: message },
        }))
      }
    }
    window.addEventListener("aiov:load-claim-record", handleAgentLoad)
    return () => {
      if (host) delete host.dataset.claimGateReady
      window.removeEventListener("aiov:load-claim-record", handleAgentLoad)
    }
  }, [gates])

  const rule = gates && state.decision ? gates.decisions[state.decision] : null

  function checksFor(decision: string) {
    if (!gates) return {}
    return Object.fromEntries(
      gates.decisions[decision].requiredChecks.map((check) => [check.id, "unknown"]),
    ) as Record<string, CheckState>
  }

  function updateDecision(decision: string) {
    if (!gates) return
    const next = gates.decisions[decision]
    setState((previous) => ({
      ...previous,
      decision,
      assertedClaim: next.requiredClaimLevel,
      checks: checksFor(decision),
    }))
  }

  async function loadSample(path: string, label: string) {
    try {
      const response = await fetch(path)
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      applyClaimRecord(await response.json(), label)
    } catch (error) {
      setHandoffMessage(`Could not load sample: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async function loadSoftwareOutcomePack() {
    if (!gates) return
    try {
      const response = await fetch("../templates/software-outcome-pack.json", { cache: "no-store" })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      const payload = await response.json() as SoftwareOutcomeTemplate
      const decision = payload.targetDecision || "measure-outcome"
      const next = gates.decisions[decision]
      if (!next) throw new Error(`Template targetDecision is not recognised: ${decision}`)
      if (payload.requiredClaimLevel && payload.requiredClaimLevel !== next.requiredClaimLevel) {
        throw new Error("Software Outcome template requiredClaimLevel does not match the published gate.")
      }
      const fields = payload.recommendedRecordFields ?? {}
      setState((previous) => ({
        ...previous,
        decision,
        assertedClaim: next.requiredClaimLevel,
        outcomeMeasure: textValue(fields.outcomeMeasure),
        baseline: textValue(fields.baseline),
        fullRelevantCostBoundary: textValue(fields.fullRelevantCostBoundary),
        nextEvidence: textValue(fields.nextEvidence),
        checks: checksFor(decision),
      }))
      setHandoffMessage("Canonical software Outcome pack loaded as a measurement plan. No actor was inferred and no required check was marked PASS automatically.")
    } catch (error) {
      setHandoffMessage(`Could not load software Outcome pack: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  function metadataGaps() {
    const gaps: string[] = []
    if (!state.project.trim()) gaps.push("Project / initiative is not named.")
    if (!state.intendedUse.trim()) gaps.push("Intended use is not defined.")
    if (state.actor === "unselected") gaps.push("Primary actor is not recorded.")
    if (!state.authority.trim()) gaps.push("Authority boundary is not recorded.")
    if (!state.accountability.trim()) gaps.push("Accountability / recourse is not recorded.")
    if (!state.nextEvidence.trim()) gaps.push("Next evidence is not recorded.")
    if (!state.stopRule.trim()) gaps.push("Stop rule is not recorded.")
    return gaps
  }

  const failed = rule?.requiredChecks.filter((check) => state.checks[check.id] === "fail") ?? []
  const unknown = rule?.requiredChecks.filter((check) => {
    const value = state.checks[check.id] ?? "unknown"
    return value !== "pass" && value !== "fail"
  }) ?? []
  const gaps = metadataGaps()
  const claimMismatch = Boolean(rule && state.assertedClaim !== rule.requiredClaimLevel)
  // Once the form is complete, its verdict is the shared gate's verdict for the exported record.
  const gate = gates && claimSchema && rule && !gaps.length ? evaluateClaim(record(), gates, claimSchema) : null
  const status = loadError
    ? "TOOL_ERROR"
    : formVerdict({
        failedCount: failed.length,
        unknownCount: unknown.length,
        gapCount: gaps.length,
        claimMismatch,
        hasRule: Boolean(rule),
        gateStatus: gate?.status ?? null,
      })

  const isUntouched = !state.project.trim()
    && !state.intendedUse.trim()
    && state.actor === "unselected"
    && !state.authority.trim()
    && !state.accountability.trim()
    && Object.values(state.checks).every((value) => value === "unknown")

  const reasons = [
    ...failed.map((check) => `Failed: ${check.label}`),
    ...unknown.map((check) => {
      const value = state.checks[check.id] ?? "unknown"
      return value === "not-applicable"
        ? `Required evidence marked not applicable: ${check.label}`
        : `Missing/unknown evidence: ${check.label}`
    }),
    ...gaps,
    ...(gate?.structuralErrors ?? []).map((error) => `Record problem: ${error}`),
    ...(claimMismatch && rule
      ? [`The asserted claim (${claimLabels[state.assertedClaim]}) does not match the claim required by this target decision (${claimLabels[rule.requiredClaimLevel]}).`]
      : []),
  ]
  if (!reasons.length && status === "PASS") reasons.push("All required checks and decision-record fields are present.")

  function formRecord() {
    if (!rule) return null
    const actors = state.actor === "unselected"
      ? []
      : [{
          type: state.actor,
          role: DEFAULT_ACTOR_ROLE,
          ...(state.channel === "unselected" ? {} : { interactionChannel: state.channel }),
        }]
    return {
      $schema: new URL("../schemas/v1/claim.schema.json", window.location.href).href,
      schemaVersion: "1.0",
      project: state.project.trim(),
      targetDecision: state.decision,
      requiredClaimLevel: rule.requiredClaimLevel,
      assertedClaimLevel: state.assertedClaim,
      intendedUse: state.intendedUse.trim(),
      workflowBoundary: state.workflowBoundary.trim(),
      workflowCompletion: state.workflowCompletion.trim(),
      downstreamHandoffs: lines(state.downstreamHandoffs),
      movedBottleneck: state.movedBottleneck.trim(),
      unhappyPath: state.unhappyPath.trim(),
      actors,
      authority: state.authority.trim(),
      accountability: state.accountability.trim(),
      evidenceRefs: lines(state.evidence),
      outcomeMeasure: state.outcomeMeasure.trim(),
      baseline: state.baseline.trim(),
      fullRelevantCostBoundary: state.fullRelevantCostBoundary.trim(),
      optionValue: state.optionValue.trim(),
      gateChecks: state.checks,
      nextEvidence: state.nextEvidence.trim(),
      stopRule: state.stopRule.trim(),
    }
  }

  function record() {
    const item = formRecord()
    if (!item) return null
    const actor = state.actor === "unselected"
      ? null
      : { type: state.actor, ...(state.channel === "unselected" ? {} : { interactionChannel: state.channel }) }
    return exportClaimRecord(loaded, item, actor)
  }

  function markdownSummary() {
    const item = formRecord()
    if (!item || !rule) return ""
    const rows = rule.requiredChecks
      .map((check) => `- **${(item.gateChecks[check.id] || "unknown").toUpperCase()}** — ${check.label}`)
      .join("\n")
    return `# AI Output to Value — decision gate\n\n**Project:** ${item.project || "(not supplied)"}\n\n**Target decision:** ${rule.label}\n\n**Required claim:** ${claimLabels[item.requiredClaimLevel]}\n\n**Asserted claim:** ${claimLabels[item.assertedClaimLevel]}\n\n**Gate status:** ${status.replaceAll("_", " ")}\n\n> Gate status evaluates this scoped decision record only. It is not an audit of the underlying system or evidence and not a project maturity status.\n\n## Intended use\n\n${item.intendedUse || "(not supplied)"}\n\n## Workflow boundary\n\n**Start / boundary:** ${item.workflowBoundary || "(not supplied)"}\n\n**What counts as complete:** ${item.workflowCompletion || "(not supplied)"}\n\n**Downstream handoffs:**\n${item.downstreamHandoffs.length ? item.downstreamHandoffs.map((x) => `- ${x}`).join("\n") : "(none supplied)"}\n\n**Where could the bottleneck move?** ${item.movedBottleneck || "(not supplied)"}\n\n**Unhappy path:** ${item.unhappyPath || "(not supplied)"}\n\n## Measurement\n\n**Outcome measure:** ${item.outcomeMeasure || "(not supplied)"}\n\n**Baseline:** ${item.baseline || "(not supplied)"}\n\n**Full relevant cost boundary:** ${item.fullRelevantCostBoundary || "(not supplied)"}\n\n**Option / learning value:** ${item.optionValue || "(not supplied)"}\n\n## Required checks\n\n${rows}\n\n## Authority\n\n${item.authority || "(not supplied)"}\n\n## Accountability / recourse\n\n${item.accountability || "(not supplied)"}\n\n## Evidence references\n\n${item.evidenceRefs.length ? item.evidenceRefs.map((x) => `- ${x}`).join("\n") : "(none supplied)"}\n\n## Next evidence\n\n${item.nextEvidence || "(not supplied)"}\n\n## Stop rule\n\n${item.stopRule || "(not supplied)"}\n`
  }

  async function copyMarkdown() {
    try {
      await copyText(markdownSummary())
      setHandoffMessage("Decision record Markdown copied.")
    } catch (error) {
      setHandoffMessage(`Could not copy Markdown: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async function copyJson() {
    const item = record()
    if (!item) return
    try {
      await copyText(JSON.stringify(item, null, 2))
      setHandoffMessage("Current claim.json copied. It can be passed to an AI/MCP client or another person without changing the gate semantics.")
    } catch (error) {
      setHandoffMessage(`Could not copy claim.json: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  async function importJsonFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      applyClaimRecord(JSON.parse(await file.text()), file.name)
    } catch (error) {
      setHandoffMessage(`Could not import ${file.name}: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      event.target.value = ""
    }
  }

  function downloadJson() {
    const item = record()
    if (!item) return
    const blob = new Blob([JSON.stringify(item, null, 2)], { type: "application/json" })
    const href = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = href
    link.download = `${state.project.trim() || "claim"}.claim.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(href), 1000)
  }

  const decisionOptions = gates
    ? Object.entries(gates.decisions).map(([value, item]) => ({ value, label: `${item.label} — ${claimLabels[item.requiredClaimLevel]}` }))
    : []
  const actorLabel = optionLabel(actorOptions, state.actor)
  const channelLabel = optionLabel(channelOptions, state.channel)
  const workflowValues = [state.workflowBoundary, state.workflowCompletion, state.downstreamHandoffs, state.movedBottleneck, state.unhappyPath]
  const measurementValues = [state.outcomeMeasure, state.baseline, state.fullRelevantCostBoundary, state.optionValue]

  return (
    <main className="aiov-gate-root">
      <section className="aiov-print-summary" aria-label="Printable decision record">
        <header className="aiov-print-header">
          <p className="aiov-print-kicker">AI Output to Value · Decision record · Working preview</p>
          <h1 className="aiov-print-title">{state.project.trim() || "Unnamed initiative"}</h1>
          <p className="aiov-print-meta">
            {rule?.label || "Decision not selected"} · Required claim: {rule ? claimLabels[rule.requiredClaimLevel] : "Not available"}
          </p>
        </header>

        <div className="aiov-print-status">
          <strong>{status.replaceAll("_", " ")}</strong>
          <p>
            {status === "PASS"
              ? "Record complete for this decision. Not an audit of the underlying system. Not a project-wide maturity status."
              : "This gate evaluates only this scoped decision record; it does not independently verify the underlying facts or rate the whole project."}
          </p>
        </div>

        <dl className="aiov-print-grid">
          <PrintField label="Target decision" value={rule?.label || "Not supplied"} />
          <PrintField label="Required claim" value={rule ? claimLabels[rule.requiredClaimLevel] : "Not available"} />
          <PrintField label="Asserted claim" value={claimLabels[state.assertedClaim]} />
          <PrintField label="Primary actor / channel" value={`${actorLabel} · ${channelLabel}`} />
        </dl>

        <section className="aiov-print-section">
          <h2>Intended use</h2>
          <p className="aiov-print-value">{state.intendedUse.trim() || "Not supplied"}</p>
        </section>

        {workflowValues.some((value) => value.trim()) ? (
          <section className="aiov-print-section">
            <h2>Workflow boundary</h2>
            <dl className="aiov-print-grid">
              <PrintField label="Starts / boundary" value={state.workflowBoundary.trim() || "Not supplied"} />
              <PrintField label="What counts as complete" value={state.workflowCompletion.trim() || "Not supplied"} />
              <PrintField label="Possible moved bottleneck" value={state.movedBottleneck.trim() || "Not supplied"} />
              <PrintField label="Unhappy path / recovery" value={state.unhappyPath.trim() || "Not supplied"} />
            </dl>
            {lines(state.downstreamHandoffs).length ? (
              <div className="aiov-print-field">
                <div className="aiov-print-label">Downstream handoffs / verification / integration / operation / support</div>
                <ul>{lines(state.downstreamHandoffs).map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </section>
        ) : null}

        {measurementValues.some((value) => value.trim()) ? (
          <section className="aiov-print-section aiov-print-long">
            <h2>Measurement and economics</h2>
            <dl className="aiov-print-grid">
              <PrintField label="Outcome measure" value={state.outcomeMeasure.trim() || "Not supplied"} />
              <PrintField label="Baseline / comparison" value={state.baseline.trim() || "Not supplied"} />
              <PrintField label="Full relevant cost boundary" value={state.fullRelevantCostBoundary.trim() || "Not supplied"} />
              <PrintField label="Option / learning value" value={state.optionValue.trim() || "Not supplied"} />
            </dl>
          </section>
        ) : null}

        <section className="aiov-print-section">
          <h2>Required checks</h2>
          {rule?.requiredChecks.map((check) => (
            <div className="aiov-print-check" key={check.id}>
              <span>{check.label}</span>
              <strong>{(state.checks[check.id] || "unknown").replaceAll("-", " ").toUpperCase()}</strong>
            </div>
          ))}
        </section>

        {status !== "PASS" && !isUntouched && reasons.length ? (
          <section className="aiov-print-section aiov-print-long">
            <h2>Why this decision is not established</h2>
            <ul>{reasons.map((reason) => <li key={reason}>{reason}</li>)}</ul>
          </section>
        ) : null}

        <section className="aiov-print-section">
          <h2>Authority and accountability</h2>
          <dl className="aiov-print-grid">
            <PrintField label="Authority boundary" value={state.authority.trim() || "Not supplied"} />
            <PrintField label="Accountability / recourse" value={state.accountability.trim() || "Not supplied"} />
          </dl>
        </section>

        {lines(state.evidence).length ? (
          <section className="aiov-print-section aiov-print-long">
            <h2>Evidence references</h2>
            <ul>{lines(state.evidence).map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        ) : null}

        <section className="aiov-print-section">
          <h2>Next decision</h2>
          <dl className="aiov-print-grid">
            <PrintField label="Next evidence that would change this decision" value={state.nextEvidence.trim() || "Not supplied"} />
            <PrintField label="Stop rule" value={state.stopRule.trim() || "Not supplied"} />
          </dl>
        </section>

        <footer className="aiov-print-footer">
          Generated from the AI Output to Value Claim Gate. Gate status evaluates the supplied scoped decision record only; it is not independent verification of the underlying system or evidence and not a project-wide maturity status.
        </footer>
      </section>

      <div className="mb-8 max-w-3xl">
        <Badge className="mb-3">Interactive decision tool</Badge>
        <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">Claim gate</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the decision you are trying to make. The target decision selects the minimum claim and required checks. <strong className="text-foreground">This is a stop rule, not a maturity score.</strong> Every result applies only to the named decision, intended use, and assessed subject/scope—not to the project as a whole.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">The evaluator is actor-neutral: human, AI, automated and hybrid work use the same gate for the same intended decision.</p>
        <p className="mt-2 text-sm text-muted-foreground"><strong className="text-foreground">Gate ≠ truth.</strong> A PASS means the supplied record is complete for this decision. It is not an audit of the underlying system, measurement, or evidence, and it is never a project-wide maturity status.</p>
      </div>

      <Card className="mb-6 border-primary/25 bg-card">
        <CardHeader>
          <CardTitle>Learn the gate from a filled example</CardTitle>
          <CardDescription>Three fictional teaching cases show PASS and BLOCKED without requiring you to start from an empty compliance form.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {samples.map((sample) => (
            <button
              key={sample.path}
              type="button"
              className="rounded-lg border border-border bg-background p-4 text-left transition-colors hover:bg-accent"
              onClick={() => void loadSample(sample.path, sample.label)}
            >
              <strong className="block text-sm">{sample.label}</strong>
              <span className="mt-1 block text-xs text-muted-foreground">{sample.note}</span>
            </button>
          ))}
        </CardContent>
      </Card>

      <div className="mb-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <Badge variant="outline">Human</Badge>
          <h2 className="mt-3 font-semibold">Use the visible form</h2>
          <p className="mt-1 text-sm text-muted-foreground">Complete or edit the record directly, then copy Markdown, export JSON, or print it.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <Badge variant="outline">AI</Badge>
          <h2 className="mt-3 font-semibold">Use the same gate as a tool</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browser agents can call <code>aiov_evaluate_claim_record</code> through WebMCP. Native MCP clients can call <code>evaluate_claim_record</code>.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <Badge variant="outline">Hybrid</Badge>
          <h2 className="mt-3 font-semibold">Hand off the same claim.json</h2>
          <p className="mt-1 text-sm text-muted-foreground">Import an agent-prepared record, or let a compatible browser agent request a local form handoff. The visible form remains the confirmation surface.</p>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2" data-aiov-interactive-only>
        <input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => void importJsonFile(event)} />
        <Button size="sm" variant="outline" onClick={() => importRef.current?.click()}>Import claim.json</Button>
        <Button size="sm" variant="outline" onClick={() => void copyJson()} disabled={!rule}>Copy claim.json</Button>
        <Button size="sm" variant="secondary" onClick={() => void loadSoftwareOutcomePack()} disabled={!gates}>Load software Outcome pack</Button>
        {handoffMessage ? <span className="text-sm text-muted-foreground" aria-live="polite">{handoffMessage}</span> : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Card>
          <CardHeader>
            <CardTitle>Decision record</CardTitle>
            <CardDescription>Record the decision, intended use, and assessed subject/scope before interpreting any claim result.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            <Field label="Assessed subject / project">
              <Input value={state.project} onChange={(event) => setState({ ...state, project: event.target.value })} placeholder="e.g. auto-triage-bot" />
            </Field>
            <Field label="Decision sought">
              <NativeFieldSelect value={state.decision} options={decisionOptions} onChange={updateDecision} ariaLabel="Decision sought" />
            </Field>
            <Field label="Claim being asserted">
              <NativeFieldSelect value={state.assertedClaim} options={claimOptions} onChange={(value) => setState({ ...state, assertedClaim: value as ClaimLevel })} ariaLabel="Claim being asserted" />
            </Field>
            <Field label="Primary actor">
              <NativeFieldSelect value={state.actor} options={actorOptions} onChange={(value) => setState({ ...state, actor: value })} ariaLabel="Primary actor" />
            </Field>
            <Field label="Interaction channel">
              <NativeFieldSelect value={state.channel} options={channelOptions} onChange={(value) => setState({ ...state, channel: value })} ariaLabel="Interaction channel" />
            </Field>
            <Field label="Intended use" full>
              <Textarea value={state.intendedUse} onChange={(event) => setState({ ...state, intendedUse: event.target.value })} placeholder="What will someone rely on this for?" />
            </Field>

            <div className="md:col-span-2 mt-2 rounded-lg border border-border bg-muted/30 p-4">
              <h2 className="text-lg font-semibold">Subject / scope and workflow boundary <span className="text-sm font-normal text-muted-foreground">(not another gate score)</span></h2>
              <p className="mt-1 text-sm text-muted-foreground">Make the assessed scope explicit: version/environment/users as relevant, plus the end-to-end process when local task or product completion is not the same as business delivery. For Operating capability, ask “Operating capability for what repeated use?”</p>
            </div>
            <Field label="Where does the workflow start?" full>
              <Textarea value={state.workflowBoundary} onChange={(event) => setState({ ...state, workflowBoundary: event.target.value })} placeholder="Trigger, request, input, customer need, incident, order…" />
            </Field>
            <Field label="What counts as actually complete?" full>
              <Textarea value={state.workflowCompletion} onChange={(event) => setState({ ...state, workflowCompletion: event.target.value })} placeholder="Describe the accepted end state, not only the local artefact or task." />
            </Field>
            <Field label="Downstream handoffs / verification / integration / operation / support" full>
              <Textarea value={state.downstreamHandoffs} onChange={(event) => setState({ ...state, downstreamHandoffs: event.target.value })} placeholder="One downstream step per line." />
            </Field>
            <Field label="Where could the bottleneck move?" full>
              <Textarea value={state.movedBottleneck} onChange={(event) => setState({ ...state, movedBottleneck: event.target.value })} placeholder="If this task becomes much faster, which downstream constraint may become dominant?" />
            </Field>
            <Field label="Unhappy path / escalation / stop / reversal / recovery" full>
              <Textarea value={state.unhappyPath} onChange={(event) => setState({ ...state, unhappyPath: event.target.value })} placeholder="What happens with missing information, ambiguity, dependency failure, refusal, timeout, or an action that must be reversed?" />
            </Field>

            <div className="md:col-span-2 mt-2 rounded-lg border border-border bg-muted/30 p-4">
              <h2 className="text-lg font-semibold">Measurement and economics</h2>
              <p className="mt-1 text-sm text-muted-foreground">These fields become especially important for Outcome and Value decisions. Use the <a className="underline underline-offset-4" href="../templates/outcome-worksheet.md" target="_blank" rel="noreferrer">Outcome worksheet</a> for baseline/after, confounds, adverse effects and attribution, and the <a className="underline underline-offset-4" href="../templates/value-cost-ledger.md" target="_blank" rel="noreferrer">Value cost ledger</a> for labour movement, elapsed time, full cost, alternatives and option value. The software pack supplies a plan, not evidence; none of these instruments auto-populates PASS.</p>
            </div>
            <Field label="Outcome measure" full>
              <Textarea value={state.outcomeMeasure} onChange={(event) => setState({ ...state, outcomeMeasure: event.target.value })} placeholder="What meaningful result should change?" />
            </Field>
            <Field label="Baseline / comparison" full>
              <Textarea value={state.baseline} onChange={(event) => setState({ ...state, baseline: event.target.value })} placeholder="What is the comparable baseline or counterfactual?" />
            </Field>
            <Field label="Full relevant cost boundary" full>
              <Textarea value={state.fullRelevantCostBoundary} onChange={(event) => setState({ ...state, fullRelevantCostBoundary: event.target.value })} placeholder="Which generation, review, integration, operation, support, incident, and other relevant costs count?" />
            </Field>
            <Field label="Option / learning value" full>
              <Textarea value={state.optionValue} onChange={(event) => setState({ ...state, optionValue: event.target.value })} placeholder="What useful uncertainty was removed even if the work does not become operational?" />
            </Field>

            <Field label="Authority boundary" full>
              <Textarea value={state.authority} onChange={(event) => setState({ ...state, authority: event.target.value })} placeholder="What may this actor recommend, change, send, spend, approve or commit?" />
            </Field>
            <Field label="Accountability / recourse" full>
              <Textarea value={state.accountability} onChange={(event) => setState({ ...state, accountability: event.target.value })} placeholder="Which organisational or legal party must answer for failures and provide correction?" />
            </Field>
            <Field label="Evidence references" full>
              <Textarea value={state.evidence} onChange={(event) => setState({ ...state, evidence: event.target.value })} placeholder="One reference per line: eval result, test run, incident record, source, measurement…" />
            </Field>
            <Field label="Next evidence that would change the decision" full>
              <Textarea value={state.nextEvidence} onChange={(event) => setState({ ...state, nextEvidence: event.target.value })} />
            </Field>
            <Field label="Stop rule" full>
              <Textarea value={state.stopRule} onChange={(event) => setState({ ...state, stopRule: event.target.value })} placeholder="What result, date, cost or risk threshold makes you stop or restrict the work?" />
            </Field>

            <div className="md:col-span-2 mt-2">
              <h2 className="text-xl font-semibold">Required checks</h2>
              <p className="mt-1 text-sm text-muted-foreground">{rule?.description ?? "Loading gate rules…"}</p>
              <div className="mt-4 divide-y divide-border rounded-lg border border-border">
                {rule?.requiredChecks.map((check) => (
                  <div key={check.id} className="grid gap-3 p-4 md:grid-cols-[minmax(0,1fr)_13rem] md:items-center">
                    <Label>{check.label}</Label>
                    <NativeFieldSelect
                      value={state.checks[check.id] ?? "unknown"}
                      options={checkOptions}
                      onChange={(value) => setState({ ...state, checks: { ...state.checks, [check.id]: value as CheckState } })}
                      ariaLabel={check.label}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit lg:sticky lg:top-24" aria-live="polite">
          <CardHeader>
            <Badge>Decision gate</Badge>
            <CardTitle>{rule ? `Required claim: ${claimLabels[rule.requiredClaimLevel]}` : "Required claim"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "rounded-lg px-4 py-3",
                status === "PASS" && "bg-emerald-50 text-emerald-800",
                status === "BLOCKED" && "bg-red-50 text-red-800",
                status === "INSUFFICIENT_EVIDENCE" && "bg-amber-50 text-amber-800",
                status === "TOOL_ERROR" && "bg-red-50 text-red-800",
              )}
            >
              <div className="text-sm font-bold">{status.replaceAll("_", " ")}</div>
              <div className="mt-1 text-xs font-medium">
                {status === "PASS"
                  ? "Record complete for this decision. Not an audit of the underlying system."
                  : "This gate evaluates the supplied record; it does not independently verify the underlying facts."}
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              {loadError
                ? loadError
                : isUntouched
                  ? "Nothing is wrong. This decision is not justified yet. Load a filled example, or complete only the fields this decision actually requires."
                  : status === "PASS"
                    ? `The supplied record satisfies every check required for ${rule?.label} for the named intended use and scope; it does not rate the whole project.`
                    : status === "BLOCKED"
                      ? "At least one decision-critical check explicitly failed. Strength at other claim levels does not offset it."
                      : "No decision-critical check is recorded as failed, but the record is not sufficient to justify this decision."}
            </p>
            {!isUntouched ? (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
                {reasons.map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            ) : null}
            {state.nextEvidence.trim() ? (
              <div className="mt-4 rounded-md border border-border bg-muted/40 p-3 text-sm">
                <strong className="block">Next evidence that would change this decision</strong>
                <span className="mt-1 block text-muted-foreground">{state.nextEvidence}</span>
              </div>
            ) : null}
            <p className="mt-4 text-sm text-muted-foreground">Strong Access or Output cannot compensate for a failed decision-critical check. Gate status belongs to this decision record, not to the project as a whole.</p>
            <div className="mt-5 flex flex-wrap gap-2" data-aiov-interactive-only>
              <Button size="sm" onClick={() => void copyMarkdown()}>Copy Markdown</Button>
              <Button size="sm" variant="outline" onClick={downloadJson}>Download JSON</Button>
              <Button size="sm" variant="outline" disabled={isUntouched || !rule} onClick={() => window.print()}>Print decision record</Button>
            </div>
            <p className="mt-5 text-xs text-muted-foreground">
              <a className="underline" href="../schemas/v1/claim.schema.json">claim.schema.json</a> · {" "}
              <a className="underline" href="../schemas/v1/decision-gates.json">gate rules</a> · {" "}
              <a className="underline" href="../templates/software-outcome-pack.json">software Outcome pack</a> · {" "}
              <a className="underline" href="../downloads/ai-output-to-value-private-workbook.zip">private workbook</a>
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
