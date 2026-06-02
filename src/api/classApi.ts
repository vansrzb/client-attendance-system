import api from "./axios";
import type { Class, CreateClassPayload } from "../types/class";

export const getClasses = () =>
  api.get<Class[]>("/classes").then((r) => r.data);

export const createClass = (data: CreateClassPayload) =>
  api.post("/classes", data).then((r) => r.data);

export const deleteClass = (id: number) =>
  api.delete(`/classes/${id}`).then((r) => r.data);