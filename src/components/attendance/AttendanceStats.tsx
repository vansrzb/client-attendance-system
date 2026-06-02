import type { AttendanceRecord } from "../../types/attendance";

interface Props { records: AttendanceRecord[] }

export default function AttendanceStats({ records }: Props) {
  const total = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = total - present;
  const rate = total ? Math.round((present / total) * 100) : 0;

  return (
    <div className="grid grid-cols-3 gap-3">
      {[
        { label: "Present", value: present, color: "text-green-600" },
        { label: "Absent", value: absent, color: "text-red-500" },
        { label: "Rate", value: `${rate}%`, color: "text-gray-800" },
      ].map(({ label, value, color }) => (
        <div key={label} className="bg-white border border-gray-100 rounded-lg px-4 py-3">
          <p className="text-xs text-gray-400 mb-1">{label}</p>
          <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}