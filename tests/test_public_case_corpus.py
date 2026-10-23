from __future__ import annotations

import sys
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from publication_data import claims, source_map  # noqa: E402

CORPUS_PATH = ROOT / "data" / "public-case-corpus.yml"
SENTINEL = "not recorded in the registered source or claim text"
CLAIM_LEVELS = (
    "01-access",
    "02-output",
    "03-deliverable",
    "04-capability",
    "05-outcome",
    "06-value",
)
REQUIRED_SOURCE_IDS = {
    "metr-early-2025-experienced-os-developers",
    "microsoft-github-copilot-controlled-experiment",
    "noy-zhang-writing-rct-science-2023",
    "dellacqua-jagged-frontier-consultants",
    "brynjolfsson-li-raymond-generative-ai-at-work",
    "dora-software-delivery-performance-metrics",
}
COPIED_FIELDS = ("source_version", "locator", "relevant_finding", "qualification")


def load_corpus() -> list[dict]:
    data = yaml.safe_load(CORPUS_PATH.read_text(encoding="utf-8"))
    cases = data.get("public_cases") if isinstance(data, dict) else None
    if not isinstance(cases, list):
        raise AssertionError("data/public-case-corpus.yml: public_cases must be a list")
    return cases


class PublicCaseCorpusTests(unittest.TestCase):
    def setUp(self):
        self.cases = load_corpus()
        self.sources = source_map(ROOT)
        self.claims = {claim["id"]: claim for claim in claims(ROOT) if claim.get("id")}

    def test_corpus_is_not_a_second_claim_or_source_registry(self):
        data = yaml.safe_load(CORPUS_PATH.read_text(encoding="utf-8"))
        self.assertNotIn("claims", data)
        self.assertNotIn("sources", data)

    def test_required_public_sources_are_present_once(self):
        seen: list[str] = []
        ids: list[str] = []
        for case in self.cases:
            self.assertIsInstance(case, dict)
            seen.append(case.get("source_id"))
            ids.append(case.get("id"))
        self.assertEqual(sorted(seen), sorted(REQUIRED_SOURCE_IDS))
        self.assertEqual(len(ids), len(set(ids)))

    def test_each_row_copies_its_registered_evidence(self):
        for case in self.cases:
            label = case.get("id")
            with self.subTest(case=label):
                claim = self.claims.get(case.get("claim_id"))
                source = self.sources.get(case.get("source_id"))
                self.assertIsInstance(claim, dict, "row must point at a registered claim")
                self.assertIsInstance(source, dict, "row must point at a registered source")
                evidence = next(
                    (
                        item
                        for item in claim.get("evidence", [])
                        if isinstance(item, dict) and item.get("source_id") == case.get("source_id")
                    ),
                    None,
                )
                self.assertIsInstance(evidence, dict, "registered claim has no evidence entry for this source")
                for field in COPIED_FIELDS:
                    self.assertEqual(case.get(field), evidence.get(field))
                self.assertEqual(case.get("population"), source.get("scope"))
                self.assertIn(case.get("status"), {"supported", "qualified"})
                self.assertIn(case.get("evidence_character"), {"public_measured", "public_documented"})
                self.assertNotIn("sponsor", case)
                self.assertNotIn("reader", case)

    def test_measure_and_comparison_come_from_registered_text_or_the_sentinel(self):
        for case in self.cases:
            with self.subTest(case=case.get("id")):
                source = self.sources[case["source_id"]]
                registered = "\n".join(
                    str(part)
                    for part in (
                        source.get("scope"),
                        source.get("limitations"),
                        case.get("relevant_finding"),
                        case.get("qualification"),
                    )
                )
                for field in ("measure", "comparison", "cost_boundary"):
                    value = case.get(field)
                    self.assertIsInstance(value, str)
                    self.assertTrue(value.strip())
                    self.assertTrue(
                        value == SENTINEL or value in registered,
                        f"{field} is neither the sentinel nor a phrase in the registered text: {value!r}",
                    )

    def test_supported_claim_does_not_outrank_the_wording_or_skip_the_stop_rule(self):
        allowed = {"definition-only", *CLAIM_LEVELS}
        for case in self.cases:
            with self.subTest(case=case.get("id")):
                asserted = case.get("asserted_claim")
                supported = case.get("supported_claim")
                blocked = case.get("does_not_support")
                self.assertIn(asserted, allowed)
                self.assertIn(supported, allowed)
                self.assertIsInstance(blocked, list)
                self.assertTrue(blocked)
                self.assertEqual(len(blocked), len(set(blocked)))
                for level in blocked:
                    self.assertIn(level, CLAIM_LEVELS)
                if asserted == "definition-only":
                    self.assertEqual(supported, "definition-only")
                    self.assertIn("05-outcome", blocked)
                    self.assertIn("06-value", blocked)
                else:
                    self.assertLessEqual(CLAIM_LEVELS.index(supported), CLAIM_LEVELS.index(asserted))
                    self.assertNotIn(supported, blocked)
                if supported == "05-outcome":
                    self.assertIn("04-capability", blocked)
                    self.assertIn("06-value", blocked)
                self.assertTrue(str(case.get("decision_reported", "")).endswith("?"))

    def test_release_docs_point_at_the_corpus_and_withdraw_the_reader_gate(self):
        release = (ROOT / "docs" / "first-reviewed-release.md").read_text(encoding="utf-8")
        protocol = (ROOT / "docs" / "human-kit-reader-test.md").read_text(encoding="utf-8")
        codebook = (ROOT / "docs" / "public-case-corpus.md").read_text(encoding="utf-8")
        self.assertIn("data/public-case-corpus.yml", release)
        self.assertIn("public-case-corpus.md", release)
        self.assertNotIn("non-technical sponsor", release)
        self.assertNotIn("human-kit reader test", release)
        self.assertIn("one observation", protocol)
        self.assertIn("sampling frame", protocol)
        self.assertIn("public-case-corpus.md", protocol)
        self.assertIn(SENTINEL, codebook)
        self.assertIn("toolkit/samples/", codebook)


if __name__ == "__main__":
    unittest.main()
