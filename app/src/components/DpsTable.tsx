import type { DpsRow, Mode } from "../data/types";

const fmt = (v: number | null) =>
  v == null ? "—" : v.toLocaleString("en-US", { maximumFractionDigits: 1 });

/** Renders locked DPS-sheet rows verbatim — values are never recomputed (ADR 0001). */
export default function DpsTable({ rows, mode }: { rows: DpsRow[]; mode: Mode }) {
  if (!rows.length) return <p className="dim small">No DPS rows — not on the DPS sheet.</p>;
  return (
    <table className="dps-table">
      <thead>
        <tr>
          <th>Sheet row</th>
          <th>Input</th>
          <th>Variant</th>
          {mode === "pve" ? (
            <>
              <th className="num">PvE DPS</th>
              <th className="num">PvE DPS (BSR)</th>
            </>
          ) : (
            <>
              <th className="num">PvP DPS</th>
              <th className="num">PvP dmg %</th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.sheet_label}</td>
            <td>
              <span className="kbd">{r.input}</span>
            </td>
            <td className="dim">{r.variant ?? "—"}</td>
            {mode === "pve" ? (
              <>
                <td className="num">{fmt(r.pve_dps_non_bsr)}</td>
                <td className="num">{fmt(r.pve_dps_bsr)}</td>
              </>
            ) : (
              <>
                <td className="num">{fmt(r.pvp_dps)}</td>
                <td className="num">{r.pvp_dmg_pct == null ? "—" : `${r.pvp_dmg_pct}%`}</td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
