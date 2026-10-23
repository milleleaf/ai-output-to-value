import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { render } from "takumi-pdf"
import { PdfcnThemeProvider } from "../src/components/pdf/theme-provider"
import { Text } from "../src/components/pdf/text/text"
import { Section } from "../src/components/pdf/section/section"
import { Stack } from "../src/components/pdf/stack/stack"
import { Badge } from "../src/components/pdf/badge/badge"
import { Divider } from "../src/components/pdf/divider/divider"

const questions = [
  "What exactly have we demonstrated?",
  "What did the AI know, and what did it infer?",
  "What remains before the intended use?",
  "What work disappeared or moved, and where does the bottleneck go next?",
  "Which actor or combination performs this task or decision best?",
  "Who decides, who is accountable, and who verifies, runs and supports it?",
  "Which business outcome are we trying to change?",
  "What evidence would justify the next decision, and when should we stop?",
]

const thresholds = [
  ["Explore", "Output", "Reproduce and learn."],
  ["Rely", "Deliverable", "Fit for named use."],
  ["Operate / sell", "Capability", "Owners, controls, fallback."],
  ["Measure change", "Outcome", "Measure moved vs baseline."],
  ["Scale / stop", "Value", "Outcome worth cost/risk."],
]

function MeetingBrief() {
  return (
    <PdfcnThemeProvider>
      <Stack gap="sm">
        <div tw="flex items-center justify-between">
          <Text>AI Output to Value — One-page meeting brief</Text>
          <Badge>Decision tool</Badge>
        </div>
        <Divider />

        <Section spacing="sm">
          <Text>Start with the decision, not the taxonomy</Text>
          <div tw="mt-1 flex flex-col gap-1">
            {thresholds.map(([decision, claim, evidence]) => (
              <div key={decision} tw="flex gap-2 rounded border border-gray-200 px-2 py-0.5">
                <Text>{decision}</Text>
                <Text>{claim}</Text>
                <Text>{evidence}</Text>
              </div>
            ))}
          </div>
          <Text>Do not average claims. A missing decision-critical claim is not offset by strength elsewhere.</Text>
          <Text>Workflow / management test: name the end-to-end boundary, bottleneck, unhappy path and outcome; define teamwork, KPI, productivity, leadership or alignment before using the term as evidence.</Text>
        </Section>

        <Section spacing="sm">
          <Text>Eight questions</Text>
          <div tw="mt-1 grid grid-cols-2 gap-x-4 gap-y-0">
            {questions.map((question, index) => (
              <Text key={question}>{index + 1}. {question}</Text>
            ))}
          </div>
        </Section>

        <Section spacing="sm">
          <Text>Decision record</Text>
          <div tw="mt-1 grid grid-cols-2 gap-x-4 gap-y-0">
            <Text>Established: __________________________</Text>
            <Text>Not established: ______________________</Text>
            <Text>Workflow / management terms: __________</Text>
            <Text>Actor / interface / authority: __________</Text>
            <Text>Accountability / recourse: _____________</Text>
            <Text>Next evidence / stop rule: _____________</Text>
          </div>
        </Section>
      </Stack>
    </PdfcnThemeProvider>
  )
}

const pdf = await render(<MeetingBrief />, {
  size: "a4",
  margin: { top: 18, right: 26, bottom: 18, left: 26 },
  tagged: true,
  lang: "en",
  metadata: {
    title: "AI Output to Value — One-page meeting brief",
    authors: ["Milleleaf"],
  },
})

const outputDir = resolve(process.cwd(), "../site/downloads")
await mkdir(outputDir, { recursive: true })
await writeFile(resolve(outputDir, "ai-output-to-value-meeting-brief.pdf"), pdf)
console.log("Generated site/downloads/ai-output-to-value-meeting-brief.pdf using pdfcn + Takumi")
