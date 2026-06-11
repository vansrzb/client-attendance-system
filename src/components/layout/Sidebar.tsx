import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ScanLine,
  History,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/classes", label: "Classes", icon: BookOpen },
  { to: "/students", label: "Students", icon: Users },
  { to: "/attendance", label: "Attendance", icon: ScanLine },
  { to: "/history", label: "History", icon: History },
];

function usePHTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      );
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, date };
}

export default function Sidebar() {
  const { time, date } = usePHTime();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-56 bg-white border-r border-gray-100 flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center">
            <GraduationCap size={15} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">
            AttendTrack
          </span>
        </div>

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

        {/* Bottom — credits */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="px-3 flex items-center gap-1.5">
            <span className="text-[11px] text-gray-300 tabular-nums leading-none">
              © 2026
            </span>
            <span
              className="text-[11px] text-gray-400 font-medium leading-none tracking-tight"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              vansrzb
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-12">
        {/* Left: logo + name */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
            <GraduationCap size={13} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">
            AttendTrack
          </span>
        </div>

        {/* Right: clock */}
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
          <span
            className="text-xs font-medium text-gray-700 tabular-nums tracking-tight"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {time}
          </span>
          <span className="text-[11px] text-gray-400">{date}</span>
          <span
            className="text-[10px] text-gray-300 tracking-widest"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            PHT
          </span>
        </div>
      </header>

      {/* Mobile bottom nav */}
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 flex items-stretch">
        {links.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center justify-center py-2 text-[10px] transition-colors ${
                isActive ? "text-green-600 font-medium" : "text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <span
                className={`p-1 rounded-lg transition-colors ${
                  isActive ? "bg-green-50" : ""
                }`}
              >
                <Icon size={18} />
              </span>
            )}
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="flex-1 flex items-center justify-center py-2 text-red-500 active:scale-95 transition"
        >
          <span className="p-1 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
        </button>
      </nav>
    </>
  );
}
