
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LocationOnboarding from "../ui/LocationOnboarding";

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
  const location = useLocation();
  const onProfilePage = location.pathname.endsWith("/profile");
  const onRabiesAwarenessPage = location.pathname === "/rabies-awareness";

  return (
    <div className={`app-workspace flex min-h-screen bg-[#f7f8fc] text-[#101d43] ${onRabiesAwarenessPage ? "rabies-workspace" : ""}`}>
      <LocationOnboarding />

      {/* Mobile overlay */}
      {menuOpen && (
        <button
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-[#101d43]/40 backdrop-blur-[2px] lg:hidden"
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen shrink-0 transition-transform duration-300 lg:sticky lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar
          role={role}
          name={name}
          email={email}
        />
      </div>

      {/* Main content - independent scrolling */}
      <div className="flex min-w-0 flex-1 flex-col">

        <div className="sticky top-0 z-30 shrink-0">
          <Navbar
            title={onRabiesAwarenessPage ? "Rabies Awareness" : onProfilePage ? "Profile" : "Overview"}
            subtitle={onRabiesAwarenessPage ? "Community health and animal welfare" : onProfilePage ? "Your account information and community details" : "Welcome to your dashboard"}
            onMenuClick={() => setMenuOpen(true)}
          />
        </div>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
