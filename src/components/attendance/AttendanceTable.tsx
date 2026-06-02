import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import type { AttendanceRecord } from "../../types/attendance";
import { updateAttendanceStatus } from "../../api/attendanceApi";

interface Props {
  records: AttendanceRecord[];
  onUpdated: () => void;
}

export default function AttendanceTable({ records, onUpdated }: Props) {
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
      <div className="border border-gray-100 rounded-lg overflow-hidden">
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
            {records.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.student_number}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{r.full_name}</td>
                <td className="px-4 py-3">
                  <Badge className={r.status === "present"
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-600 border-red-200"
                  } variant="outline">
                    {r.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">
                  {r.scanned_at ? new Date(r.scanned_at).toLocaleTimeString() : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm"
                    className="text-xs h-7 text-gray-400 hover:text-gray-700"
                    onClick={() => toggle(r)}>
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