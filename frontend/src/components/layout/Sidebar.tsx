
import { NavLink } from "react-router-dom";
import {
  PawPrint,
  LayoutDashboard,
  Dog,
  FileText,
  Users,
  ClipboardList,
  Stethoscope,
  ShieldCheck,
  PlusCircle,
  UserRound,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type UserRole = "ADMIN" | "VOLUNTEER" | "VETERINARIAN" | "USER";

interface SidebarProps {
  role: UserRole;
  name?: string;
  email?: string;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
}

const navigation: Record<UserRole, NavItem[]> = {
  ADMIN: [
    { label: "Overview", path: "/admin", icon: LayoutDashboard },
    { label: "Dogs", path: "/admin/dogs", icon: Dog },
    { label: "Reports", path: "/admin/reports", icon: FileText },
    { label: "Volunteers", path: "/admin/volunteers", icon: Users },
    { label: "Assignments", path: "/admin/assignments", icon: ClipboardList },
    { label: "Users", path: "/admin/users", icon: UserRound },
  ],

  VOLUNTEER: [
    { label: "Overview", path: "/volunteer", icon: LayoutDashboard },
    { label: "Explore Dogs", path: "/volunteer/dogs", icon: Dog },
    { label: "Available Tasks", path: "/volunteer/tasks", icon: ClipboardList },
    { label: "My Assignments", path: "/volunteer/assignments", icon: FileText },
    { label: "My Reports", path: "/volunteer/reports", icon: FileText },
  ],

  VETERINARIAN: [
    { label: "Overview", path: "/veterinarian", icon: LayoutDashboard },
    { label: "Assigned Dogs", path: "/veterinarian/dogs", icon: Dog },
    { label: "Medical Records", path: "/veterinarian/records", icon: FileText },
    { label: "Treatments", path: "/veterinarian/treatments", icon: Stethoscope },
    { label: "Vaccinations", path: "/veterinarian/vaccinations", icon: ShieldCheck },
  ],

  USER: [
    { label: "Overview", path: "/user", icon: LayoutDashboard },
    { label: "Explore Dogs", path: "/user/dogs", icon: Dog },
    { label: "My Reports", path: "/user/reports", icon: FileText },
    { label: "Report a Dog", path: "/report", icon: PlusCircle },
  ],
};

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrator",
  VOLUNTEER: "Community Volunteer",
  VETERINARIAN: "Veterinarian",
  USER: "Community Member",
};

export default function Sidebar({
  role,
  name = "User",
  email,
}: SidebarProps) {
  const items = navigation[role];

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const profilePath = `/${role.toLowerCase()}/profile`;

  return (
        <aside className="flex h-screen w-[280px] shrink-0 flex-col overflow-hidden border-r border-slate-200 bg-white">
      {/* Brand */}
      <div className="flex h-24 items-center gap-3 px-7">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
          <PawPrint size={25} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            dog territory
          </h1>
          <p className="mt-1 text-[10px] font-semibold tracking-[2px] text-slate-400">
            COMMUNITY CARE
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
        <p className="mb-4 px-4 text-xs font-bold tracking-[1.5px] text-slate-400">
          WORKSPACE
        </p>

        <nav className="space-y-1.5">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }`
                }
              >
                <Icon size={20} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Available to every role */}
          <NavLink
            to={`/${role.toLowerCase()}/rabies-awareness`}
            className={({ isActive }) =>
              `flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
              }`
            }
          >
            <PlusCircle size={20} strokeWidth={1.8} />
            <span>Rabies Awareness</span>
          </NavLink>
        </nav>
      </div>

      {/* {role === "USER" && (
        <div className="mx-5 mb-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
          <Sparkles size={19} className="mb-4 text-indigo-600" />

          <h3 className="text-sm font-semibold text-slate-900">
            Every small act matters.
          </h3>

          <p className="mt-2 text-xs leading-5 text-slate-500">
            Your care helps build safer streets for every dog.
          </p>

          <NavLink
            to="/report"
            className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800"
          >
            Share a sighting
            <ChevronRight size={15} />
          </NavLink>
        </div>
      )} */}

      {/* Profile */}
      <div className="border-t border-slate-100 p-5">
        <NavLink
          to={profilePath}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50 ${
              isActive ? "bg-indigo-50" : ""
            }`
          }
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-600">
            {initials || <UserRound size={19} />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">
              {name}
            </p>
            <p className="truncate text-xs text-slate-500">
              {email || roleLabels[role]}
            </p>
          </div>

          <ChevronRight size={17} className="text-slate-400" />
        </NavLink>
      </div>
    </aside>
  );
}
