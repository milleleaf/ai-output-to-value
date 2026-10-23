// Round-trip every shipped sample claim, and a record with every optional field and three
// actors, through the built Claim Gate page in headless Chrome: load it, press Download JSON,
// and require the download to deep-equal the source record and the page status to equal the
// shared gate's status for it. Usage: node check-claim-roundtrip-browser.mjs [site dir]
// Chrome: $CHROME, else the usual install paths. Drives Chrome over CDP with Node's WebSocket.
import { deepStrictEqual } from "node:assert/strict"
import { spawn } from "node:child_process"
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"
import { pathToFileURL } from "node:url"

const root = path.resolve(import.meta.dirname, "../..")
const site = path.resolve(process.argv[2] ?? path.join(root, "site"))
const read = (file) => JSON.parse(readFileSync(file, "utf8"))
// The gate bundle the page itself ships, as check-gate-conformance.mjs uses.
const { evaluateClaim } = await import(pathToFileURL(path.join(site, "ui/gate-core.js")).href)
const gates = read(path.join(root, "schemas/v1/decision-gates.json"))
const schema = read(path.join(root, "schemas/v1/claim.schema.json"))

const sampleDir = path.join(root, "toolkit/samples")
const records = [
  ...readdirSync(sampleDir).filter((name) => name.endsWith(".claim.json")).sort().map((name) => path.join(sampleDir, name)),
  path.join(root, "tests/fixtures/claim-roundtrip-rich.claim.json"),
].map((file) => ({ name: path.relative(root, file), file, claim: read(file) }))

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml" }
const server = createServer((req, res) => {
  const file = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname))
  if (!file.startsWith(site) || !existsSync(file) || !file.includes(".")) return res.writeHead(404).end()
  res.writeHead(200, { "content-type": types[path.extname(file)] ?? "application/octet-stream" }).end(readFileSync(file))
})
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
const pageUrl = `http://127.0.0.1:${server.address().port}/tools/claim-gate.html`

const chrome = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome", "/usr/bin/google-chrome-stable", "/usr/bin/chromium", "/usr/bin/chromium-browser"].find((p) => p && existsSync(p))
if (!chrome) throw new Error("No Chrome found; set CHROME to its path.")
const profile = mkdtempSync(path.join(tmpdir(), "claim-roundtrip-"))
const browser = spawn(chrome, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`,
  "--no-first-run", "--no-default-browser-check", "--disable-extensions", "about:blank"], { stdio: ["ignore", "ignore", "pipe"] })
const wsUrl = await new Promise((resolve, reject) => {
  let log = ""
  browser.stderr.on("data", (chunk) => { log += chunk; const m = log.match(/ws:\/\/\S+/); if (m) resolve(m[0]) })
  browser.on("exit", (code) => reject(new Error(`Chrome exited (${code}): ${log}`)))
})

const ws = new WebSocket(wsUrl)
await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }))
let nextId = 0
const pending = new Map()
ws.addEventListener("message", (event) => {
  const msg = JSON.parse(event.data)
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id) }
})
const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
  const id = ++nextId
  pending.set(id, (msg) => msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result))
  ws.send(JSON.stringify({ id, method, params, sessionId }))
})

const { targetId } = await send("Target.createTarget", { url: "about:blank" })
const { sessionId } = await send("Target.attachToTarget", { targetId, flatten: true })
const page = (method, params) => send(method, params, sessionId)
async function evaluate(expression) {
  const { result, exceptionDetails } = await page("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })
  if (exceptionDetails) throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
  return result.value
}
const until = (condition) => evaluate(`new Promise((resolve, reject) => {
  const started = Date.now()
  const tick = () => { if (${condition}) resolve(true); else if (Date.now() - started > 15000) reject(new Error("timed out waiting for: " + ${JSON.stringify(condition)})); else setTimeout(tick, 50) }
  tick()
})`)

await page("Page.enable")
await page("Runtime.enable")
await page("DOM.enable")
const problems = []
try {
  for (const [index, { name, file, claim }] of records.entries()) {
    await page("Page.navigate", { url: pageUrl })
    await until(`document.getElementById("claim-gate-root")?.dataset.claimGateReady === "true"`)
    // Capture Download JSON's blob instead of saving a file.
    await evaluate(`(() => {
      const create = URL.createObjectURL
      URL.createObjectURL = (blob) => { window.__download = blob; return create.call(URL, blob) }
      HTMLAnchorElement.prototype.click = function () {}
    })()`)
    const source = path.basename(file)
    if (index % 2) {
      // Half the records go through the Import claim.json file picker, half through the agent hand-off.
      const { root: doc } = await page("DOM.getDocument")
      const { nodeId } = await page("DOM.querySelector", { nodeId: doc.nodeId, selector: 'input[type="file"]' })
      await page("DOM.setFileInputFiles", { nodeId, files: [file] })
    } else {
      await evaluate(`window.dispatchEvent(new CustomEvent("aiov:load-claim-record", { detail: { claim: ${JSON.stringify(claim)} } }))`)
    }
    await until(`document.body.innerText.includes("loaded into the local form")`)
    const result = await evaluate(`(async () => {
      [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Download JSON").click()
      return { text: await window.__download.text(), status: document.querySelector(".aiov-print-status strong").textContent }
    })()`)
    const expected = evaluateClaim(claim, gates, schema).status.replaceAll("_", " ")
    try {
      deepStrictEqual(JSON.parse(result.text), claim)
      deepStrictEqual(result.status, expected, "page status")
    } catch (error) {
      problems.push(`${name} (${index % 2 ? "file import" : "agent hand-off"} of ${source}): ${error.message.split("\n").slice(0, 12).join("\n")}`)
    }
  }
} finally {
  ws.close()
  const exited = new Promise((resolve) => browser.once("exit", resolve))
  browser.kill()
  await exited
  server.close()
  rmSync(profile, { recursive: true, force: true, maxRetries: 5 })
}

if (problems.length) {
  console.error(`Claim Gate browser round trip lost data for ${problems.length} of ${records.length} records:\n- ${problems.join("\n- ")}`)
  process.exit(1)
}
console.log(`Claim Gate browser round trip: all ${records.length} records exported unchanged, with the shared gate's status.`)
