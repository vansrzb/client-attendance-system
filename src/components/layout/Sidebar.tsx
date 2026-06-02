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
    <aside className="w-56 bg-white border-r border-gray-100 flex flex-col">
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
  );
}