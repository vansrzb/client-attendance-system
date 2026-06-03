import { useState, useRef } from "react";
import { Trash2, QrCode, Pencil, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import type { Student } from "../../types/student";
import { deleteStudent } from "../../api/studentApi";

interface Props {
  students: Student[];
  onDeleted: () => void;
  onShowQR: (s: Student) => void;
  onEdit?: (s: Student) => void; // NEW: trigger edit modal/form
}

function sortByStudentNumber(list: Student[]): Student[] {
  return [...list].sort((a, b) =>
    a.student_number.localeCompare(b.student_number, undefined, { numeric: true, sensitivity: "base" })
  );
}

export default function StudentTable({ students, onDeleted, onShowQR, onEdit }: Props) {
  // Start sorted; user can then drag to reorder
  const [ordered, setOrdered] = useState<Student[]>(() => sortByStudentNumber(students));

  // Keep in sync when parent refreshes the list (e.g. after add/delete)
  // Simple approach: re-sort whenever the student IDs change
  const prevIds = useRef<string>("");
  const currentIds = students.map((s) => s.id).join(",");
  if (prevIds.current !== currentIds) {
    prevIds.current = currentIds;
    setOrdered(sortByStudentNumber(students));
  }

  // ── Drag state ──────────────────────────────────────────────────
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  const handleDragStart = (index: number) => {
    dragIndex.current = index;
  };

  const handleDragEnter = (index: number) => {
    dragOverIndex.current = index;

    // Live reorder while dragging for visual feedback
    if (dragIndex.current === null || dragIndex.current === index) return;
    const next = [...ordered];
    const [moved] = next.splice(dragIndex.current, 1);
    next.splice(index, 0, moved);
    dragIndex.current = index;
    setOrdered(next);
  };

  const handleDragEnd = () => {
    dragIndex.current = null;
    dragOverIndex.current = null;
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    onDeleted();
  };

  if (!ordered.length)
    return (
      <p className="text-sm text-gray-400 py-6 text-center">No students in this class.</p>
    );

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            {/* drag handle column */}
            <th className="w-6 px-2 py-3" />
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">#</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Student No.</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Full Name</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {ordered.map((s, i) => (
            <tr
              key={s.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()} // required for drop to fire
              className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing active:bg-blue-50"
            >
              {/* Drag handle */}
              <td className="px-2 py-3 text-gray-300">
                <GripVertical size={14} />
              </td>

              <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.student_number}</td>
              <td className="px-4 py-3 font-medium text-gray-800">{s.full_name}</td>

              {/* Actions */}
              <td className="px-4 py-3 text-right flex justify-end gap-1">
                {/* QR */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-green-600"
                  onClick={() => onShowQR(s)}
                  title="Show QR code"
                >
                  <QrCode size={14} />
                </Button>

                {/* Edit */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-400 hover:text-blue-600"
                  onClick={() => onEdit?.(s)}
                  title="Edit student"
                >
                  <Pencil size={14} />
                </Button>

                {/* Delete */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-gray-300 hover:text-red-500"
                  onClick={() => handleDelete(s.id)}
                  title="Delete student"
                >
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