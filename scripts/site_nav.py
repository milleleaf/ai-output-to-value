#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""The site navigation, defined once.

Every published page carries the same primary and mobile navigation. The article
template renders it from here, and `apply_site_nav.py` re-applies it to every built page,
including the hand-written home and Claim Gate pages, so the pages cannot drift apart.
`check_site_links.py` fails the build if any page differs.

The order follows the human decision path first (the eight questions, then the Claim
Card), then the optional structured tool, then reading and evidence, then machine access.
"""
from __future__ import annotations

import os
import re

REPO_URL = os.environ.get("PUBLICATION_REPO_URL", "https://github.com/milleleaf/ai-output-to-value")
MCP_URL = f"{REPO_URL}/tree/main/packages/mcp"

# (label, path relative to the site root, or an absolute URL)
ITEMS: tuple[tuple[str, str], ...] = (
    ("Eight questions", "index.html#questions"),
    ("Claim Card", "articles/claim-card.html"),
    ("Claim gate", "tools/claim-gate.html"),
    ("Articles", "articles/index.html"),
    ("Evidence", "evidence/index.html"),
    ("AI access", MCP_URL),
    ("GitHub", REPO_URL),
)
HOME = ("Home", "index.html")

PRIMARY_RE = re.compile(r'<nav class="nav" aria-label="Primary navigation">.*?</nav>', re.DOTALL)
MOBILE_RE = re.compile(r'<details class="mobile-nav">.*?</details>', re.DOTALL)


def prefix_for(depth: int) -> str:
    """Relative prefix from a page `depth` directories below the site root."""
    return "../" * depth


def _links(items: tuple[tuple[str, str], ...], prefix: str) -> str:
    return "".join(
        f'<a href="{path if path.startswith("http") else prefix + path}">{label}</a>' for label, path in items
    )


def primary(prefix: str) -> str:
    return f'<nav class="nav" aria-label="Primary navigation">{_links(ITEMS, prefix)}</nav>'


def mobile(prefix: str) -> str:
    return (
        '<details class="mobile-nav"><summary>Menu</summary>'
        f'<nav aria-label="Mobile navigation">{_links((HOME, *ITEMS), prefix)}</nav></details>'
    )


def apply_navigation(page: str, prefix: str) -> str:
    """Give `page` the site navigation. Fails loudly rather than skipping a page."""
    if len(PRIMARY_RE.findall(page)) != 1:
        raise ValueError("page must contain exactly one primary navigation")
    page = PRIMARY_RE.sub(lambda _: primary(prefix), page, count=1)
    if MOBILE_RE.search(page):
        return MOBILE_RE.sub(lambda _: mobile(prefix), page, count=1)
    if "</header>" not in page:
        raise ValueError("page has no </header> to place the mobile navigation after")
    return page.replace("</header>", "</header>\n" + mobile(prefix), 1)
