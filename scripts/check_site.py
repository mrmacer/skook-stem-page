#!/usr/bin/env python3
"""Fast structural checks for the static STEM@Skook29 site."""

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
EXTERNAL_SCHEMES = {"http", "https"}
IGNORED_SCHEMES = {"mailto", "tel", "javascript", "data"}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.ids: list[str] = []
        self.h1_count = 0
        self.links: list[dict[str, str | None]] = []
        self.assets: list[str] = []
        self.form_actions: list[str] = []

    def handle_starttag(
        self, tag: str, attrs_list: list[tuple[str, str | None]]
    ) -> None:
        attrs = dict(attrs_list)
        if attrs.get("id"):
            self.ids.append(attrs["id"] or "")
        if tag == "h1":
            self.h1_count += 1
        if tag == "a" and attrs.get("href") is not None:
            self.links.append(attrs)
        if tag == "form" and attrs.get("action"):
            self.form_actions.append(attrs["action"] or "")
        if tag in {"img", "script"} and attrs.get("src"):
            self.assets.append(attrs["src"] or "")
        if tag == "link" and attrs.get("href"):
            self.assets.append(attrs["href"] or "")
        if tag == "source" and attrs.get("srcset"):
            self.assets.extend(
                candidate.strip().split()[0]
                for candidate in (attrs["srcset"] or "").split(",")
                if candidate.strip()
            )


def local_target_exists(reference: str) -> bool:
    parsed = urlsplit(reference)
    path_text = parsed.path
    if not path_text or parsed.scheme in IGNORED_SCHEMES:
        return True
    if parsed.scheme in EXTERNAL_SCHEMES or path_text.startswith("//"):
        return True
    if path_text.startswith("/api/"):
        return True

    path_text = path_text.lstrip("/")
    candidate = ROOT / path_text
    if candidate.exists():
        return True
    if not candidate.suffix and candidate.with_suffix(".html").exists():
        return True
    return False


def main() -> int:
    errors: list[str] = []
    pages = sorted(ROOT.glob("*.html"))

    for page in pages:
        parser = PageParser()
        parser.feed(page.read_text(encoding="utf-8"))

        if parser.h1_count != 1:
            errors.append(f"{page.name}: expected one h1, found {parser.h1_count}")

        duplicate_ids = sorted(
            item for item in set(parser.ids) if parser.ids.count(item) > 1
        )
        if duplicate_ids:
            errors.append(
                f"{page.name}: duplicate ids: {', '.join(duplicate_ids)}"
            )

        for action in parser.form_actions:
            if action.lower().startswith("mailto:"):
                errors.append(f"{page.name}: form still uses a mailto action")
            if not local_target_exists(action):
                errors.append(f"{page.name}: missing form action {action}")

        for attrs in parser.links:
            href = attrs.get("href") or ""
            if href == "#":
                errors.append(f"{page.name}: placeholder link href=\"#\"")
                continue

            parsed = urlsplit(href)
            if parsed.scheme in EXTERNAL_SCHEMES:
                rel = set((attrs.get("rel") or "").split())
                if attrs.get("target") != "_blank":
                    errors.append(f"{page.name}: external link lacks target=_blank: {href}")
                if not {"noopener", "noreferrer"}.issubset(rel):
                    errors.append(f"{page.name}: external link lacks safe rel: {href}")
            elif not local_target_exists(href):
                errors.append(f"{page.name}: missing internal link target {href}")

        for asset in parser.assets:
            if not local_target_exists(asset):
                errors.append(f"{page.name}: missing asset {asset}")

    css_text = "\n".join(
        stylesheet.read_text(encoding="utf-8")
        for stylesheet in sorted((ROOT / "css").glob("*.css"))
    )
    defined_vars = set(re.findall(r"(--[\w-]+)\s*:", css_text))
    used_vars = set(re.findall(r"var\((--[\w-]+)", css_text))
    for variable in sorted(used_vars - defined_vars):
        errors.append(f"CSS: undefined custom property {variable}")

    if errors:
        print("\n".join(f"ERROR: {error}" for error in errors))
        return 1

    print(
        f"Site check passed: {len(pages)} pages, internal targets, assets, "
        "external-link safety, headings, IDs, forms, and CSS variables."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
