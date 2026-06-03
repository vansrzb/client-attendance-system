import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { startAttendance, getAttendanceSession } from "../../api/attendanceApi";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceStats from "../../components/attendance/AttendanceStats";
import QRScanner from "../../components/attendance/QRScanner";
import type { Class } from "../../types/class";
import type { AttendanceRecord } from "../../types/attendance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Button } from "../../components/ui/button";

export default function Attendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  useEffect(() => { getClasses().then(setClasses); }, []);

  const loadRecords = async (sid: number) => {
    const data = await getAttendanceSession(sid);
    setRecords(data);
  };

  const handleStart = async () => {
    if (!selectedClass) return;
    setStarting(true);
    setError(null);
    try {
      const res = await startAttendance({ class_id: selectedClass });
      setSessionId(res.sessionId);
      await loadRecords(res.sessionId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start");
    } finally {
      setStarting(false);
    }
  };

  return (
    <div className="space-y-5 px-4 sm:px-0">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-400 mt-0.5">Start a session and scan QR codes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
        <Select onValueChange={(v) => setSelectedClass(Number(v))}>
          <SelectTrigger className="w-full sm:w-56 h-9 text-sm">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>{c.class_name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleStart}
          disabled={!selectedClass || starting}
          className="h-9 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          {starting ? "Starting…" : "Start Session"}
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {sessionId && (
        <div className="flex flex-col-reverse sm:grid sm:grid-cols-3 gap-5">
          {/* Scanner — on mobile shows below stats/table */}
          <div className="sm:col-span-1 sm:order-2">
            <h2 className="text-sm font-medium text-gray-700 mb-3">Scan Absent</h2>
            <QRScanner sessionId={sessionId} onScanned={() => loadRecords(sessionId)} />
          </div>
          {/* Stats + Table */}
          <div className="sm:col-span-2 sm:order-1 space-y-4">
            <AttendanceStats records={records} />
            <AttendanceTable records={records} onUpdated={() => loadRecords(sessionId)} />
          </div>
        </div>
      )}
    </div>
  );
}