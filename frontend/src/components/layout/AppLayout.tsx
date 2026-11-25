
import { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import LocationOnboarding from "../ui/LocationOnboarding";

type UserRole = "ADMIN" | "VOLUNTEER" | "VETERINARIAN" | "USER";

interface AppLayoutProps {
  role: UserRole;
  allowedRoles?: UserRole[];
  name?: string;
  email?: string;
}

export default function AppLayout({
  role,
  allowedRoles = [role],
  name = "User",
  email,
}: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isLoading, authError, retrySessionRestore } = useAuth();
  const onProfilePage = location.pathname.endsWith("/profile");
  const onRabiesAwarenessPage = location.pathname === "/rabies-awareness";

  if (isLoading) {
    return <div className="p-8 text-center text-sm text-slate-500" role="status">Restoring your session…</div>;
  }
  if (authError) {
    return (
      <div className="p-8 text-center text-sm text-slate-600" role="alert">
        <p>{authError}</p>
        <button className="mt-3 rounded bg-indigo-600 px-4 py-2 text-white" onClick={() => void retrySessionRestore()}>
          Retry
        </button>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname }} />;
  }
  const userRole = user.role.toUpperCase() as UserRole;
  if (!allowedRoles.includes(userRole)) {
    const homeByRole: Record<UserRole, string> = {
      ADMIN: "/admin",
      VOLUNTEER: "/volunteer",
      VETERINARIAN: "/veterinarian",
      USER: "/user",
    };
    return <Navigate to={homeByRole[userRole]} replace />;
  }

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
