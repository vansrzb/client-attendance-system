export interface Class {
  id: number;
  teacher_id: number;
  class_name: string;
  class_type: string;
}

export interface CreateClassPayload {
  class_name: string;
  class_type: string;
}