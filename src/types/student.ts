export interface Student {
  id: number;
  class_id: number;
  student_number: string;
  full_name: string;
  qr_token: string;
  qr_image: string; // base64 data URL
}

export interface CreateStudentPayload {
  class_id: number;
  student_number: string;
  full_name: string;
}