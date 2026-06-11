"""Fetch each ability's skill icon from BDO Codex into app/src/assets/icons/<ability-id>.webp.

The icon path comes from the saved tooltip HTML (research/bdocodex/raw/skill-<ID>.html,
first <img src=".../pkow_skill_<ID>.webp">), so a refresh follows the same flow as other
live facts (HANDOFF §1): re-pull the raw HTML, then re-run this script. Icons already
present locally (research/bdocodex/icons/<ID>.webp or an existing app asset) are reused
without hitting the network.
"""
import json
import re
import shutil
import sys
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "research" / "bdocodex" / "raw"
LOCAL_ICONS = ROOT / "research" / "bdocodex" / "icons"
OUT = ROOT / "app" / "src" / "assets" / "icons"
BASE_URL = "https://bdocodex.com"

abilities = json.loads((ROOT / "data" / "abilities.json").read_text(encoding="utf-8"))["abilities"]
OUT.mkdir(parents=True, exist_ok=True)

fetched, reused, skipped, errors = 0, 0, [], []
for a in abilities:
    tooltip = a.get("tooltip")
    if not tooltip:
        skipped.append(a["id"])
        continue
    sid = tooltip["bdocodex_id"]
    dest = OUT / f"{a['id']}.webp"
    if dest.exists():
        reused += 1
        continue
    local = LOCAL_ICONS / f"{sid}.webp"
    if local.exists():
        shutil.copyfile(local, dest)
        reused += 1
        continue
    raw = RAW / f"skill-{sid}.html"
    if not raw.exists():
        errors.append(f"{a['id']}: no raw HTML for skill {sid}")
        continue
    src = raw.read_text(encoding="utf-8-sig", errors="replace")
    # The tooltip's own icon is the width="40" img; rank pages (Spirit Swirl III etc.)
    # reuse their base rank's icon id, so don't require the id to match.
    m = re.search(r'<img src="(/items/[^"]+\.webp)" alt="icon" width="40"', src)
    if not m:
        errors.append(f"{a['id']}: no own-icon <img> in skill-{sid}.html")
        continue
    url = BASE_URL + m.group(1)
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        dest.write_bytes(urllib.request.urlopen(req, timeout=30).read())
        fetched += 1
        time.sleep(0.3)  # be polite
    except Exception as e:  # noqa: BLE001
        errors.append(f"{a['id']}: {url} -> {e}")

print(f"fetched {fetched}, reused {reused}, skipped (no tooltip): {skipped}")
if errors:
    print("ERRORS:\n" + "\n".join(errors))
    sys.exit(1)
