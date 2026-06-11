import { useEffect, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useParams } from "react-router-dom";
import type { Mode } from "./data/types";
import { PAGES, isPage, tocFor } from "./toc";
import type { Page } from "./toc";
import netheraxImg from "./assets/credits/netherax.png";
import bantalopeImg from "./assets/credits/bantalope.png";
import FeedbackModal from "./components/FeedbackModal";
import AbilitiesPage from "./pages/AbilitiesPage";
import SetupPage from "./pages/SetupPage";
import CombosPage from "./pages/CombosPage";
import PracticePage from "./pages/PracticePage";

const MODE_KEY = "maegu.mode";

/** Last chosen mode — defaults to PvE, never silently to PvP. */
function storedMode(): Mode {
  try {
    return localStorage.getItem(MODE_KEY) === "pvp" ? "pvp" : "pve";
  } catch {
    return "pve";
  }
}

/** Redirect for the pre-redesign routes; keeps any #ability-id hash. */
function Legacy({ page, mode }: { page: Page; mode?: Mode }) {
  const location = useLocation();
  const m = mode ?? storedMode();
  return <Navigate to={{ pathname: `/${m}/${page}`, hash: location.hash }} replace />;
}

function Sidebar({
  mode,
  page,
  navOpen,
  setNavOpen,
  onFeedback,
}: {
  mode: Mode;
  page: Page;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  onFeedback: () => void;
}) {
  const location = useLocation();
  const toc = tocFor(page, mode);
  const close = () => setNavOpen(false);

  return (
    <aside className={navOpen ? "side open" : "side"}>
      <div className="brand">
        <div className="t">
          Succession <em>Maegu</em>
        </div>
        <div className="s">GUIDE &amp; PRACTICE</div>
        <div className="brand-src">
          <div className="h">Sources</div>
          <div className="r">
            <span className="m">PVE</span>
            <img className="who-img" src={netheraxImg} alt="Netherax" />
          </div>
          <div className="r">
            <span className="m">PVP</span>
            <img className="who-img" src={bantalopeImg} alt="Bantalope" />
          </div>
        </div>
        <button
          className="hamburger"
          onClick={() => setNavOpen(!navOpen)}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          ☰
        </button>
      </div>

      <div className="mode-toggle" role="group" aria-label="Mode">
        {(["pve", "pvp"] as const).map((m) => (
          <Link
            key={m}
            className={m === mode ? "on" : ""}
            to={`/${m}/${page}`}
            onClick={close}
            aria-current={m === mode ? "true" : undefined}
          >
            {m === "pve" ? "PVE" : "PVP"}
          </Link>
        ))}
      </div>

      <div className="nav-area">
        <span className="grp">Pages</span>
        {PAGES.map((p) => (
          <div key={p.slug}>
            <NavLink className="nav" to={`/${mode}/${p.slug}`} onClick={close}>
              {p.label}
            </NavLink>
            {p.slug === page && (
              <div className="toc">
                {toc.map((e, i) => (
                  <Link
                    key={e.id}
                    className={location.hash === `#${e.id}` ? "on" : ""}
                    to={`/${mode}/${page}#${e.id}`}
                    onClick={close}
                  >
                    <span className="n">{i + 1}</span>
                    <span className="l">{e.label}</span>
                    {e.count != null && <span className="c">{e.count}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="credits">
        <button className="r feedback" onClick={onFeedback}>
          <span className="m">✉</span>Feedback
        </button>
      </div>
    </aside>
  );
}

function Shell() {
  const params = useParams();
  const location = useLocation();
  const [navOpen, setNavOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  const modeParam = params.mode;
  const pageParam = params.page;
  const valid = (modeParam === "pve" || modeParam === "pvp") && isPage(pageParam);
  const mode: Mode = modeParam === "pvp" ? "pvp" : "pve";
  const page: Page = isPage(pageParam) ? pageParam : "abilities";

  // Mode is global: re-point --accent via data-mode and persist the choice.
  useEffect(() => {
    if (!valid) return;
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch {
      /* private mode etc. — persistence is best-effort */
    }
  }, [valid, mode]);

  // ToC links and ability links scroll to in-page anchors.
  useEffect(() => {
    if (!valid) return;
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [valid, location.pathname, location.hash]);

  if (!valid) return <Navigate to={`/${storedMode()}/abilities`} replace />;

  return (
    <div className="app">
      <Sidebar
        mode={mode}
        page={page}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
        onFeedback={() => setFeedbackOpen(true)}
      />
      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      <main className="main">
        {page === "abilities" && <AbilitiesPage key={mode} mode={mode} />}
        {page === "setup" && <SetupPage key={mode} mode={mode} />}
        {page === "combos" && <CombosPage key={mode} mode={mode} />}
        {page === "practice" && <PracticePage key={mode} mode={mode} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Legacy page="abilities" />} />
      {/* Pre-redesign routes (smoke script + old bookmarks) */}
      <Route path="/study/pve" element={<Legacy page="abilities" mode="pve" />} />
      <Route path="/study/aos" element={<Legacy page="abilities" mode="pvp" />} />
      <Route path="/study/setup" element={<Legacy page="setup" />} />
      <Route path="/study/combos" element={<Legacy page="combos" />} />
      <Route path="/practice/pve" element={<Legacy page="practice" mode="pve" />} />
      <Route path="/practice/aos" element={<Legacy page="practice" mode="pvp" />} />
      <Route path="/:mode/:page" element={<Shell />} />
      <Route path="*" element={<Legacy page="abilities" />} />
    </Routes>
  );
}
