/**
 * Page registry + per-page/per-mode tables of contents for the sidebar.
 * ToC entries scroll to in-page section anchors (ids rendered by the pages).
 */
import { COMBO_FAMILIES, combos, sectionsFor } from "./data";
import type { Mode } from "./data/types";

export type Page = "abilities" | "setup" | "combos" | "practice";

export const PAGES: { slug: Page; label: string }[] = [
  { slug: "abilities", label: "Abilities" },
  { slug: "setup", label: "Setup" },
  { slug: "combos", label: "Combos" },
  { slug: "practice", label: "Practice" },
];

export function isPage(p: string | undefined): p is Page {
  return PAGES.some((x) => x.slug === p);
}

export interface TocEntry {
  id: string;
  label: string;
  count?: number;
}

export function tocFor(page: Page, mode: Mode): TocEntry[] {
  switch (page) {
    case "abilities": {
      const s = sectionsFor(mode, { includeLocked: true });
      return [
        ...(mode === "pve" ? [{ id: "sec-priority", label: "DPS Priority List" }] : []),
        { id: "sec-movement", label: "Movement & utility", count: s.movement.length },
        { id: "sec-protected", label: "Protected DPS", count: s.protected.length },
        { id: "sec-unprotected", label: "Unprotected DPS", count: s.unprotected.length },
      ];
    }
    case "setup":
      return mode === "pve"
        ? [
            { id: "sec-skills", label: "Skill choices" },
            { id: "sec-rabams", label: "Rabams" },
            { id: "sec-addons", label: "Addons" },
            { id: "sec-reforge", label: "Reforge stones" },
            { id: "sec-buffs", label: "Buffs & debuffs" },
            { id: "sec-bsr", label: "BSR" },
            { id: "sec-earlygame", label: "Earlygame" },
            { id: "sec-ui", label: "In-game UI reference" },
          ]
        : [
            { id: "sec-skills", label: "Skill choices" },
            { id: "sec-rabams", label: "Rabams" },
            { id: "sec-addons", label: "Addons" },
          ];
    case "combos": {
      if (mode === "pve") {
        return [
          ...combos.filter((c) => c.mode === "pve").map((c) => ({ id: c.id, label: c.name })),
          { id: "sec-cancels", label: "Cancel fundamentals" },
          { id: "sec-priority-video", label: "Priority — video variant" },
        ];
      }
      return [
        ...COMBO_FAMILIES.map((f) => ({
          id: `fam-${f.prefix}`,
          label: `${f.name} family`,
          count: combos.filter((c) => c.id.startsWith(f.prefix)).length,
        })),
        { id: "sec-cancels", label: "Cancel fundamentals" },
      ];
    }
    case "practice":
      return [
        { id: "sec-combos", label: "Combos", count: combos.filter((c) => c.mode === mode).length },
        { id: "sec-layout", label: "Section layout" },
      ];
  }
}
