import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


class DecisionScopedClaimsTests(unittest.TestCase):
    def test_core_guide_rejects_project_wide_claim_ladder(self):
        start = read("START-HERE.md")
        self.assertIn("Do not assign one claim-level status to an entire project", start)
        self.assertIn("Output: strong; Deliverable: almost; Operating capability: not yet", start)
        self.assertIn("## Same project, different decisions", start)
        self.assertIn("not three statuses for the project", start)
        self.assertIn("Repository stars, forks, downloads, mentions, or user counts", start)

    def test_human_review_surfaces_require_decision_use_and_scope(self):
        meeting = read("content/meeting-brief.md")
        card = read("content/claim-card.md")
        for source in (meeting, card):
            self.assertIn("Subject / scope", source)
            self.assertIn("Operating capability for what?", source)
            self.assertIn("adoption/reach", source)
        self.assertIn("six project statuses", card)
        self.assertIn("same project", card.lower())
        self.assertIn("INSUFFICIENT EVIDENCE", card)
        self.assertIn("BLOCKED", card)

    def test_agent_surfaces_prohibit_project_wide_ratings(self):
        rules = read("toolkit/AGENT_RULES.md")
        skill = read("toolkit/skills/applying-ai-output-to-value/SKILL.md")
        for source in (rules, skill):
            self.assertIn("Never assign one claim-level status to an entire project", source)
            self.assertIn("subject/scope", source.lower())
            self.assertIn("Operating capability for what", source)
            self.assertIn("adoption/reach", source)
        self.assertIn("descriptive inventory", rules)
        self.assertIn("descriptive inventory", skill)
        self.assertIn("universal checklist", rules)
        self.assertIn("universal checklist", skill)

    def test_claim_gate_results_are_scoped_to_decision_record(self):
        app = read("web/src/components/claim-gate-app.tsx")
        fallback = read("tools/claim-gate.html")
        self.assertIn("project-wide maturity status", app)
        self.assertIn("Gate status belongs to this decision record", app)
        self.assertIn("named intended use and scope", app)
        self.assertIn("Do not assign six statuses to one project", fallback)
        self.assertIn("same project can PASS an exploration decision", fallback)

    def test_release_support_is_the_public_case_corpus(self):
        release = read("docs/first-reviewed-release.md")
        self.assertIn("data/public-case-corpus.yml", release)
        self.assertIn("A row is a published result.", release)
        self.assertNotIn("non-technical sponsor", release)


if __name__ == "__main__":
    unittest.main()
