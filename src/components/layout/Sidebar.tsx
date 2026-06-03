import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ScanLine,
  History,
  GraduationCap,
} from "lucide-react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classes", label: "Classes", icon: BookOpen },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
];

export default function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-56 bg-white border-r border-gray-100 flex-col">
        {/* Brand */}
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center">
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">
            AttendTrack
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 px-3">v1.0.0</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-100 flex items-center gap-2 px-4 h-12">
        <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
          <GraduationCap size={13} className="text-white" />
        </div>
        <span className="font-semibold text-gray-800 text-sm tracking-tight">
          AttendTrack
        </span>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 flex items-stretch">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] transition-colors ${
                isActive
                  ? "text-green-600 font-medium"
                  : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1 rounded-lg transition-colors ${isActive ? "bg-green-50" : ""}`}>
                  <Icon size={18} />
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </>
  );
}