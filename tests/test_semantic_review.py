# SPDX-License-Identifier: Apache-2.0
from __future__ import annotations

import copy
import unittest
from pathlib import Path

from experiments.semantic_review.core import (
    QUESTIONS,
    advisory_record,
    build_state,
    evidence_descriptors,
    load_request,
    validate_request,
)

REPO_ROOT = Path(__file__).resolve().parents[1]


class SemanticReviewExperimentTests(unittest.TestCase):
    def request(self):
        return {
            "reviewId": "example",
            "claim": {
                "id": "claim-1",
                "revision": "rev-1",
                "text": "Recovery has been tested successfully.",
            },
            "evidence": [
                {
                    "sourceId": "ops-plan",
                    "sourceVersion": "2026-09-21",
                    "locator": "Recovery exercise",
                    "excerpt": "Recovery testing is scheduled for next week.",
                }
            ],
        }

    def test_question_catalogue_uses_choice_only(self):
        self.assertTrue(QUESTIONS)
        self.assertEqual({item["type"] for item in QUESTIONS.values()}, {"choice"})

    def test_request_requires_direct_evidence_excerpt_and_version(self):
        for field in ("sourceId", "sourceVersion", "locator", "excerpt"):
            with self.subTest(field=field):
                payload = self.request()
                payload["evidence"][0][field] = ""
                with self.assertRaises(ValueError):
                    validate_request(payload)

    def test_checked_in_example_request_is_valid(self):
        payload = load_request(
            REPO_ROOT / "experiments" / "semantic_review" / "example.request.json"
        )
        self.assertEqual(
            payload["reviewId"],
            "recovery-test-planned-vs-completed",
        )

    def test_state_contains_claim_and_supplied_evidence(self):
        state = build_state(self.request())
        self.assertIn("CLAIM: Recovery has been tested successfully.", state)
        self.assertIn("source=ops-plan", state)
        self.assertIn("Recovery testing is scheduled for next week.", state)

    def test_persisted_evidence_descriptor_hashes_but_does_not_copy_excerpt(self):
        descriptors = evidence_descriptors(self.request())
        self.assertEqual(descriptors[0]["sourceId"], "ops-plan")
        self.assertTrue(descriptors[0]["excerptSha256"].startswith("sha256:"))
        self.assertNotIn("excerpt", descriptors[0])

    def test_advisory_record_cannot_be_confused_with_gate_or_review_disposition(self):
        payload = self.request()
        result = advisory_record(
            payload=payload,
            provider="laya",
            model={"requestedModel": "convaiinnovations/laya"},
            answers={
                "support_relationship": {
                    "type": "choice",
                    "choice": "not_established",
                    "probabilities": {"not_established": 0.7},
                    "confidence": 0.4,
                }
            },
            input_coverage={"truncationRisk": False},
        )
        self.assertTrue(result["advisoryOnly"])
        self.assertNotIn("status", result)
        self.assertNotIn("disposition", result)
        self.assertNotIn("gateChecks", result)
        self.assertIn("does not change", result["authorityBoundary"])

    def test_claim_text_is_hashed_in_output(self):
        result = advisory_record(
            payload=copy.deepcopy(self.request()),
            provider="laya",
            model={},
            answers={},
            input_coverage={},
        )
        self.assertNotIn("text", result["claim"])
        self.assertTrue(result["claim"]["textSha256"].startswith("sha256:"))


if __name__ == "__main__":
    unittest.main()
