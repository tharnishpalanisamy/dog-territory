import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  Bell,
  UserRound,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../../hooks/useAuth";

interface NavbarProps {
  title: string;
  subtitle?: string;
  onMenuClick?: () => void;
  notificationCount?: number;
}

export default function Navbar({
  title,
  subtitle,
  onMenuClick,
  notificationCount = 0,
}: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
      {/* Left section */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-indigo-600"
          aria-label={`Notifications: ${notificationCount} unread`}
        >
          <Bell size={20} strokeWidth={1.8} />

          {notificationCount > 0 && (
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen((open) => !open)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 p-2 transition hover:bg-slate-50"
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
              <UserRound size={18} />
            </div>

            <ChevronDown
              size={16}
              className={`text-slate-500 transition ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {profileOpen && (
            <>
              {/* Outside click overlay */}
              <button
                className="fixed inset-0 z-40 cursor-default"
                onClick={() => setProfileOpen(false)}
                aria-label="Close profile menu"
              />

              <div className="absolute right-0 top-14 z-50 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-2 shadow-xl">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    navigate("/user/profile");
                  }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  <UserRound size={17} />
                  My Profile
                </button>

                <div className="my-1 border-t border-slate-100" />

                <button
                  onClick={() => { void logout(); navigate("/signin", { replace: true }); }}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
