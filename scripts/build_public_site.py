#!/usr/bin/env python3
"""Build the reviewed public site without deferred or internal source material."""

from __future__ import annotations

import shutil
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist"

PUBLIC_ROOT_FILES = {
    "404.html",
    "about.html",
    "accessibility.html",
    "ai-edtech-resource-library.html",
    "classroom-resources.html",
    "community.html",
    "connect.html",
    "contact.html",
    "cso-administrator-center.html",
    "cso-advisor-center.html",
    "districts.html",
    "edtech-ai.html",
    "events.html",
    "how-action-plans-work.html",
    "index.html",
    "leadership-training-institute.html",
    "lesson-hook-generator.html",
    "phenomenon-sessions.html",
    "privacy.html",
    "programs.html",
    "robots.txt",
    "sitemap.xml",
    "steels-resource-library.html",
    "steels-support.html",
    "student-leadership.html",
    "students.html",
    "teachers.html",
    "wscam.html",
}

PUBLIC_DIRECTORIES = {"assets", "css", "js"}
DEFERRED_PATHS = {
    "assets/js/living-lab",
    "css/living-lab.css",
    "living-lab.html",
    "living-lab-dashboard.html",
    "living-lab-explore.html",
    "living-lab-investigations.html",
    "living-lab-map.html",
    "living-lab-submit.html",
    "living-lab-teacher-toolkit.html",
}


def is_deferred(relative: Path) -> bool:
    text = relative.as_posix()
    return any(text == item or text.startswith(f"{item}/") for item in DEFERRED_PATHS)


class LivingLabLinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs_list: list[tuple[str, str | None]]) -> None:
        if tag != "a":
            return
        href = dict(attrs_list).get("href") or ""
        if "living-lab" in urlsplit(href).path.lower():
            self.links.append(href)


def copy_public_source() -> None:
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir()

    for name in sorted(PUBLIC_ROOT_FILES):
        source = ROOT / name
        if not source.is_file():
            raise SystemExit(f"Missing public source file: {name}")
        shutil.copy2(source, OUTPUT / name)

    for directory in sorted(PUBLIC_DIRECTORIES):
        source_root = ROOT / directory
        for source in source_root.rglob("*"):
            if not source.is_file():
                continue
            relative = source.relative_to(ROOT)
            if source.name == ".DS_Store" or is_deferred(relative):
                continue
            destination = OUTPUT / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, destination)


def verify_release() -> None:
    leaks = [
        path.relative_to(OUTPUT).as_posix()
        for path in OUTPUT.rglob("*")
        if path.is_file() and is_deferred(path.relative_to(OUTPUT))
    ]
    if leaks:
        raise SystemExit(f"Deferred Living Lab files entered public output: {', '.join(leaks)}")

    forbidden_roots = ["docs", "artifacts", ".claude", "supabase", "api"]
    present = [name for name in forbidden_roots if (OUTPUT / name).exists()]
    if present:
        raise SystemExit(f"Internal/source-only directories entered public output: {', '.join(present)}")

    linked: list[str] = []
    for page in OUTPUT.glob("*.html"):
        parser = LivingLabLinkParser()
        parser.feed(page.read_text(encoding="utf-8"))
        linked.extend(f"{page.name}: {href}" for href in parser.links)
    if linked:
        raise SystemExit(f"Public Living Lab links remain: {', '.join(linked)}")

    sitemap = (OUTPUT / "sitemap.xml").read_text(encoding="utf-8").lower()
    if "living-lab" in sitemap:
        raise SystemExit("Living Lab remains in the public sitemap")

    print(
        f"Public release built: {len(list(OUTPUT.glob('*.html')))} HTML pages; "
        "Living Lab and internal review material excluded."
    )


if __name__ == "__main__":
    copy_public_source()
    verify_release()
