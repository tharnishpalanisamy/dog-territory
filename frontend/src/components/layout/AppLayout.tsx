
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

type UserRole = "ADMIN" | "VOLUNTEER" | "VETERINARIAN" | "USER";

interface AppLayoutProps {
  role: UserRole;
  name?: string;
  email?: string;
}

export default function AppLayout({
  role,
  name = "User",
  email,
}: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-50">

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role={role}
          name={name}
          email={email}
        />
      </div>

      {/* Main content */}
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">

        <Navbar
          title="Overview"
          subtitle="Welcome to your dashboard"
          onMenuClick={() => setMenuOpen(true)}
        />

        <main className="flex-1 p-5 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
