#!/usr/bin/env python3
"""Create WebP variants for live raster assets and refresh HTML image markup."""

from __future__ import annotations

import argparse
import re
from pathlib import Path

from PIL import Image, ImageOps


RASTER_REF = re.compile(
    r"""assets/[^"'\\<> ]+\.(?:jpe?g|png|webp|avif)""",
    re.IGNORECASE,
)
IMG_TAG = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
PICTURE_BLOCK = re.compile(r"<picture\b.*?</picture>", re.IGNORECASE | re.DOTALL)
SRC_ATTR = re.compile(r"""\bsrc=(["'])(.*?)\1""", re.IGNORECASE)
CLASS_ATTR = re.compile(r"""\bclass=(["'])(.*?)\1""", re.IGNORECASE)
ORIGINAL_EXTENSIONS = (
    ".JPG",
    ".jpg",
    ".JPEG",
    ".jpeg",
    ".PNG",
    ".png",
)


def output_path(source: Path) -> Path:
    relative = source.relative_to("assets")
    return Path("assets/optimized") / relative.with_suffix(".webp")


def max_width_for(source: Path) -> int:
    source_text = source.as_posix().lower()
    if "/school-logos/" in source_text:
        return 320
    if "/partners/" in source_text or "/edtech/" in source_text:
        return 480
    if "/branding/" in source_text:
        return 600
    if "/ai-pics/" in source_text:
        return 1200
    if "about-me-circle" in source_text:
        return 800
    return 1920


def optimize(
    source: Path,
    destination: Path,
    *,
    max_width: int | None = None,
) -> tuple[int, int]:
    max_width = max_width or max_width_for(source)
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened)
        if image.width > max_width:
            height = round(image.height * (max_width / image.width))
            image = image.resize((max_width, height), Image.Resampling.LANCZOS)

        destination.parent.mkdir(parents=True, exist_ok=True)
        has_alpha = image.mode in {"RGBA", "LA"} or (
            image.mode == "P" and "transparency" in image.info
        )
        image = image.convert("RGBA" if has_alpha else "RGB")
        image.save(
            destination,
            "WEBP",
            quality=86 if has_alpha else 80,
            method=6,
        )
        return image.width, image.height


def original_for_optimized(reference: str, root: Path) -> Path | None:
    """Find the retained source image for an assets/optimized reference."""
    optimized = Path(reference)
    try:
        relative = optimized.relative_to("assets/optimized")
    except ValueError:
        return None

    original_base = root / "assets" / relative
    candidates = [original_base.with_suffix(extension) for extension in ORIGINAL_EXTENSIONS]
    return next((candidate for candidate in candidates if candidate.exists()), None)


def card_image_references(html: str) -> set[str]:
    """Return raster sources used by the site's card banner treatment."""
    references: set[str] = set()
    for match in IMG_TAG.finditer(html):
        tag = match.group(0)
        class_match = CLASS_ATTR.search(tag)
        classes = set(class_match.group(2).split()) if class_match else set()
        if "card-img-zoom" not in classes:
            continue
        src_match = SRC_ATTR.search(tag)
        if src_match:
            references.add(src_match.group(2))
    return references


def add_attr(tag: str, name: str, value: str) -> str:
    if re.search(rf"\b{name}=", tag, re.IGNORECASE):
        return tag
    return re.sub(r"\s*/?>$", lambda match: f' {name}="{value}"{match.group(0)}', tag)


def set_attr(tag: str, name: str, value: str) -> str:
    pattern = re.compile(rf"""\b{name}=(["']).*?\1""", re.IGNORECASE)
    if pattern.search(tag):
        return pattern.sub(f'{name}="{value}"', tag)
    return add_attr(tag, name, value)


def update_img_tags(html: str, project_root: Path) -> str:
    hero_slide_seen = False

    def replace(tag_match: re.Match[str]) -> str:
        nonlocal hero_slide_seen
        tag = tag_match.group(0)
        src_match = SRC_ATTR.search(tag)
        if not src_match or not src_match.group(2):
            return tag

        source = project_root / src_match.group(2)
        if not source.exists():
            return tag

        try:
            with Image.open(source) as image:
                width, height = image.size
        except OSError:
            return tag

        class_match = CLASS_ATTR.search(tag)
        classes = set(class_match.group(2).split()) if class_match else set()
        is_nav_logo = bool(
            classes
            & {
                "iu29-logo",
                "site-logo",
                "iu29-mark",
                "stem-mark",
            }
        )
        is_hero_slide = "hero-slide" in classes

        tag = set_attr(tag, "width", str(width))
        tag = set_attr(tag, "height", str(height))
        tag = add_attr(tag, "decoding", "async")

        if is_hero_slide and not hero_slide_seen:
            tag = set_attr(tag, "loading", "eager")
            tag = add_attr(tag, "fetchpriority", "high")
            hero_slide_seen = True
        elif not is_nav_logo:
            tag = set_attr(tag, "loading", "lazy")

        return tag

    return IMG_TAG.sub(replace, html)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--root",
        type=Path,
        default=Path.cwd(),
        help="Project root containing the live HTML files and assets directory.",
    )
    args = parser.parse_args()
    root = args.root.resolve()
    pages = sorted(root.glob("*.html"))

    references: set[str] = set()
    card_references: set[str] = set()
    for page in pages:
        html = page.read_text(encoding="utf-8")
        references.update(RASTER_REF.findall(html))
        card_references.update(card_image_references(html))

    card_destinations: set[str] = set()
    for reference in card_references:
        if reference.startswith("assets/optimized/"):
            card_destinations.add(reference)
        elif Path(reference).suffix.lower() not in {".webp", ".avif"}:
            card_destinations.add(output_path(Path(reference)).as_posix())

    replacements: dict[str, str] = {}
    optimized_count = 0
    for reference in sorted(references):
        source = root / reference
        if not source.exists():
            continue

        if reference.startswith("assets/optimized/"):
            retained_original = original_for_optimized(reference, root)
            if retained_original is None:
                continue
            destination = source
            max_width = (
                1200 if reference in card_destinations else max_width_for(retained_original)
            )
            with Image.open(destination) as current:
                exceeds_limit = current.width > max_width
            if (
                destination.stat().st_mtime < retained_original.stat().st_mtime
                or exceeds_limit
            ):
                optimize(
                    retained_original,
                    destination,
                    max_width=max_width,
                )
                optimized_count += 1
            continue

        if source.suffix.lower() in {".webp", ".avif"}:
            continue

        destination = root / output_path(Path(reference))
        optimized_reference = destination.relative_to(root).as_posix()
        max_width = 1200 if optimized_reference in card_destinations else max_width_for(source)
        if not destination.exists() or destination.stat().st_mtime < source.stat().st_mtime:
            optimize(source, destination, max_width=max_width)
            optimized_count += 1
        replacements[reference] = optimized_reference

    for page in pages:
        html = page.read_text(encoding="utf-8")
        picture_blocks: list[str] = []

        def hold_picture(match: re.Match[str]) -> str:
            picture_blocks.append(match.group(0))
            return f"___STEM_PICTURE_BLOCK_{len(picture_blocks) - 1}___"

        html = PICTURE_BLOCK.sub(hold_picture, html)
        for original, optimized in replacements.items():
            html = html.replace(original, optimized)
        for index, picture in enumerate(picture_blocks):
            html = html.replace(f"___STEM_PICTURE_BLOCK_{index}___", picture)
        html = update_img_tags(html, root)
        page.write_text(html, encoding="utf-8")

    print(
        f"Optimized {optimized_count} raster assets and updated {len(pages)} HTML pages."
    )


if __name__ == "__main__":
    main()
