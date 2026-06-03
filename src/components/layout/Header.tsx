import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";

export default function Header() {
  const { getTeacher, logout } = useAuth();
  const teacher = getTeacher();

  return (
    <header className="hidden sm:flex h-14 bg-white border-b border-gray-100 items-center justify-between px-6">
      <div />
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">{teacher?.full_name}</p>
          <p className="text-xs text-gray-400">{teacher?.email}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-semibold uppercase">
          {teacher?.full_name?.[0] ?? "T"}
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