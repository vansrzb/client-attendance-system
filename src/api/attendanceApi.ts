import api from "./axios";
import type {
  AttendanceRecord,
  AttendanceSession,
  StartAttendancePayload,
  ScanAbsentPayload,
  UpdateAttendancePayload,
} from "../types/attendance";

export const startAttendance = (data: StartAttendancePayload) =>
  api.post<{ message: string; sessionId: number }>("/attendance/start", data).then((r) => r.data);

export const scanAbsent = (data: ScanAbsentPayload) =>
  api.post("/attendance/scan-absent", data).then((r) => r.data);

export const updateAttendanceStatus = (data: UpdateAttendancePayload) =>
  api.put("/attendance/update", data).then((r) => r.data);

export const getAttendanceSession = (sessionId: number) =>
  api.get<AttendanceRecord[]>(`/attendance/session/${sessionId}`).then((r) => r.data);

export const getAttendanceHistory = (classId: number) =>
  api.get<AttendanceSession[]>(`/attendance/history/${classId}`).then((r) => r.data);