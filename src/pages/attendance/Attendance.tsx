import { useEffect, useMemo, useState } from "react";
import { getClasses } from "../../api/classApi";
import {
  startAttendance,
  getAttendanceSession,
  getAttendanceHistory,
  getActiveSessions,
  finalizeAttendance,
  deleteAttendanceSession,
} from "../../api/attendanceApi";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import AttendanceStats from "../../components/attendance/AttendanceStats";
import QRScanner from "../../components/attendance/QRScanner";
import type { Class } from "../../types/class";
import type { AttendanceRecord, AttendanceSession, } from "../../types/attendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";

export default function Attendance() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);

  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentSession, setCurrentSession] = useState<AttendanceSession | null>(null);

  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [activeSessions, setActiveSessions] = useState<AttendanceSession[]>([]);
  const [history, setHistory] = useState<AttendanceSession[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setActiveSessions([]);
      setHistory([]);
      setSessionId(null);
      setCurrentSession(null);
      setRecords([]);
      return;
    }

    loadLists(selectedClass);
    setSessionId(null);
    setCurrentSession(null);
    setRecords([]);
  }, [selectedClass]);

  const loadLists = async (classId: number) => {
    setLoadingLists(true);
    try {
      const [activeData, historyData] = await Promise.all([
        getActiveSessions(classId),
        getAttendanceHistory(classId),
      ]);
      setActiveSessions(activeData);
      setHistory(historyData);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to load sessions");
    } finally {
      setLoadingLists(false);
    }
  };

  const loadRecords = async (sid: number) => {
    const data = await getAttendanceSession(sid);
    setRecords(data);
  };

  const refreshCurrentSessionMeta = async (sid: number, classId: number) => {
    const [activeData, historyData] = await Promise.all([
      getActiveSessions(classId),
      getAttendanceHistory(classId),
    ]);

    setActiveSessions(activeData);
    setHistory(historyData);

    const all = [...activeData, ...historyData];
    const found = all.find((s) => s.id === sid) || null;
    setCurrentSession(found);
  };

  const handleStart = async () => {
    if (!selectedClass) return;

    setStarting(true);
    setError(null);

    try {
      const res = await startAttendance({ class_id: selectedClass });
      setSessionId(res.sessionId);
      await loadRecords(res.sessionId);
      await refreshCurrentSessionMeta(res.sessionId, selectedClass);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to start");
    } finally {
      setStarting(false);
    }
  };

  const handleOpenSession = async (session: AttendanceSession) => {
    setError(null);
    setSessionId(session.id);
    setCurrentSession(session);
    await loadRecords(session.id);
  };

  const handleFinalize = async () => {
    if (!sessionId || !selectedClass) return;

    setFinalizing(true);
    setError(null);

    try {
      await finalizeAttendance(sessionId);
      await refreshCurrentSessionMeta(sessionId, selectedClass);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to finalize");
    } finally {
      setFinalizing(false);
    }
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Delete this attendance session?");
    if (!ok) return;

    setDeleting(id);
    setError(null);

    try {
      await deleteAttendanceSession(id);

      if (sessionId === id) {
        setSessionId(null);
        setCurrentSession(null);
        setRecords([]);
      }

      if (selectedClass) {
        await loadLists(selectedClass);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete");
    } finally {
      setDeleting(null);
    }
  };

  const selectedClassName = useMemo(() => {
    return classes.find((c) => c.id === selectedClass)?.class_name || "";
  }, [classes, selectedClass]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Start sessions, reopen drafts and finalize.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center">
        <Select
          value={selectedClass ? String(selectedClass) : undefined}
          onValueChange={(v) => setSelectedClass(Number(v))}
        >
          <SelectTrigger className="w-full sm:w-56 h-9 text-sm">
            <SelectValue placeholder="Select a class" />
          </SelectTrigger>
          <SelectContent>
            {classes.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.class_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleStart}
          disabled={!selectedClass || starting}
          className="h-9 w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white text-sm"
        >
          {starting ? "Starting…" : "Start New Session"}
        </Button>
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {selectedClass && (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Current Class</p>
                  <p className="text-xs text-gray-400">{selectedClassName}</p>
                </div>
                {loadingLists && <span className="text-xs text-gray-400">Loading…</span>}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">Active Draft Sessions</p>
                {activeSessions.length === 0 ? (
                  <p className="text-xs text-gray-400">No draft session yet.</p>
                ) : (
                  activeSessions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <button
                        className="text-left min-w-0"
                        onClick={() => handleOpenSession(s)}
                      >
                        <p className="text-sm font-medium text-gray-800 truncate">
                          Session #{s.id}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.attendance_date} · {new Date(s.created_at).toLocaleTimeString()}
                        </p>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-200"
                        >
                          draft
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() => handleDelete(s.id)}
                          disabled={deleting === s.id}
                        >
                          {deleting === s.id ? "Deleting…" : "Delete"}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-500">History</p>
                {history.length === 0 ? (
                  <p className="text-xs text-gray-400">No history yet.</p>
                ) : (
                  history.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-gray-100 px-3 py-2"
                    >
                      <button
                        className="text-left min-w-0"
                        onClick={() => handleOpenSession(s)}
                      >
                        <p className="text-sm font-medium text-gray-800 truncate">
                          Session #{s.id}
                        </p>
                        <p className="text-xs text-gray-400">
                          {s.attendance_date} · {new Date(s.created_at).toLocaleTimeString()}
                        </p>
                      </button>

                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          variant="outline"
                          className={
                            s.status === "finalized"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200"
                          }
                        >
                          {s.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {currentSession && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Session #{currentSession.id}
                  </p>
                  <p className="text-xs text-gray-400">
                    {currentSession.attendance_date} ·{" "}
                    {new Date(currentSession.created_at).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    className="h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleFinalize}
                    disabled={!sessionId || finalizing}
                  >
                    {finalizing ? "Finalizing…" : "Finalize"}
                  </Button>

                  <Button
                    variant="destructive"
                    className="h-8 text-xs"
                    onClick={() => sessionId && handleDelete(sessionId)}
                    disabled={!sessionId || deleting === sessionId}
                  >
                    {deleting === sessionId ? "Deleting…" : "Delete Session"}
                  </Button>
                </div>
              </div>
            )}

            {sessionId ? (
              <div className="flex flex-col gap-5 sm:grid sm:grid-cols-3">
                <div className="sm:col-span-2 space-y-4">
                  <AttendanceStats records={records} />
                  <AttendanceTable
                    records={records}
                    onUpdated={() => loadRecords(sessionId)}
                  />
                </div>

                <div>
                  <h2 className="text-sm font-medium text-gray-700 mb-3">
                    Scan Absent
                  </h2>
                  <QRScanner
                    sessionId={sessionId}
                    onScanned={() => loadRecords(sessionId)}
                  />
                </div>
              </div>
            ) : (
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-6 text-sm text-gray-400">
                Start a new session or open a draft session.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}