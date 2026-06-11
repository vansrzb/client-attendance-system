import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import {
  getAttendanceHistory,
  getAttendanceSession,
} from "../../api/attendanceApi";
import type { Class } from "../../types/class";
import type { AttendanceSession } from "../../types/attendance";
import {
  BookOpen,
  Users,
  ScanLine,
  FileText,
  Sheet,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ─── types ───────────────────────────────────────────────────────────────────

interface ClassStat {
  cls: Class;
  studentCount: number;
  sessions: AttendanceSession[];
}

interface WeekDay {
  day: string;
  present: number;
  absent: number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

function getLast7Days(): { label: string; dateStr: string }[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      label: d.toLocaleDateString("en-PH", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      dateStr: d.toDateString(),
    };
  });
}

// ─── component ───────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { getUser: getTeacher } = useAuth();
  const teacher = getTeacher();

  const [classes, setClasses] = useState<Class[]>([]);
  const [classStats, setClassStats] = useState<ClassStat[]>([]);
  const [totalStudents, setTotalStudents] = useState<number | null>(null);
  const [sessionsToday, setSessionsToday] = useState<number | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeekDay[]>([]);
  const [totalPresent, setTotalPresent] = useState(0);
  const [totalAbsent, setTotalAbsent] = useState(0);
  const [exporting, setExporting] = useState<"pdf" | "excel" | null>(null);
  const [loadingChart, setLoadingChart] = useState(true);

  useEffect(() => {
    getClasses()
      .then(async (classList) => {
        setClasses(classList);
        const today = new Date().toDateString();
        const last7 = getLast7Days();

        const results = await Promise.all(
          classList.map((cls) =>
            Promise.all([
              getStudentsByClass(cls.id),
              getAttendanceHistory(cls.id),
            ]),
          ),
        );

        let studentCount = 0;
        let sessionCount = 0;
        const stats: ClassStat[] = [];
        const weekMap: Record<string, { present: number; absent: number }> = {};
        for (const { dateStr } of last7)
          weekMap[dateStr] = { present: 0, absent: 0 };

        for (let i = 0; i < classList.length; i++) {
          const [students, sessions] = results[i];
          studentCount += students.length;
          sessionCount += sessions.filter(
            (s) => new Date(s.created_at).toDateString() === today,
          ).length;
          stats.push({
            cls: classList[i],
            studentCount: students.length,
            sessions,
          });

          const recentSessions = sessions.filter((s) =>
            last7.some(
              (d) => new Date(s.attendance_date).toDateString() === d.dateStr,
            ),
          );

          for (const session of recentSessions) {
            try {
              const records = await getAttendanceSession(session.id);
              const dayKey = new Date(session.attendance_date).toDateString();
              if (weekMap[dayKey]) {
                weekMap[dayKey].present += records.filter(
                  (r) => r.status === "present",
                ).length;
                weekMap[dayKey].absent += records.filter(
                  (r) => r.status === "absent",
                ).length;
              }
            } catch {}
          }
        }

        const built = last7.map(({ label, dateStr }) => ({
          day: label,
          present: weekMap[dateStr].present,
          absent: weekMap[dateStr].absent,
        }));

        const tp = built.reduce((s, d) => s + d.present, 0);
        const ta = built.reduce((s, d) => s + d.absent, 0);

        setTotalStudents(studentCount);
        setSessionsToday(sessionCount);
        setClassStats(stats);
        setWeeklyData(built);
        setTotalPresent(tp);
        setTotalAbsent(ta);
        setLoadingChart(false);
      })
      .catch(() => setLoadingChart(false));
  }, []);

  // ─── exports ─────────────────────────────────────────────────────────────

  const handleExportPDF = () => {
    const today = new Date().toLocaleDateString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const classRows = classStats
      .map(
        (s, i) => `
      <tr class="${i % 2 === 0 ? "even" : ""}">
        <td>${s.cls.class_name}</td>
        <td class="center capitalize">${s.cls.class_type}</td>
        <td class="center">${s.studentCount}</td>
        <td class="center">${
          s.sessions.filter(
            (x) =>
              new Date(x.created_at).toDateString() ===
              new Date().toDateString(),
          ).length
        }</td>
      </tr>`,
      )
      .join("");

    const weekRows = weeklyData
      .map(
        (w, i) => `
      <tr class="${i % 2 === 0 ? "even" : ""}">
        <td>${w.day}</td>
        <td class="center present">${w.present}</td>
        <td class="center absent">${w.absent}</td>
        <td class="center">${w.present + w.absent}</td>
      </tr>`,
      )
      .join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
<title>Dashboard Report</title>
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#1a1a2e;padding:32px}
  .header{border-bottom:2.5px solid #16a34a;padding-bottom:14px;margin-bottom:20px}
  .header h1{font-size:20px;font-weight:700;color:#14532d}
  .header .meta{margin-top:4px;color:#6b7280;font-size:11px}
  .stats{display:flex;gap:16px;margin-bottom:24px}
  .stat{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:10px 18px;text-align:center;flex:1}
  .stat .val{font-size:22px;font-weight:700}
  .stat .lbl{font-size:10px;color:#9ca3af;text-transform:uppercase;letter-spacing:.5px;margin-top:2px}
  .stat.green .val{color:#16a34a}.stat.blue .val{color:#2563eb}.stat.violet .val{color:#7c3aed}
  h2{font-size:13px;font-weight:600;color:#374151;margin:20px 0 10px}
  table{width:100%;border-collapse:collapse;margin-bottom:24px}
  thead tr{background:#f0fdf4}
  th{text-align:left;padding:9px 12px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:#166534;border-bottom:1.5px solid #bbf7d0}
  th.center{text-align:center}
  td{padding:8px 12px;border-bottom:1px solid #f3f4f6}
  td.center{text-align:center}
  tr.even td{background:#fafafa}
  td.present{color:#16a34a;font-weight:600}td.absent{color:#dc2626;font-weight:600}
  .footer{margin-top:16px;padding-top:12px;border-top:1px solid #e5e7eb;color:#9ca3af;font-size:10px;display:flex;justify-content:space-between}
</style></head><body>
  <div class="header">
    <h1>Dashboard Report</h1>
    <div class="meta">📅 ${today} · 🖨 Printed ${new Date().toLocaleString("en-PH")}</div>
  </div>
  <div class="stats">
    <div class="stat green"><div class="val">${classes.length}</div><div class="lbl">Total Classes</div></div>
    <div class="stat blue"><div class="val">${totalStudents ?? 0}</div><div class="lbl">Total Students</div></div>
    <div class="stat violet"><div class="val">${sessionsToday ?? 0}</div><div class="lbl">Sessions Today</div></div>
  </div>
  <h2>Class Breakdown</h2>
  <table>
    <thead><tr><th>Class</th><th class="center">Type</th><th class="center">Students</th><th class="center">Sessions Today</th></tr></thead>
    <tbody>${classRows}</tbody>
  </table>
  <h2>Last 7 Days Attendance</h2>
  <table>
    <thead><tr><th>Day</th><th class="center">Present</th><th class="center">Absent</th><th class="center">Total</th></tr></thead>
    <tbody>${weekRows}</tbody>
  </table>
  <div class="footer">
    <span>Generated by Students Attendance System</span>
    <span>${teacher?.full_name ?? ""}</span>
  </div>
</body></html>`;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 400);
  };

  const handleExportExcel = async () => {
    const XLSX = await import("xlsx");
    const wb = XLSX.utils.book_new();

    const summary = [
      [
        "Dashboard Report",
        "",
        `Generated: ${new Date().toLocaleString("en-PH")}`,
      ],
      [],
      ["Metric", "Value"],
      ["Total Classes", classes.length],
      ["Total Students", totalStudents ?? 0],
      ["Sessions Today", sessionsToday ?? 0],
      ["7-Day Present", totalPresent],
      ["7-Day Absent", totalAbsent],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summary);
    wsSummary["!cols"] = [{ wch: 22 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");

    const classData = [
      ["Class", "Type", "Students", "Sessions Today", "Total Sessions"],
      ...classStats.map((s) => [
        s.cls.class_name,
        s.cls.class_type,
        s.studentCount,
        s.sessions.filter(
          (x) =>
            new Date(x.created_at).toDateString() === new Date().toDateString(),
        ).length,
        s.sessions.length,
      ]),
    ];
    const wsClasses = XLSX.utils.aoa_to_sheet(classData);
    wsClasses["!cols"] = [
      { wch: 28 },
      { wch: 14 },
      { wch: 12 },
      { wch: 16 },
      { wch: 16 },
    ];
    XLSX.utils.book_append_sheet(wb, wsClasses, "Classes");

    const weekData = [
      ["Day", "Present", "Absent", "Total"],
      ...weeklyData.map((w) => [
        w.day,
        w.present,
        w.absent,
        w.present + w.absent,
      ]),
    ];
    const wsWeek = XLSX.utils.aoa_to_sheet(weekData);
    wsWeek["!cols"] = [{ wch: 28 }, { wch: 12 }, { wch: 12 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(wb, wsWeek, "Last 7 Days");

    XLSX.writeFile(
      wb,
      `dashboard_report_${new Date().toISOString().slice(0, 10)}.xlsx`,
    );
  };

  const handleExport = async (type: "pdf" | "excel") => {
    setExporting(type);
    try {
      if (type === "pdf") handleExportPDF();
      else await handleExportExcel();
    } finally {
      setExporting(null);
    }
  };

  const pieData = [
    { name: "Present", value: totalPresent },
    { name: "Absent", value: totalAbsent },
  ];
  const PIE_COLORS = ["#16a34a", "#fca5a5"];
  const grandTotal = totalPresent + totalAbsent;

  // ─── render ──────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Header + export */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Good day, {teacher?.full_name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-colors"
            onClick={() => handleExport("pdf")}
            disabled={exporting !== null || loadingChart}
          >
            {exporting === "pdf" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <FileText size={13} className="text-red-500" />
            )}
            PDF
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5 text-gray-600 hover:text-green-700 hover:border-green-200 hover:bg-green-50 transition-colors"
            onClick={() => handleExport("excel")}
            disabled={exporting !== null || loadingChart}
          >
            {exporting === "excel" ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <Sheet size={13} className="text-green-600" />
            )}
            Excel
          </Button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="-mx-4 sm:mx-0">
        <div className="flex gap-3 overflow-x-auto px-4 sm:px-0 pb-1 sm:pb-0 sm:grid sm:grid-cols-3 scrollbar-hide">
          {[
            {
              label: "Total Classes",
              value: classes.length,
              icon: BookOpen,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Total Students",
              value: totalStudents,
              icon: Users,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Sessions Today",
              value: sessionsToday,
              icon: ScanLine,
              color: "text-violet-600",
              bg: "bg-violet-50",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <div
              key={label}
              className="flex-none w-[calc(50vw-24px)] sm:w-auto bg-white border border-gray-100 rounded-xl p-4"
            >
              <div
                className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center mb-2.5`}
              >
                <Icon size={15} className={color} />
              </div>
              <p className="text-2xl font-semibold text-gray-900">
                {value === null ? (
                  <span className="inline-block w-6 h-5 rounded bg-gray-100 animate-pulse" />
                ) : (
                  value
                )}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row — bar left, pie right */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {/* Bar chart — takes 3/5 on desktop */}
        <div className="sm:col-span-3 bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Attendance — Last 7 Days
          </p>
          {loadingChart ? (
            <div className="h-44 flex items-center justify-center">
              <Loader2 size={18} className="animate-spin text-gray-300" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={176}>
              <BarChart data={weeklyData} barSize={12} barGap={3}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f3f4f6"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => v.split(",")[0]}
                />
                <YAxis
                  tick={{ fontSize: 9, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={24}
                />
                <Tooltip
                  contentStyle={{
                    fontSize: 11,
                    borderRadius: 8,
                    border: "1px solid #f3f4f6",
                    boxShadow: "none",
                  }}
                  cursor={{ fill: "#f9fafb" }}
                />
                <Legend
                  iconType="circle"
                  iconSize={6}
                  wrapperStyle={{ fontSize: 10, paddingTop: 8 }}
                />
                <Bar
                  dataKey="present"
                  name="Present"
                  fill="#16a34a"
                  radius={[3, 3, 0, 0]}
                />
                <Bar
                  dataKey="absent"
                  name="Absent"
                  fill="#fca5a5"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Pie chart — takes 2/5 on desktop */}
        <div className="sm:col-span-2 bg-white border border-gray-100 rounded-xl p-4 flex flex-col">
          <p className="text-sm font-medium text-gray-700 mb-3">
            7-Day Overview
          </p>
          {loadingChart ? (
            <div className="flex-1 flex items-center justify-center h-44">
              <Loader2 size={18} className="animate-spin text-gray-300" />
            </div>
          ) : grandTotal === 0 ? (
            <div className="flex-1 flex items-center justify-center h-44">
              <p className="text-xs text-gray-400">No data yet</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1">
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={62}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={PIE_COLORS[idx]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      fontSize: 11,
                      borderRadius: 8,
                      border: "1px solid #f3f4f6",
                      boxShadow: "none",
                    }}
                    formatter={(value) => {
                      const num = typeof value === "number" ? value : 0;

                      return [
                        `${num} (${grandTotal > 0 ? Math.round((num / grandTotal) * 100) : 0}%)`,
                        "",
                      ];
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex gap-4 mt-1">
                {pieData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <span
                      className="inline-block w-2.5 h-2.5 rounded-full"
                      style={{ background: PIE_COLORS[idx] }}
                    />
                    <span className="text-xs text-gray-500">{entry.name}</span>
                    <span className="text-xs font-medium text-gray-700">
                      {entry.value}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                {grandTotal > 0
                  ? Math.round((totalPresent / grandTotal) * 100)
                  : 0}
                % attendance rate
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Classes grid */}
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-2">Your Classes</h2>
        {classes.length === 0 ? (
          <p className="text-sm text-gray-400">
            No classes yet. Go to Classes to create one.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {classStats.map(({ cls, studentCount, sessions }) => {
              const todaySessions = sessions.filter(
                (s) =>
                  new Date(s.created_at).toDateString() ===
                  new Date().toDateString(),
              ).length;
              return (
                <div
                  key={cls.id}
                  className="bg-white border border-gray-100 rounded-lg p-3"
                >
                  <p className="text-xs font-medium text-gray-800 truncate leading-tight">
                    {cls.class_name}
                  </p>
                  <p className="text-[10px] text-gray-400 capitalize mt-0.5">
                    {cls.class_type}
                  </p>
                  <div className="grid grid-cols-3 gap-1 mt-2 pt-2 border-t border-gray-50 text-center">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {studentCount}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        Students
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {sessions.length}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        Sessions
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {todaySessions}
                      </p>
                      <p className="text-[10px] text-gray-400 leading-tight">
                        Today
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
