#!/usr/bin/env python3
"""Build the static publication from Markdown and canonical YAML evidence."""
from __future__ import annotations

import html
import os
import re
import shutil
from pathlib import Path

import markdown
import site_nav
from publication_data import claims as load_claims
from publication_data import load_yaml, source_map

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
REPO_URL = os.environ.get("PUBLICATION_REPO_URL", "https://github.com/milleleaf/ai-output-to-value")
UMBRELLA_URL = os.environ.get("PUBLICATION_UMBRELLA_URL", "https://github.com/milleleaf")
SOURCE_REF = os.environ.get("PUBLICATION_SOURCE_REF") or os.environ.get("GITHUB_SHA") or "main"
PUBLICATION_MODE = os.environ.get("PUBLICATION_MODE", "preview").strip().lower()
RELEASE_SCOPES = {"guide", "policy"}
# Repository files that the site publishes as pages. An article link to one of these
# must point at the published copy, not fall back to the GitHub source blob. Values are
# relative to articles/.
PUBLISHED_FILES = {
    "tools/claim-gate.html": "../tools/claim-gate.html",
    "schemas/v1/claim.schema.json": "../schemas/v1/claim.schema.json",
    "schemas/v1/decision-gates.json": "../schemas/v1/decision-gates.json",
}
STATUS = {
    "draft": "Draft",
    "research_draft": "Research draft",
    "editorial_review": "Editorial review in progress",
    "active_policy": "Active publication policy",
    "ready": "Reviewed for publication",
}
ARTICLE_LINK_RE = re.compile(
    r'(?P<open><a\b[^>]*\bhref=["\']articles/(?P<slug>[a-z0-9-]+)\.html["\'][^>]*>)'
    r'(?P<label>.*?)'
    r'(?P<close></a>)',
    re.IGNORECASE | re.DOTALL,
)
MD_LINK_RE = re.compile(
    r"(?P<prefix>!?\[[^\]]*\]\()(?P<href><[^>]+>|[^)\s]+)(?P<suffix>(?:\s+[\"'][^\"']*[\"'])?\))"
)


def status_label(value: str) -> str:
    return STATUS.get(value, value.replace("_", " ").title())


def evidence_character(item: dict) -> str:
    article_id = str(item.get("id", ""))
    section = str(item.get("section", ""))
    if article_id == "worked-cases":
        return "Evidence character: illustrative teaching cases"
    if article_id in {"claim-card", "meeting-brief"}:
        return "Evidence character: decision tool / editorial synthesis"
    if section == "core":
        return "Evidence character: editorial synthesis with linked evidence"
    if section == "deeper":
        return "Evidence character: working research synthesis"
    if section == "advanced":
        return "Evidence character: research preview"
    if section == "policy":
        return "Evidence character: publication policy"
    return "Evidence character: unspecified"


def heading_anchor(locator: str) -> str | None:
    match = re.match(r"^#{1,6}\s+(.+?)\s*$", locator.strip())
    if not match:
        return None
    text = re.sub(r"[`*_~]", "", match.group(1)).lower()
    text = re.sub(r"[^\w\s-]", "", text, flags=re.UNICODE)
    return re.sub(r"[-\s]+", "-", text).strip("-") or None


def repo_slug() -> str:
    marker = "github.com/"
    if marker in REPO_URL:
        return REPO_URL.rstrip("/").split(marker, 1)[1]
    return "AlreadyOpen/ai-output-to-value"


def article_toolbar(item: dict) -> str:
    slug = html.escape(str(item["slug"]), quote=True)
    title = html.escape(str(item["title"]), quote=True)
    source = html.escape(
        f'{REPO_URL}/blob/{SOURCE_REF}/{item["source"]}', quote=True
    )
    repository = html.escape(repo_slug(), quote=True)
    return f'''<div class="article-tools" data-article-tools data-md-path="../md/{slug}.md" data-source-url="{source}" data-title="{title}" data-repo="{repository}">
<button class="article-tool-button" type="button" data-copy-md aria-label="Copy this article as Markdown"><span aria-hidden="true">▣</span> Copy MD</button>
<details class="article-open-menu">
<summary class="article-tool-button">Open in <span aria-hidden="true">⌄</span></summary>
<div class="article-tools-menu" role="menu">
<button type="button" data-copy-md-link role="menuitem"><span aria-hidden="true">↗</span><span>Copy MD link</span></button>
<a href="../md/{slug}.md" data-open-markdown role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">MD</span><span>Open Markdown</span></a>
<a href="{source}" data-open-github role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">GH</span><span>GitHub</span></a>
<a href="#" data-open-provider="chatgpt" role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">◎</span><span>ChatGPT</span></a>
<a href="#" data-open-provider="claude" role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">A</span><span>Claude</span></a>
<a href="#" data-open-provider="t3" role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">T3</span><span>T3 Chat</span></a>
<a href="#" data-open-provider="copilot" role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">◈</span><span>GitHub Copilot</span></a>
<a href="#" data-open-provider="cursor" role="menuitem" target="_blank" rel="noopener"><span aria-hidden="true">C</span><span>Cursor</span></a>
</div>
</details>
</div>'''


def page_shell(title: str, body: str, source: str | None = None, meta: str = "", tools_html: str = "") -> str:
    source_link = ""
    if source:
        source_link = f'<a href="{REPO_URL}/blob/{SOURCE_REF}/{html.escape(source)}">View source version</a>'
    mode_label = "Reviewed release candidate" if PUBLICATION_MODE == "release" else "Working preview"
    escaped_title = html.escape(title)
    return f"""<!doctype html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="AI Output to Value — evidence-led guidance for business decisions about AI-assisted work.">
<meta name="theme-color" content="#f7f8f6">
<meta property="og:type" content="article"><meta property="og:site_name" content="AI Output to Value">
<meta property="og:title" content="{escaped_title} — AI Output to Value">
<meta property="og:description" content="Evidence-led guidance for business decisions about AI-assisted work, client readiness, accountability, and value.">
<meta name="twitter:card" content="summary">
<title>{escaped_title} — AI Output to Value</title>
<link rel="stylesheet" href="../styles.css"><link rel="stylesheet" href="../publication.css"></head><body>
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header"><div class="shell header-inner"><a class="brand" href="../index.html"><span class="brand-mark" aria-hidden="true">O→V</span><span>AI Output to Value</span></a>{site_nav.primary("../")}</div></header>
{site_nav.mobile("../")}
<main id="main" class="article-shell"><article class="article-body"><div class="article-meta"><span class="review-scope">{mode_label}</span><br>{meta}</div>{tools_html}{body}</article><aside class="article-aside" aria-label="Article links"><strong>AI Output to Value</strong><a href="../index.html">Home</a><a href="../tools/claim-gate.html">Interactive claim gate</a><a href="{site_nav.MCP_URL}">AI access</a><a href="../articles/index.html">All articles</a><a href="../evidence/index.html">Evidence</a>{source_link}<a href="{UMBRELLA_URL}">AlreadyOpen umbrella</a><a href="../articles/provenance.html">Provenance</a><a href="../articles/corrections.html">Report a correction</a></aside></main>
<footer class="site-footer"><div class="shell footer-inner"><p><strong>AI Output to Value</strong> · <a href="{UMBRELLA_URL}">An AlreadyOpen project</a></p><p><a href="../articles/provenance.html">Provenance</a> · <a href="{REPO_URL}">GitHub</a> · <a href="../articles/corrections.html">Corrections</a></p></div></footer>
<script src="../webmcp.js" defer></script>
<script src="../article-tools.js" defer></script>
</body></html>"""


def rewrite_links(rendered: str, mapping: dict[str, str], source_path: Path) -> str:
    def replace(match: re.Match[str]) -> str:
        href = match.group(1)
        if href.startswith(("http://", "https://", "mailto:", "tel:", "#")):
            return match.group(0)
        path_part, sep, fragment = href.partition("#")
        resolved = (source_path.parent / path_part).resolve()
        try:
            rel = resolved.relative_to(ROOT.resolve()).as_posix()
        except ValueError:
            return match.group(0)
        if rel in mapping:
            return f'href="{mapping[rel]}{("#" + fragment) if sep else ""}"'
        if rel in PUBLISHED_FILES:
            return f'href="{PUBLISHED_FILES[rel]}{("#" + fragment) if sep else ""}"'
        if resolved.exists():
            return f'href="{REPO_URL}/blob/{SOURCE_REF}/{rel}{("#" + fragment) if sep else ""}"'
        return match.group(0)
    return re.sub(r'href="([^"]+)"', replace, rendered)


def rewrite_markdown_links(source: str, mapping: dict[str, str], source_path: Path) -> str:
    """Make repository-relative links valid in the published /md/ copy."""
    def replace(match: re.Match[str]) -> str:
        href_token = match.group("href")
        wrapped = href_token.startswith("<") and href_token.endswith(">")
        href = href_token[1:-1] if wrapped else href_token
        if href.startswith(("http://", "https://", "mailto:", "tel:", "#")):
            return match.group(0)
        path_part, sep, fragment = href.partition("#")
        resolved = (source_path.parent / path_part).resolve()
        try:
            rel = resolved.relative_to(ROOT.resolve()).as_posix()
        except ValueError:
            return match.group(0)
        if rel in mapping:
            target = f'../articles/{mapping[rel]}'
            if sep:
                target += f'#{fragment}'
        elif resolved.exists():
            target = f'{REPO_URL}/blob/{SOURCE_REF}/{rel}'
            if sep:
                target += f'#{fragment}'
        else:
            return match.group(0)
        if wrapped:
            target = f'<{target}>'
        return f'{match.group("prefix")}{target}{match.group("suffix")}'

    return MD_LINK_RE.sub(replace, source)


def selected_articles() -> list[dict]:
    manifest = load_yaml(ROOT / "data" / "articles.yml")
    articles = sorted(manifest["articles"], key=lambda item: item.get("order", 9999))
    if PUBLICATION_MODE == "release":
        return [article for article in articles if article.get("release_scope") in RELEASE_SCOPES]
    return articles


def render_homepage(articles: list[dict]) -> str:
    """Render the maintained homepage against the same article selection as the build.

    Preview mode preserves all maintained links. Release mode converts links to
    excluded working articles into explicit, non-clickable working-material
    notes so the release artifact cannot point at pages it intentionally omits.
    """
    source = (ROOT / "index.html").read_text(encoding="utf-8")
    # Keep machine interfaces as progressive enhancement rather than making
    # WebMCP/MCP the conceptual front door for first-time business readers.
    # The maintained homepage owns the human-first navigation and CTAs.
    interface_intro = '<p>A human can use visible controls. An agent can use a structured tool surface. A hybrid workflow can use both. Actor-neutral evaluation means applying the same intended-use, authority, evidence, failure-handling and outcome standards—not forcing every actor through the same user interface.</p>'
    source = source.replace(
        interface_intro,
        interface_intro + '\n          <p><strong>This site is WebMCP-enabled.</strong> Compatible agents can use six read-only tools to read the framework, list and read articles, search evidence, inspect claims, and retrieve the meeting guide. Browser/runtime support is reported below.</p>',
        1,
    )
    if "webmcp.js" not in source:
        source = source.replace("</body>", '<script src="webmcp.js" defer></script>\n</body>')
    if PUBLICATION_MODE != "release":
        return source

    manifest = load_yaml(ROOT / "data" / "articles.yml")
    all_articles = manifest.get("articles", []) if isinstance(manifest, dict) else []
    known_slugs = {
        article.get("slug")
        for article in all_articles
        if isinstance(article, dict) and isinstance(article.get("slug"), str)
    }
    selected_slugs = {
        article.get("slug")
        for article in articles
        if isinstance(article, dict) and isinstance(article.get("slug"), str)
    }

    def replace(match: re.Match[str]) -> str:
        slug = match.group("slug")
        if slug not in known_slugs or slug in selected_slugs:
            return match.group(0)
        label = match.group("label")
        return (
            f'<span class="working-material-note" data-working-article="{html.escape(slug)}">'
            f'{label} <em>(working material; not included in this reviewed release)</em></span>'
        )

    return ARTICLE_LINK_RE.sub(replace, source)


def claims_for(source: str, records: list[dict]) -> list[dict]:
    return [claim for claim in records if any(pub.get("file") == source for pub in claim.get("published_in", []))]


def evidence_block(records: list[dict]) -> str:
    if not records:
        return '<section class="article-evidence-links"><h2>Evidence connection</h2><p>No claim-level evidence records are attached to this page yet. Treat factual statements according to the visible publication status.</p></section>'
    items = []
    for claim in records:
        cid = html.escape(str(claim.get("id", "")))
        text = html.escape(str(claim.get("claim_text", "")))
        review = html.escape(str(claim.get("independent_review_status", "unspecified")))
        items.append(f'<li><a href="../evidence/index.html#{cid}">{text}</a> <span class="evidence-review-note">(independent review: {review})</span></li>')
    return '<section class="article-evidence-links"><h2>Evidence used on this page</h2><p>Factual claims currently connected to the publication evidence register:</p><ul>' + ''.join(items) + '</ul></section>'


def meta_for(item: dict, records: list[dict]) -> str:
    if records:
        pending = sum(claim.get("independent_review_status") != "completed" for claim in records)
        evidence_state = f"Evidence review: {pending} connected claim(s) await independent review" if pending else "Evidence review: connected claims marked complete"
    else:
        evidence_state = "Evidence review: no claim-level records attached yet"
    return (f'<span class="status-label">{html.escape(status_label(str(item.get("status", "draft"))))}</span> '
            f'&nbsp; Maintained by {html.escape(str(item.get("maintainer", "")))} · Last updated {html.escape(str(item.get("reviewed", "")))}<br>'
            f'<span class="review-scope">{html.escape(evidence_character(item))}</span><br>'
            f'<span class="review-scope">{html.escape(evidence_state)}</span>')


def render_articles() -> list[dict]:
    articles = selected_articles()
    mapping = {article["source"]: f'{article["slug"]}.html' for article in articles}
    records = load_claims(ROOT)
    out = SITE / "articles"
    md_out = SITE / "md"
    out.mkdir(parents=True, exist_ok=True)
    md_out.mkdir(parents=True, exist_ok=True)

    for item in articles:
        source_path = ROOT / item["source"]
        source_text = source_path.read_text(encoding="utf-8")
        published_markdown = rewrite_markdown_links(source_text, mapping, source_path)
        (md_out / f'{item["slug"]}.md').write_text(published_markdown, encoding="utf-8")
        body = markdown.markdown(source_text, extensions=["tables", "fenced_code", "sane_lists", "toc"])
        body = rewrite_links(body, mapping, source_path)
        related = claims_for(item["source"], records)
        body += evidence_block(related)
        (out / f'{item["slug"]}.html').write_text(
            page_shell(
                item["title"],
                body,
                item["source"],
                meta_for(item, related),
                article_toolbar(item),
            ),
            encoding="utf-8",
        )

    intro = "This release contains the reviewed guide and its publication policy." if PUBLICATION_MODE == "release" else "This preview includes the core guide plus clearly separated working research."
    blocks = ["<h1>Articles</h1>", f"<p>{html.escape(intro)} Status labels describe publication state; dates mean last updated.</p>"]
    group_labels = [
        ("core", "Core decision guide"),
        ("deeper", "Working analysis — not in the reviewed release"),
        ("advanced", "Research preview — advanced / agentic organisations"),
        ("policy", "Publication policy and provenance"),
    ]
    for key, label in group_labels:
        group = [article for article in articles if article.get("section") == key]
        if not group:
            continue
        blocks.append(f'<h2>{label}</h2><div class="evidence-grid">')
        for article in group:
            blocks.append(f'<a class="source-card" href="{html.escape(article["slug"])}.html"><span>{html.escape(status_label(str(article.get("status", "draft"))))}</span><strong>{html.escape(article["title"])}</strong><p>{html.escape(article.get("summary", ""))}</p></a>')
        blocks.append("</div>")
    (out / "index.html").write_text(page_shell("Articles", "".join(blocks)), encoding="utf-8")
    return articles


def backlink(pub: dict, article_by_source: dict[str, dict]) -> str:
    target, locator = str(pub.get("file", "")), str(pub.get("locator", ""))
    article = article_by_source.get(target)
    if article:
        anchor = heading_anchor(locator)
        href = f'../articles/{article["slug"]}.html' + (f'#{anchor}' if anchor else '')
        return f'<a href="{href}">{html.escape(article["title"])}</a> — {html.escape(locator)}'
    if target == "index.html":
        return f'<a href="../index.html">Homepage</a> — {html.escape(locator)}'
    return f'<a href="{REPO_URL}/blob/{SOURCE_REF}/{html.escape(target)}">{html.escape(target)}</a> — {html.escape(locator)}'


def review_record_html(claim: dict) -> str:
    record = claim.get("review_record")
    if not isinstance(record, dict):
        return ""
    versions = ", ".join(str(value) for value in record.get("source_versions_checked", []))
    return ("<h3>Independent review record</h3>"
            f'<p><strong>Claim revision:</strong> {html.escape(str(record.get("claim_revision", "")))}</p>'
            f'<p><strong>Source versions checked:</strong> {html.escape(versions)}</p>'
            f'<p><strong>Method:</strong> {html.escape(str(record.get("method", "")))}</p>'
            f'<p><strong>Finding:</strong> {html.escape(str(record.get("finding", "")))}</p>'
            f'<p><strong>Disposition:</strong> {html.escape(str(record.get("disposition", "")))}</p>')


def render_evidence(articles: list[dict]) -> None:
    sources = source_map(ROOT)
    records = load_claims(ROOT)
    included_sources = {article["source"] for article in articles}
    if PUBLICATION_MODE == "release":
        records = [claim for claim in records if any(pub.get("file") in included_sources or pub.get("file") == "index.html" for pub in claim.get("published_in", []))]
    by_source = {article["source"]: article for article in articles}

    blocks = ["<h1>Evidence and claims</h1>", "<p>Claim records show source, locator, qualification, review state, and where each claim appears. Structural checks do not establish factual truth.</p>"]
    for claim in records:
        cid = html.escape(str(claim.get("id", "")))
        blocks.append(f'<section class="evidence-record" id="{cid}"><p><span class="status-label">{html.escape(str(claim.get("status", "")))}</span> <span class="status-label">independent review: {html.escape(str(claim.get("independent_review_status", "")))}</span></p><h2>{html.escape(str(claim.get("claim_text", "")))}</h2>')
        blocks.append(f'<p><strong>Reviewer/process:</strong> {html.escape(str(claim.get("reviewer", "")))} · {html.escape(str(claim.get("reviewed", "")))}</p>')
        blocks.append(review_record_html(claim))
        if claim.get("launch_critical") is not None:
            blocks.append(f'<p><strong>Launch-critical:</strong> {"yes" if claim.get("launch_critical") else "no"}</p>')
        for evidence in claim.get("evidence", []):
            source = sources.get(evidence.get("source_id"), {})
            blocks.append(f'<h3><a href="{html.escape(str(source.get("url", "#")))}">{html.escape(str(source.get("title", evidence.get("source_id", "Unknown source"))))}</a></h3>')
            blocks.append(f'<p><strong>Source:</strong> {html.escape(str(source.get("publisher", "")))} · {html.escape(str(source.get("evidence_type", "")))}</p>')
            if evidence.get("source_version"):
                blocks.append(f'<p><strong>Version/date used:</strong> {html.escape(str(evidence.get("source_version")))}</p>')
            blocks.append(f'<p><strong>Locator:</strong> {html.escape(str(evidence.get("locator", "")))}</p><p><strong>Finding:</strong> {html.escape(str(evidence.get("relevant_finding", "")))}</p><p><strong>Qualification:</strong> {html.escape(str(evidence.get("qualification", "")))}</p>')
            if source.get("scope"):
                blocks.append(f'<p><strong>Source scope:</strong> {html.escape(str(source.get("scope")))}</p>')
            if source.get("limitations"):
                blocks.append(f'<p><strong>Source limitations:</strong> {html.escape(str(source.get("limitations")))}</p>')
        used_in = [pub for pub in claim.get("published_in", []) if pub.get("file") in included_sources or pub.get("file") == "index.html"]
        if used_in:
            blocks.append('<h3>Used in</h3><ul>' + ''.join(f'<li>{backlink(pub, by_source)}</li>' for pub in used_in) + '</ul>')
        blocks.append('</section>')

    out = SITE / "evidence"
    out.mkdir(parents=True, exist_ok=True)
    mode = "release candidate" if PUBLICATION_MODE == "release" else "working preview"
    (out / "index.html").write_text(page_shell("Evidence", "".join(blocks), "data/claims.yml", f"Claim-level traceability · {mode} · structural checks are not factual approval"), encoding="utf-8")


def build() -> None:
    if PUBLICATION_MODE not in {"preview", "release"}:
        raise SystemExit("PUBLICATION_MODE must be 'preview' or 'release'")
    if SITE.exists():
        shutil.rmtree(SITE)
    SITE.mkdir(parents=True)
    for name in ("styles.css", "publication.css", "webmcp.js", "article-tools.js"):
        shutil.copy2(ROOT / name, SITE / name)
    articles = render_articles()
    (SITE / "index.html").write_text(render_homepage(articles), encoding="utf-8")
    render_evidence(articles)
    print(f"Built {PUBLICATION_MODE} site at {SITE} using source ref {SOURCE_REF}; repository {REPO_URL}; umbrella {UMBRELLA_URL}")


if __name__ == "__main__":
    build()
