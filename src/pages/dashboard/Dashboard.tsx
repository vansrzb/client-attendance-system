import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import type { Class } from "../../types/class";
import { BookOpen, Users, ScanLine } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export default function Dashboard() {
  const { getTeacher } = useAuth();
  const teacher = getTeacher();
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    getClasses().then(setClasses).catch(() => {});
  }, []);

  const stats = [
    { label: "Total Classes", value: classes.length, icon: BookOpen, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Students", value: "—", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Sessions Today", value: "—", icon: ScanLine, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Good morning, {teacher?.full_name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-0.5">Here's what's happening today.</p>
      </div>

      {/* Stats — horizontal scroll on mobile, 3-col grid on sm+ */}
      <div className="-mx-4 sm:mx-0">
        <div className="flex gap-3 overflow-x-auto px-4 sm:px-0 pb-1 sm:pb-0 sm:grid sm:grid-cols-3 scrollbar-hide">
          {stats.map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex-none w-[calc(50vw-24px)] sm:w-auto bg-white border border-gray-100 rounded-xl p-4 sm:p-5"
            >
              <div className={`w-9 h-9 ${bg} rounded-lg flex items-center justify-center mb-3`}>
                <Icon size={16} className={color} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Classes */}
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-3">Your Classes</h2>
        {classes.length === 0 ? (
          <p className="text-sm text-gray-400">No classes yet. Go to Classes to create one.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {classes.map((cls) => (
              <div key={cls.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3">
                <p className="text-sm font-medium text-gray-800">{cls.class_name}</p>
                <p className="text-xs text-gray-400 capitalize mt-0.5">{cls.class_type}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}