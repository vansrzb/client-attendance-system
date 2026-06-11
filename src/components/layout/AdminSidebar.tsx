import { NavLink } from "react-router-dom";
import { LayoutDashboard, ShieldCheck, LogOut } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
];

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

export default function AdminSidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-56 bg-white border-r border-gray-100 flex-col">
        <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
          <div className="w-7 h-7 rounded-md bg-green-600 flex items-center justify-center">
            <ShieldCheck size={15} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">
            Admin Panel
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

        {/* Desktop logout */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sm:hidden fixed top-0 inset-x-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 h-12">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-600 flex items-center justify-center">
            <ShieldCheck size={13} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800 text-sm tracking-tight">
            Admin Panel
          </span>
        </div>

        {/* Mobile logout in top bar */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 active:scale-95 transition-all"
        >
          <LogOut size={16} />
        </button>
      </header>
    </>
  );
}