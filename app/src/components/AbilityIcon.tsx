// Skill icons fetched from BDO Codex (scripts/fetch_icons.py), named by canonical ability id.
const icons = import.meta.glob("../assets/icons/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

export function iconUrl(abilityId: string): string | undefined {
  return icons[`../assets/icons/${abilityId}.webp`];
}

export default function AbilityIcon({
  id,
  size = "sm",
}: {
  id: string;
  /** sm = inline links/entries (17px), row = ledger rows (22px), xl = combo strip (58px). */
  size?: "sm" | "row" | "xl";
}) {
  const url = iconUrl(id);
  if (!url) return null;
  // alt is empty: the icon always accompanies the ability name.
  return <img className={`ability-icon ${size}`} src={url} alt="" loading="lazy" />;
}
