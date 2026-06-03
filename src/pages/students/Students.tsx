import { useEffect, useState } from "react";
import { getClasses } from "../../api/classApi";
import { getStudentsByClass } from "../../api/studentApi";
import StudentForm from "../../components/students/StudentForm";
import StudentTable from "../../components/students/StudentTable";
import QRModal from "../../components/students/QRModal";
import type { Class } from "../../types/class";
import type { Student } from "../../types/student";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

export default function Students() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [qrStudent, setQrStudent] = useState<Student | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  useEffect(() => {
    getClasses().then(setClasses);
  }, []);

  const loadStudents = () => {
    if (selectedClass) getStudentsByClass(selectedClass).then(setStudents);
  };

  useEffect(() => {
    loadStudents();
  }, [selectedClass]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Students</h1>
        <p className="text-sm text-gray-400 mt-0.5">
          Manage students per class
        </p>
      </div>

      <Select onValueChange={(v) => setSelectedClass(Number(v))}>
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

      {selectedClass && (
        <>
          <StudentForm classId={selectedClass} onCreated={loadStudents} />
          <StudentTable
            students={students}
            onDeleted={loadStudents}
            onShowQR={setQrStudent}
            onEdit={setEditingStudent}
          />
        </>
      )}

      <QRModal student={qrStudent} onClose={() => setQrStudent(null)} />
    </div>
  );
}
