from __future__ import annotations

import json
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest import mock

REPO_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(REPO_ROOT / "scripts"))

from claim_gate import evaluate  # noqa: E402
import publish_toolkit_assets  # noqa: E402


class ToolkitSampleTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.gates = json.loads((REPO_ROOT / "schemas" / "v1" / "decision-gates.json").read_text(encoding="utf-8"))
        cls.samples = REPO_ROOT / "toolkit" / "samples"

    def evaluate_sample(self, name: str) -> dict:
        record = json.loads((self.samples / name).read_text(encoding="utf-8"))
        return evaluate(record, self.gates)

    def test_website_explore_passes(self):
        self.assertEqual(self.evaluate_sample("website-explore-pass.claim.json")["status"], "PASS")

    def test_same_website_operate_blocks(self):
        result = self.evaluate_sample("website-operate-blocked.claim.json")
        self.assertEqual(result["status"], "BLOCKED")
        self.assertTrue(any(item["id"] == "deliverable-gate-passed" for item in result["failedChecks"]))

    def test_internal_tool_rely_passes(self):
        self.assertEqual(self.evaluate_sample("internal-tool-rely-pass.claim.json")["status"], "PASS")

    def test_killed_idea_outcome_passes(self):
        self.assertEqual(self.evaluate_sample("killed-idea-outcome-pass.claim.json")["status"], "PASS")

    def test_cross_domain_false_promotion_pack_statuses(self):
        expected = {
            "customer-support-outcome-insufficient.claim.json": "INSUFFICIENT_EVIDENCE",
            "report-factory-rely-blocked.claim.json": "BLOCKED",
            "system-of-record-operate-blocked.claim.json": "BLOCKED",
            "professional-deliverable-rely-insufficient.claim.json": "INSUFFICIENT_EVIDENCE",
            "coding-assistant-outcome-pass.claim.json": "PASS",
            "time-saved-value-insufficient.claim.json": "INSUFFICIENT_EVIDENCE",
            "killed-idea-outcome-pass.claim.json": "PASS",
        }

        observed = {}
        for name, status in expected.items():
            with self.subTest(name=name):
                observed[name] = self.evaluate_sample(name)["status"]
                self.assertEqual(observed[name], status)

        self.assertEqual(set(observed.values()), {"PASS", "BLOCKED", "INSUFFICIENT_EVIDENCE"})

    def test_cross_domain_pack_preserves_key_claim_boundaries(self):
        report = json.loads((self.samples / "report-factory-rely-blocked.claim.json").read_text(encoding="utf-8"))
        self.assertEqual(report["assertedClaimLevel"], "02-output")
        self.assertEqual(report["requiredClaimLevel"], "03-deliverable")
        report_result = self.evaluate_sample("report-factory-rely-blocked.claim.json")
        self.assertTrue(any(item["id"] == "acceptance-criteria-met" for item in report_result["failedChecks"]))

        time_saved = json.loads((self.samples / "time-saved-value-insufficient.claim.json").read_text(encoding="utf-8"))
        self.assertEqual(time_saved["assertedClaimLevel"], "05-outcome")
        self.assertEqual(time_saved["requiredClaimLevel"], "06-value")

        professional = json.loads((self.samples / "professional-deliverable-rely-insufficient.claim.json").read_text(encoding="utf-8"))
        self.assertIn("does not establish", professional["authority"].lower())
        self.assertEqual(self.evaluate_sample("professional-deliverable-rely-insufficient.claim.json")["status"], "INSUFFICIENT_EVIDENCE")

        killed = json.loads((self.samples / "killed-idea-outcome-pass.claim.json").read_text(encoding="utf-8"))
        self.assertEqual(killed["requiredClaimLevel"], "05-outcome")
        self.assertEqual(self.evaluate_sample("killed-idea-outcome-pass.claim.json")["status"], "PASS")

    def test_software_outcome_pack_is_a_plan_not_a_pass_record(self):
        pack = json.loads((REPO_ROOT / "toolkit" / "templates" / "software-outcome-pack.json").read_text(encoding="utf-8"))
        self.assertEqual(pack["targetDecision"], "measure-outcome")
        self.assertIn("change lead time", pack["throughputMetrics"])
        self.assertIn("deployment rework rate", pack["instabilityMetrics"])
        self.assertNotIn("gateChecks", pack)

    def test_outcome_and_value_instruments_cover_decision_boundaries(self):
        outcome = (REPO_ROOT / "toolkit" / "templates" / "outcome-worksheet.md").read_text(encoding="utf-8")
        value = (REPO_ROOT / "toolkit" / "value-cost-ledger.md").read_text(encoding="utf-8")

        for phrase in (
            "Decision / intervention being assessed",
            "Baseline and comparison",
            "Elapsed time",
            "Labour hours",
            "Material confounders",
            "Adverse effects / quality regressions",
            "Attribution strength / qualification",
            "Result that would reverse",
            "Outcome without Value",
            "What we predicted before the trial",
            "What we measured",
        ):
            with self.subTest(instrument="outcome", phrase=phrase):
                self.assertIn(phrase, outcome)

        for phrase in (
            "Labour displaced / removed",
            "Labour moved into review / checking",
            "Model / API / tool / vendor cost",
            "Infrastructure",
            "Testing / evaluation / assurance / security",
            "Incident / error / risk cost",
            "Opportunity cost / alternative not taken",
            "Option value of information",
            "positive option value from stopping a bad idea",
            "Attribution qualification",
        ):
            with self.subTest(instrument="value", phrase=phrase):
                self.assertIn(phrase, value)

    def test_decision_register_is_one_row_per_decision(self):
        register = (REPO_ROOT / "toolkit" / "templates" / "decision-register.md").read_text(encoding="utf-8")
        for column in (
            "Decision",
            "Intended use",
            "Subject / scope",
            "Required claim",
            "Status",
            "Owner",
            "Next evidence",
            "Stop date",
        ):
            self.assertIn(column, register)
        self.assertIn("PASS", register)
        self.assertIn("BLOCKED", register)
        self.assertIn("INSUFFICIENT EVIDENCE", register)
        self.assertIn("The register is not a maturity score.", register)
        self.assertIn("Do not average the rows.", register)
        self.assertIn('Do not report a count such as "3 of 6."', register)

    def test_private_workbook_contains_core_files(self):
        workbook = REPO_ROOT / "toolkit" / "private-workbook"
        for relative in ("README.md", "decision.md", "claim.json", "evidence/README.md"):
            self.assertTrue((workbook / relative).is_file(), relative)

    def test_published_workbook_carries_the_decision_register(self):
        # The workbook is downloaded on its own, so the register must travel inside it.
        with tempfile.TemporaryDirectory() as site, mock.patch.object(publish_toolkit_assets, "SITE", Path(site)):
            publish_toolkit_assets.main()
            downloads = Path(site) / "downloads"
            self.assertTrue((downloads / "private-workbook" / "decision-register.md").is_file())
            with zipfile.ZipFile(downloads / "ai-output-to-value-private-workbook.zip") as archive:
                self.assertIn("decision-register.md", archive.namelist())


class SampleCountDocumentationTests(unittest.TestCase):
    """The READMEs state how many sample records ship; keep that in step with the folder."""

    WORDS = {n: w for n, w in enumerate("zero one two three four five six seven eight nine ten eleven twelve".split())}

    def test_readmes_state_the_number_of_sample_records(self):
        root = Path(__file__).resolve().parents[1]
        count = len(list((root / "toolkit" / "samples").glob("*.claim.json")))
        stated = f"{self.WORDS.get(count, count)} fictional `claim.json` records"
        for readme in ("README.md", "toolkit/README.md"):
            with self.subTest(readme=readme):
                self.assertIn(stated, (root / readme).read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
