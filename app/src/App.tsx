import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import StudyModePage from "./pages/StudyModePage";
import SetupPage from "./pages/SetupPage";
import CombosPage from "./pages/CombosPage";
import PracticePage from "./pages/PracticePage";

export default function App() {
  return (
    <div className="app">
      <header className="topbar">
        <span className="brand">Succession Maegu</span>
        <nav>
          <span className="nav-group">Study</span>
          <NavLink to="/study/pve">PvE</NavLink>
          <NavLink to="/study/aos">AOS</NavLink>
          <NavLink to="/study/setup">Setup</NavLink>
          <NavLink to="/study/combos">Combos</NavLink>
          <span className="nav-group">Practice</span>
          <NavLink to="/practice/pve">PvE</NavLink>
          <NavLink to="/practice/aos">AOS</NavLink>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/study/pve" replace />} />
          <Route path="/study/pve" element={<StudyModePage mode="pve" />} />
          <Route path="/study/aos" element={<StudyModePage mode="pvp" />} />
          <Route path="/study/setup" element={<SetupPage />} />
          <Route path="/study/combos" element={<CombosPage />} />
          <Route path="/practice/pve" element={<PracticePage mode="pve" />} />
          <Route path="/practice/aos" element={<PracticePage mode="pvp" />} />
          <Route path="*" element={<Navigate to="/study/pve" replace />} />
        </Routes>
      </main>
    </div>
  );
}
