
import { Menu, Bell } from "lucide-react";

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
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">

      {/* Left section */}
      <div className="flex items-center gap-4">

        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>

        {/* Page title */}
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              {subtitle}
            </p>
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

      </div>
    </header>
  );
}
