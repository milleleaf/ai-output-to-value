// The claim.json the Claim Gate page exports.
//
// The form edits only some of a record's fields, and only the first actor's type and channel.
// A loaded record is the base: fields the form does not edit, every other actor and the first
// actor's role pass through unchanged, so importing a record and exporting it again gives back
// the same record. Without a base (a form filled from scratch) the export is the form alone.

export const DEFAULT_ACTOR_ROLE = "Primary actor for the assessed workflow"

type Json = Record<string, unknown>
export type FormActor = { type: string; interactionChannel?: string } | null

function isEmpty(value: unknown) {
  return value === "" || (Array.isArray(value) && value.length === 0)
}

function objectOrNull(value: unknown): Json | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Json : null
}

export function exportClaimRecord(base: Json | null, fromForm: Json, actor: FormActor): Json {
  const out: Json = { ...(base ?? {}) }
  for (const [key, value] of Object.entries(fromForm)) {
    // Keep the loaded record's own schema URL, and don't add empty fields it never had.
    if (base && key === "$schema" && "$schema" in base) continue
    if (base && !(key in base) && isEmpty(value)) continue
    out[key] = value
  }

  const baseActors = base && Array.isArray(base.actors) ? base.actors : []
  const rest = baseActors.slice(1)
  if (!actor) {
    out.actors = rest
  } else {
    const first: Json = { ...(objectOrNull(baseActors[0]) ?? { role: DEFAULT_ACTOR_ROLE }), type: actor.type }
    if (actor.interactionChannel) first.interactionChannel = actor.interactionChannel
    else delete first.interactionChannel
    out.actors = [first, ...rest]
  }
  return out
}
