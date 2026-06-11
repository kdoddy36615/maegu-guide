import type { ReactNode } from "react";
import type { Mode } from "../data/types";
import { combosFile } from "../data";

/** Section-header pattern: uppercase h2 + mono count + right-aligned dim description. */
export function Section({
  id,
  title,
  count,
  desc,
  children,
}: {
  id: string;
  title: string;
  count?: number | string;
  desc?: string;
  children: ReactNode;
}) {
  return (
    <section className="sec" id={id}>
      <div className="sechead">
        <h2>{title}</h2>
        {count != null && <span className="cnt">{count}</span>}
        {desc && <span className="d">{desc}</span>}
      </div>
      {children}
    </section>
  );
}

/** Page h1 with the accent mode badge, plus the one-line dim subtitle. */
export function PageHeader({ title, mode, children }: { title: string; mode: Mode; children: ReactNode }) {
  return (
    <>
      <h1 className="h1">
        {title}
        <span className="mode-badge">{mode === "pve" ? "PVE" : "PVP"}</span>
      </h1>
      <p className="page-sub">{children}</p>
    </>
  );
}

/** Tagged callout row (mono tag + dim text). warn = SA-gold tinted. */
export function Callout({ tag, warn, children }: { tag?: string; warn?: boolean; children: ReactNode }) {
  return (
    <div className={warn ? "callout warn" : "callout"}>
      {tag && <span className="tag">{tag}</span>}
      <span>{children}</span>
    </div>
  );
}

/** The AOS staleness disclaimer — every PvP page keeps it (ADR 0004). */
export function Staleness() {
  return (
    <Callout tag="STALENESS" warn>
      {combosFile._meta.pvp_caveat}
    </Callout>
  );
}
