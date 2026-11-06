import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { Avatar } from "./Shared";

const navigation = [
  { to: "/dashboard", label: "Overview", icon: "▦", end: true },
  { to: "/dogs", label: "Dogs", icon: "♧" },
  { to: "/reports", label: "Reports", icon: "▤" },
  { to: "/volunteers", label: "Volunteers", icon: "♙" },
  { to: "/awareness", label: "Rabies Awareness", icon: "✚" },
];

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  return <div className="dashboard-shell">
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <NavLink to="/dashboard" className="dashboard-brand"><span className="brand-mark">🐾</span><span><strong>dog territory</strong><small>COMMUNITY CARE</small></span></NavLink>
      <div className="nav-caption">WORKSPACE</div>
      <nav className="sidebar-nav">{navigation.map(({ to, label, icon, end }) => <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}><span className="nav-icon">{icon}</span>{label}{label === "Reports" && <span className="nav-count">4</span>}</NavLink>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><span>✦</span><strong>Every small act matters.</strong><p>Your care helps build safer streets for every dog.</p><NavLink to="/reports/create">Share a sighting <span>→</span></NavLink></div><NavLink className="sidebar-profile" to="/profile" onClick={() => setOpen(false)}><Avatar name="AR" /><span><strong>Ananya Rao</strong><small>Community volunteer</small></span><span className="profile-chevron">⌄</span></NavLink></div>
    </aside>
    {open && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setOpen(false)} />}
    <div className="dashboard-main"><header className="dashboard-topbar"><button className="mobile-nav-toggle" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">☰</button><div className="topbar-context">Community workspace <span>/</span> <strong>Care dashboard</strong></div><div className="topbar-right"><span className="today-label">Bengaluru, Karnataka</span><button className="top-icon" aria-label="Notifications">♧<i /></button><NavLink to="/profile" className="topbar-user"><Avatar name="AR" /><span>Ananya Rao</span><b>⌄</b></NavLink></div></header><main className="dashboard-content"><Outlet /></main><footer className="dashboard-footer"><span>© 2026 Dog Territory</span><span>Every dog. Every life. <b>♥</b></span></footer></div>
  </div>;
}
