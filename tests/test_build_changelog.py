"""Unit tests for scripts/build_changelog.py — the release-time changelog generator."""

import sys
from pathlib import Path

# scripts/ isn't a package; add it to the import path so we can import the module directly.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "scripts"))

from build_changelog import build_entry, normalize_version, parse_body, to_date


class TestParseBody:
    def test_empty_body_returns_empty_dict(self):
        assert parse_body("") == {}
        assert parse_body("   \n  ") == {}

    def test_extracts_named_sections(self):
        body = "## Added\n- new thing\n\n## Fixed\n- a bug"
        assert parse_body(body) == {"Added": ["new thing"], "Fixed": ["a bug"]}

    def test_no_headers_buckets_under_notes(self):
        body = "- thing one\n- thing two"
        assert parse_body(body) == {"Notes": ["thing one", "thing two"]}

    def test_header_with_no_bullets_is_omitted(self):
        body = "## Added\n\n## Fixed\n- a real bug"
        assert parse_body(body) == {"Fixed": ["a real bug"]}

    def test_mixed_bullet_markers(self):
        body = "## Added\n* with star\n- with dash"
        assert parse_body(body) == {"Added": ["with star", "with dash"]}

    def test_ignores_trailing_prose(self):
        body = "## Added\n- real item\n\nSome trailing prose without a bullet."
        assert parse_body(body) == {"Added": ["real item"]}

    def test_preserves_unknown_section_names(self):
        # The UI applies neutral styling to unknown names rather than dropping them.
        body = "## Security\n- patched a CVE"
        assert parse_body(body) == {"Security": ["patched a CVE"]}


class TestNormalizeVersion:
    def test_strips_leading_v(self):
        assert normalize_version("v1.2.3") == "1.2.3"

    def test_leaves_unprefixed_version_alone(self):
        assert normalize_version("1.2.3") == "1.2.3"


class TestToDate:
    def test_strips_time_portion(self):
        assert to_date("2026-05-02T15:30:00Z") == "2026-05-02"

    def test_already_date_only(self):
        assert to_date("2026-05-02") == "2026-05-02"


class TestBuildEntry:
    def test_returns_none_when_body_has_no_sections(self):
        release = {"tagName": "v1.0.0", "name": "v1.0.0", "publishedAt": "2026-05-02T00:00:00Z", "body": ""}
        assert build_entry(release) is None

    def test_constructs_entry_from_release(self):
        release = {
            "tagName": "v1.2.0",
            "name": "Spring Release",
            "publishedAt": "2026-05-02T12:00:00Z",
            "body": "## Added\n- footer link\n## Fixed\n- modal bug",
        }
        entry = build_entry(release)
        assert entry == {
            "version": "1.2.0",
            "released_at": "2026-05-02",
            "title": "Spring Release",
            "sections": {"Added": ["footer link"], "Fixed": ["modal bug"]},
        }

    def test_falls_back_to_version_title_when_name_missing(self):
        release = {"tagName": "v0.1.0", "name": None, "publishedAt": "2026-05-02T00:00:00Z", "body": "## Added\n- thing"}
        assert build_entry(release)["title"] == "Version 0.1.0"
