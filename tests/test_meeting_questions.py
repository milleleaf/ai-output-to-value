from __future__ import annotations

import re
import unittest
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
CANONICAL = yaml.safe_load((ROOT / "data" / "meeting-questions.yml").read_text(encoding="utf-8"))["questions"]


def read(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def markdown_questions(path: str) -> list[str]:
    return re.findall(r"^[1-8]\. \*\*(.+?)\*\*$", read(path), flags=re.MULTILINE)


def quoted_list(path: str, marker: str) -> list[str]:
    text = read(path)
    block = text[text.index(marker) :].split("]", 1)[0]
    return re.findall(r'^\s+"([^"]+)",?$', block, flags=re.MULTILINE)


class MeetingQuestionTests(unittest.TestCase):
    def test_there_are_eight_short_questions(self):
        self.assertEqual(len(CANONICAL), 8)
        for question in CANONICAL:
            with self.subTest(question=question):
                self.assertTrue(question.endswith("?"))
                self.assertEqual(question.count("?"), 1, "one question per line; detail belongs in the facilitator prompt")
                self.assertLessEqual(len(question.split()), 16)

    def test_every_surface_uses_the_canonical_questions_in_order(self):
        surfaces = {
            "START-HERE.md": markdown_questions("START-HERE.md"),
            "content/executive-guide.md": markdown_questions("content/executive-guide.md"),
            "content/meeting-brief.md": markdown_questions("content/meeting-brief.md"),
            "index.html": re.findall(r"<li><span>[1-8]</span><p><strong>(.+?)</strong>", read("index.html")),
            "web/scripts/render-meeting-brief.tsx": quoted_list("web/scripts/render-meeting-brief.tsx", "const questions = ["),
            "webmcp.js": quoted_list("webmcp.js", "const MEETING_QUESTIONS = ["),
        }
        for name, found in surfaces.items():
            with self.subTest(surface=name):
                self.assertEqual(found, CANONICAL)

    def test_no_generated_page_patch_reintroduces_an_older_question(self):
        source = read("scripts/augment_site.py")
        self.assertNotIn("Which work disappeared", source)
        self.assertNotIn("<li><span>4</span>", source)

    def test_facilitator_prompts_carry_the_detail_the_short_questions_drop(self):
        brief = read("content/meeting-brief.md")
        for detail in ("next bottleneck", "authority, accountability, approval, verification, operation and support", "learning or uncertainty removed"):
            with self.subTest(detail=detail):
                self.assertIn(detail, brief)

    def test_reader_session_is_withdrawn_in_favour_of_the_public_corpus(self):
        protocol = read("docs/human-kit-reader-test.md")
        self.assertIn("one observation", protocol)
        self.assertIn("sampling frame", protocol)
        self.assertIn("public-case-corpus.md", protocol)
        self.assertNotIn("release criterion is complete only after", protocol)


if __name__ == "__main__":
    unittest.main()
