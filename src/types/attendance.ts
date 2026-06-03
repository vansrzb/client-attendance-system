export interface AttendanceRecord {
  id: number;
  student_number: string;
  full_name: string;
  status: "present" | "absent";
  scanned_at: string | null;
}

export interface AttendanceSession {
  id: number;
  class_id: number;
  attendance_date: string;
  status: "draft" | "finalized";
  created_at: string;
}

export interface StartAttendancePayload {
  class_id: number;
}

export interface ScanAbsentPayload {
  session_id: number;
  qr_token: string;
}

export interface UpdateAttendancePayload {
  attendance_id: number;
  status: "present" | "absent";
}