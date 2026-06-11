import api from "./axios";

export const adminLogin = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};

export const getPendingTeachers = async () => {
  const res = await api.get("/admin/pending-teachers");
  return res.data;
};

export const approveTeacher = async (id: number) => {
  const res = await api.put(`/admin/approve/${id}`);
  return res.data;
};

export const rejectTeacher = async (id: number) => {
  const res = await api.delete(`/admin/reject/${id}`);
  return res.data;
};