"""Validate referential integrity of data/*.json: every ability reference anywhere
must exist in data/abilities.json (null allowed for flagged unknowns)."""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data"

abilities = json.loads((DATA / "abilities.json").read_text(encoding="utf-8"))
IDS = {a["id"] for a in abilities["abilities"]}
errors = []


def check(ref, where):
    if ref is not None and ref not in IDS:
        errors.append(f"{where}: unknown ability ref {ref!r}")


def walk(node, where):
    """Recursively check every field that by convention holds ability ids."""
    id_fields = {"ability", "skill", "abilities", "choices", "faster_after", "faster_into",
                 "cancelled_into_from", "cancelled_out_into", "ability_refs",
                 "skills_with_addons", "instant_flows_from_everything",
                 "fast_recovery_cancellers", "ranged", "big_frontal_aoe", "close_aoe",
                 "between_packs", "advanced_between_packs", "pve_pick", "aos_pick",
                 "alternative"}
    if isinstance(node, dict):
        for k, v in node.items():
            if k in id_fields:
                for ref in (v if isinstance(v, list) else [v]):
                    if isinstance(ref, str):
                        check(ref, f"{where}.{k}")
            elif k == "sequence" and isinstance(v, list):
                for ref in v:
                    for part in re.split(r"\|", ref):
                        check(part, f"{where}.sequence")
            else:
                walk(v, f"{where}.{k}")
    elif isinstance(node, list):
        for i, v in enumerate(node):
            walk(v, f"{where}[{i}]")


for fname in ("combos.json", "cancels.json", "setup.json", "dps.json"):
    doc = json.loads((DATA / fname).read_text(encoding="utf-8"))
    walk(doc, fname)

# rabam alternative links inside abilities.json
for a in abilities["abilities"]:
    if a.get("rabam"):
        check(a["rabam"]["alternative"], f"abilities.json:{a['id']}.rabam.alternative")

if errors:
    print("\n".join(errors))
    sys.exit(1)
print(f"OK — all ability references resolve ({len(IDS)} canonical ids).")
