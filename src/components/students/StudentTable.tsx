import { Trash2, QrCode } from "lucide-react";
import { Button } from "../ui/button";
import type { Student } from "../../types/student";
import { deleteStudent } from "../../api/studentApi";

interface Props {
  students: Student[];
  onDeleted: () => void;
  onShowQR: (s: Student) => void;
}

export default function StudentTable({ students, onDeleted, onShowQR }: Props) {
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    onDeleted();
  };

  if (!students.length)
    return <p className="text-sm text-gray-400 py-6 text-center">No students in this class.</p>;

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">#</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Student No.</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Full Name</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.student_number}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{s.full_name}</td>
              <td className="px-4 py-3 text-right flex justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-green-600"
                  onClick={() => onShowQR(s)}>
                  <QrCode size={14} />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-red-500"
                  onClick={() => handleDelete(s.id)}>
                  <Trash2 size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}