import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getAttendanceHistory, getAttendanceSession } from "../../api/attendanceApi";
import type { Class } from "../../types/class";
import type { AttendanceSession, AttendanceRecord } from "../../types/attendance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import { ChevronRight } from "lucide-react";

export default function History() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  useEffect(() => { getClasses().then(setClasses); }, []);

  useEffect(() => {
    if (selectedClass) getAttendanceHistory(selectedClass).then(setSessions);
  }, [selectedClass]);

  const loadSession = async (session: AttendanceSession) => {
    setSelectedSession(session);
    const data = await getAttendanceSession(session.id);
    setRecords(data);
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">History</h1>
        <p className="text-sm text-gray-400 mt-0.5">View past attendance sessions</p>
      </div>

      <Select onValueChange={(v) => setSelectedClass(Number(v))}>
        <SelectTrigger className="w-56 h-9 text-sm">
          <SelectValue placeholder="Select a class" />
        </SelectTrigger>
        <SelectContent>
          {classes.map((c) => (
            <SelectItem key={c.id} value={String(c.id)}>{c.class_name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {sessions.length > 0 && (
        <div className="grid grid-cols-4 gap-5">
          <div className="col-span-1 space-y-1">
            <p className="text-xs font-medium text-gray-500 mb-2">Sessions</p>
            {sessions.map((s) => (
              <button key={s.id} onClick={() => loadSession(s)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                  selectedSession?.id === s.id
                    ? "bg-green-50 text-green-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}>
                {new Date(s.attendance_date).toLocaleDateString("en-PH", {
                  month: "short", day: "numeric", year: "numeric"
                })}
                <ChevronRight size={14} className="text-gray-300" />
              </button>
            ))}
          </div>
          <div className="col-span-3">
            {selectedSession ? (
              <AttendanceTable records={records} onUpdated={() => loadSession(selectedSession)} />
            ) : (
              <p className="text-sm text-gray-400 pt-8 text-center">Select a session to view records.</p>
            )}
          </div>
        </div>
      )}

      {selectedClass && sessions.length === 0 && (
        <p className="text-sm text-gray-400">No sessions found for this class.</p>
      )}
    </div>
  );
}