import api from "./axios";
import type { Student, CreateStudentPayload } from "../types/student";

export const getStudentsByClass = (classId: number) =>
  api.get<Student[]>(`/students/class/${classId}`).then((r) => r.data);

export const createStudent = (data: CreateStudentPayload) =>
  api.post("/students", data).then((r) => r.data);

export const deleteStudent = (id: number) =>
  api.delete(`/students/${id}`).then((r) => r.data);

// UPDATE — send your backend endpoint once ready (e.g. PUT /students/:id)
export interface UpdateStudentPayload {
  student_number?: string;
  full_name?: string;
}

export const updateStudent = (id: number, data: UpdateStudentPayload) =>
  api.put<Student>(`/students/${id}`, data).then((r) => r.data);