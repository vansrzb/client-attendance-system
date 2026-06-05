import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import {
  getAttendanceHistory,
  getAttendanceSession,
  getMonthlyAttendanceSummary,
  getYearlyAttendanceSummary,
} from "../../api/attendanceApi";
import type { Class } from "../../types/class";
import type {
  AttendanceSession,
  AttendanceRecord,
  AttendanceSummary,
} from "../../types/attendance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import AttendanceTable from "../../components/attendance/AttendanceTable";
import {
  ChevronRight,
  ChevronLeft,
  FileText,
  Sheet,
  FileDown,
  Loader2,
} from "lucide-react";
import {
  exportToPDF,
  exportToExcel,
  exportToWord,
  exportSummaryToPDF,
  exportSummaryToExcel,
  exportSummaryToWord,
} from "../../utils/exportAttendance";
import { Button } from "../../components/ui/button";

export default function History() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [selectedClassName, setSelectedClassName] = useState<string>("");
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<AttendanceSession | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [view, setView] = useState<"daily" | "monthly" | "yearly">("daily");
  const [monthlySummary, setMonthlySummary] = useState<AttendanceSummary[]>([]);
  const [yearlySummary, setYearlySummary] = useState<AttendanceSummary[]>([]);
  const [exporting, setExporting] = useState<"pdf" | "excel" | "word" | null>(null);

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  useEffect(() => {
    if (!selectedClass) return;
    setSelectedSession(null);
    setRecords([]);
    if (view === "daily") getAttendanceHistory(selectedClass).then(setSessions);
    if (view === "monthly")
      getMonthlyAttendanceSummary(selectedClass).then(setMonthlySummary);
    if (view === "yearly")
      getYearlyAttendanceSummary(selectedClass).then(setYearlySummary);
  }, [selectedClass, view]);

  const loadSession = async (session: AttendanceSession) => {
    setSelectedSession(session);
    const data = await getAttendanceSession(session.id);
    setRecords(data);
  };

  const handleExport = async (type: "pdf" | "excel" | "word") => {
    if (!selectedSession || records.length === 0) return;
    setExporting(type);
    try {
      if (type === "pdf") exportToPDF(selectedSession, records, selectedClassName);
      else if (type === "excel") await exportToExcel(selectedSession, records, selectedClassName);
      else await exportToWord(selectedSession, records, selectedClassName);
    } finally {
      setExporting(null);
    }
  };

  const handleSummaryExport = async (
    type: "pdf" | "excel" | "word",
    rows: AttendanceSummary[],
    periodLabel: string,
  ) => {
    setExporting(type);
    try {
      if (type === "pdf") exportSummaryToPDF(rows, periodLabel, selectedClassName);
      else if (type === "excel") await exportSummaryToExcel(rows, periodLabel, selectedClassName);
      else await exportSummaryToWord(rows, periodLabel, selectedClassName);
    } finally {
      setExporting(null);
    }
  };

  const ExportBar = () =>
    selectedSession && records.length > 0 ? (
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Export:</span>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
          onClick={() => handleExport("pdf")}
          disabled={exporting !== null}
        >
          {exporting === "pdf" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} className="text-red-500" />}
          PDF
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 text-gray-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50 transition-colors"
          onClick={() => handleExport("excel")}
          disabled={exporting !== null}
        >
          {exporting === "excel" ? <Loader2 size={13} className="animate-spin" /> : <Sheet size={13} className="text-green-600" />}
          Excel
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 text-gray-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          onClick={() => handleExport("word")}
          disabled={exporting !== null}
        >
          {exporting === "word" ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} className="text-blue-500" />}
          Word
        </Button>
      </div>
    ) : null;

  const SummaryExportBar = ({
    rows,
    periodLabel,
  }: {
    rows: AttendanceSummary[];
    periodLabel: string;
  }) => (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-400 mr-1 hidden sm:inline">Export:</span>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
        onClick={() => handleSummaryExport("pdf", rows, periodLabel)}
        disabled={exporting !== null}
      >
        {exporting === "pdf" ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} className="text-red-500" />}
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 text-gray-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50 transition-colors"
        onClick={() => handleSummaryExport("excel", rows, periodLabel)}
        disabled={exporting !== null}
      >
        {exporting === "excel" ? <Loader2 size={13} className="animate-spin" /> : <Sheet size={13} className="text-green-600" />}
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="h-8 text-xs gap-1.5 text-gray-600 hover:text-blue-700 hover:border-blue-200 hover:bg-blue-50 transition-colors"
        onClick={() => handleSummaryExport("word", rows, periodLabel)}
        disabled={exporting !== null}
      >
        {exporting === "word" ? <Loader2 size={13} className="animate-spin" /> : <FileDown size={13} className="text-blue-500" />}
        Word
      </Button>
    </div>
  );

  const SummaryTable = ({
    rows,
    periodLabel,
  }: {
    rows: AttendanceSummary[];
    periodLabel: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {rows.length} {periodLabel.toLowerCase()}{rows.length !== 1 ? "s" : ""}
        </p>
        <SummaryExportBar rows={rows} periodLabel={periodLabel} />
      </div>
      <div className="rounded-lg border border-gray-100 overflow-hidden bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                {periodLabel}
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Sessions
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Present
              </th>
              <th className="text-center px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wide">
                Absent
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.period} className="border-t border-gray-100">
                <td className="px-4 py-2.5 text-gray-700">{row.period}</td>
                <td className="px-4 py-2.5 text-gray-600 text-center">{row.total_sessions}</td>
                <td className="px-4 py-2.5 text-gray-600 text-center">{row.present_count}</td>
                <td className="px-4 py-2.5 text-gray-600 text-center">{row.absent_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">History</h1>
        <p className="text-sm text-gray-400 mt-0.5">View past attendance sessions</p>
      </div>

      <Select
        onValueChange={(v) => {
          setSelectedClass(Number(v));
          setSelectedClassName(classes.find((c) => c.id === Number(v))?.class_name ?? "");
        }}
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

      <div className="flex gap-2">
        {(["daily", "monthly", "yearly"] as const).map((v) => (
          <Button
            key={v}
            size="sm"
            variant={view === v ? "default" : "outline"}
            onClick={() => setView(v)}
            className={`capitalize ${
              view === v
                ? "bg-green-600 hover:bg-green-700 text-white border-green-600"
                : "text-gray-600 hover:text-green-700 hover:border-green-300 hover:bg-green-50"
            }`}
          >
            {v}
          </Button>
        ))}
      </div>

      {/* Daily view */}
      {view === "daily" && sessions.length > 0 && (
        <>
          {/* Mobile */}
          <div className="sm:hidden">
            {!selectedSession ? (
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                  Sessions
                </p>
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => loadSession(s)}
                    className="w-full text-left px-3 py-2.5 rounded-md text-sm flex items-center justify-between bg-white border border-gray-100 text-gray-700 active:bg-gray-50"
                  >
                    {new Date(s.attendance_date).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                    <ChevronRight size={14} className="text-gray-300" />
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => { setSelectedSession(null); setRecords([]); }}
                    className="flex items-center gap-1 text-sm text-green-600 font-medium"
                  >
                    <ChevronLeft size={15} />
                    Sessions
                  </button>
                  <ExportBar />
                </div>
                <p className="text-xs text-gray-400">
                  {new Date(selectedSession.attendance_date).toLocaleDateString("en-PH", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <AttendanceTable records={records} onUpdated={() => loadSession(selectedSession)} />
              </div>
            )}
          </div>

          {/* Desktop */}
          <div className="hidden sm:grid sm:grid-cols-4 gap-5">
            <div className="col-span-1 space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
                Sessions
              </p>
              {sessions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => loadSession(s)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between transition-colors ${
                    selectedSession?.id === s.id
                      ? "bg-green-50 text-green-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {new Date(s.attendance_date).toLocaleDateString("en-PH", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <ChevronRight size={14} className="text-gray-300" />
                </button>
              ))}
            </div>
            <div className="col-span-3 space-y-3">
              {selectedSession ? (
                <>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      {new Date(selectedSession.attendance_date).toLocaleDateString("en-PH", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <ExportBar />
                  </div>
                  <AttendanceTable records={records} onUpdated={() => loadSession(selectedSession)} />
                </>
              ) : (
                <p className="text-sm text-gray-400 pt-8 text-center">
                  Select a session to view records.
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Monthly view */}
      {view === "monthly" && monthlySummary.length > 0 && (
        <SummaryTable rows={monthlySummary} periodLabel="Month" />
      )}

      {/* Yearly view */}
      {view === "yearly" && yearlySummary.length > 0 && (
        <SummaryTable rows={yearlySummary} periodLabel="Year" />
      )}

      {selectedClass && sessions.length === 0 && view === "daily" && (
        <p className="text-sm text-gray-400">No sessions found for this class.</p>
      )}
    </div>
  );
}