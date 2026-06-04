import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { AttendanceRecord } from "../../types/attendance";
import { updateAttendanceStatus } from "../../api/attendanceApi";

interface Props {
  records: AttendanceRecord[];
  onUpdated: () => void;
}

function sortByStudentNumber(list: AttendanceRecord[]): AttendanceRecord[] {
  return [...list].sort((a, b) =>
    a.student_number.localeCompare(b.student_number, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );
}

export default function AttendanceTable({ records, onUpdated }: Props) {
  const sorted = sortByStudentNumber(records);

  const toggle = async (record: AttendanceRecord) => {
    const newStatus = record.status === "present" ? "absent" : "present";
    await updateAttendanceStatus({ attendance_id: record.id, status: newStatus });
    onUpdated();
  };

  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;

  return (
    <div className="space-y-3">
      <div className="flex gap-4 text-sm">
        <span className="text-green-600 font-medium">{present} Present</span>
        <span className="text-red-500 font-medium">{absent} Absent</span>
        <span className="text-gray-400">{records.length} Total</span>
      </div>

      {/* Mobile: card list */}
      <div className="sm:hidden space-y-2">
        {sorted.map((r) => (
          <div key={r.id} className="bg-white border border-gray-100 rounded-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{r.full_name}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{r.student_number}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {r.scanned_at ? new Date(r.scanned_at).toLocaleTimeString() : "—"}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge
                className={r.status === "present"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : "bg-red-50 text-red-600 border-red-200"
                }
                variant="outline"
              >
                {r.status}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-gray-400 hover:text-gray-700 px-2"
                onClick={() => toggle(r)}
              >
                Toggle
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table */}
      <div className="hidden sm:block border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Student No.</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Scanned At</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.student_number}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.full_name}</td>
                <td className="px-4 py-3">
                  <Badge
                    className={r.status === "present"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-600 border-red-200"
                    }
                    variant="outline"
                  >
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {r.scanned_at ? new Date(r.scanned_at).toLocaleTimeString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-gray-400 hover:text-gray-700"
                    onClick={() => toggle(r)}
                  >
                    Toggle
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}