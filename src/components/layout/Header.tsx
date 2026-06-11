import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  const { getUser, logout } = useAuth();
  const user = getUser();

  return (
    <header className="hidden sm:flex h-14 bg-white border-b border-gray-100 items-center justify-between px-6">
      <div />

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            {user?.full_name || "Admin"}
          </p>

          <p className="text-xs text-gray-400">
            {user?.email}
          </p>
        </div>

        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold uppercase">
          {(user?.full_name?.[0] || user?.email?.[0] || "A").toUpperCase()}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="text-gray-400 hover:text-red-500"
        >
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}