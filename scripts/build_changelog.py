#!/usr/bin/env python3
#Jonathan Torres wrote 127 lines of code for this file
"""Regenerate src/data/changelog.json from this repo's GitHub Releases.

Source of truth = GitHub Releases. Run on every release publish from
.github/workflows/release.yml so the JSON baked into the Docker image
always reflects current reality (editing a release body fixes the next build).

Release body convention (Keep-a-Changelog style):

    ## Added
    - thing one
    - thing two

    ## Fixed
    - bug

Recognized section names (Added / Changed / Fixed / Removed) get colored
accents in the UI; other names render with neutral styling.

Requires `gh` CLI (pre-installed on ubuntu-latest runners). Authenticated
via GH_TOKEN env var.
"""

import json
import re
import subprocess
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT = REPO_ROOT / "src" / "data" / "changelog.json"
SHOW_UNTIL_DAYS = 14

SECTION_HEADER_RE = re.compile(r"^##\s+([^\n]+?)\s*$", re.MULTILINE)
BULLET_RE = re.compile(r"^\s*[-*]\s+(.+?)\s*$", re.MULTILINE)


def parse_body(body: str) -> dict:
    sections: dict[str, list[str]] = {}
    if not body or not body.strip():
        return sections

    matches = list(SECTION_HEADER_RE.finditer(body))
    if not matches:
        # No section headers — surface bullets under a generic "Notes" bucket.
        items = [b.group(1).strip() for b in BULLET_RE.finditer(body)]
        if items:
            sections["Notes"] = items
        return sections

    for i, m in enumerate(matches):
        name = m.group(1).strip()
        start = m.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
        items = [b.group(1).strip() for b in BULLET_RE.finditer(body[start:end])]
        if items:
            sections[name] = items

    return sections


def normalize_version(tag: str) -> str:
    return tag[1:] if tag.startswith("v") else tag


def to_date(iso: str) -> str:
    return iso.split("T", 1)[0]


def fetch_releases() -> list[dict]:
    result = subprocess.run(
        [
            "gh", "release", "list",
            "--exclude-drafts", "--exclude-pre-releases",
            "--limit", "100",
            "--json", "tagName,name,publishedAt,body",
        ],
        check=True, capture_output=True, text=True,
    )
    return json.loads(result.stdout)


def build_entry(release: dict) -> dict | None:
    sections = parse_body(release.get("body") or "")
    if not sections:
        return None
    version = normalize_version(release["tagName"])
    return {
        "version": version,
        "released_at": to_date(release["publishedAt"]),
        "title": release.get("name") or f"Version {version}",
        "sections": sections,
    }


def main() -> int:
    try:
        releases = fetch_releases()
    except subprocess.CalledProcessError as e:
        print(f"gh failed: {e.stderr}", file=sys.stderr)
        return 1

    releases.sort(key=lambda r: r.get("publishedAt", ""), reverse=True)
    entries = [e for e in (build_entry(r) for r in releases) if e]

    if entries:
        latest = entries[0]
        released = datetime.fromisoformat(latest["released_at"]).replace(tzinfo=timezone.utc)
        payload = {
            "version": latest["version"],
            "released_at": latest["released_at"],
            "show_until": (released + timedelta(days=SHOW_UNTIL_DAYS)).date().isoformat(),
            "entries": entries,
        }
    else:
        payload = {"entries": []}

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n")
    print(f"Wrote {len(entries)} entries to {OUTPUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
