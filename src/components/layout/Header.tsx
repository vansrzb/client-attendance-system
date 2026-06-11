import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";

function usePHTime() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      const dateStr = now.toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        weekday: "short",
        month: "short",
        day: "numeric",
      });
      setTime(timeStr);
      setDate(dateStr);
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return { time, date };
}

export default function Header() {
  const { getUser, logout } = useAuth();
  const user = getUser();
  const { time, date } = usePHTime();

  return (
    <header className="hidden sm:flex h-14 bg-white border-b border-gray-100 items-center justify-between px-6">
      {/* PH Time — left */}
      <div className="flex items-center gap-2.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <div className="flex items-baseline gap-2">
          <span
            className="text-sm font-medium text-gray-800 tabular-nums tracking-tight"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {time}
          </span>
          <span className="text-xs text-gray-400 tracking-wide">
            {date}
          </span>
          <span
            className="text-[10px] font-medium text-gray-300 tracking-widest uppercase"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            PHT
          </span>
        </div>
      </div>

      {/* User info — right */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gray-800">
            {user?.full_name || "Admin"}
          </p>
          <p className="text-xs text-gray-400">{user?.email}</p>
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