import { useState, useRef, useEffect } from "react";
import { Trash2, QrCode, GripVertical, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import type { Student } from "../../types/student";
import { deleteStudent } from "../../api/studentApi";

interface Props {
  students: Student[];
  onDeleted: () => void;
  onShowQR: (s: Student) => void;
  onEdit: (s: Student) => void;
}

function sortByStudentNumber(list: Student[]): Student[] {
  return [...list].sort((a, b) =>
    a.student_number.localeCompare(b.student_number, undefined, {
      numeric: true,
      sensitivity: "base",
    }),
  );
}

export default function StudentTable({
  students,
  onDeleted,
  onShowQR,
  onEdit,
}: Props) {
  const [ordered, setOrdered] = useState<Student[]>(() =>
    sortByStudentNumber(students),
  );

  // ── Sync when parent list changes (add/delete/edit) ─────────────
  useEffect(() => {
    setOrdered(sortByStudentNumber(students));
  }, [students]);

  // ── Drag state ──────────────────────────────────────────────────
  // Store the *student id* so it stays stable as rows reorder
  const dragId = useRef<number | null>(null);

  const handleDragStart = (id: number) => {
    dragId.current = id;
  };

  const handleDragEnter = (targetId: number) => {
    if (dragId.current === null || dragId.current === targetId) return;

    setOrdered((prev) => {
      const next = [...prev];
      const fromIdx = next.findIndex((s) => s.id === dragId.current);
      const toIdx = next.findIndex((s) => s.id === targetId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleDragEnd = () => {
    dragId.current = null;
  };

  // ── Delete ───────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this student?")) return;
    await deleteStudent(id);
    onDeleted();
  };

  if (!ordered.length)
    return (
      <p className="text-sm text-gray-400 py-6 text-center">
        No students in this class.
      </p>
    );

  return (
    <>
      {/* ── Mobile card list (< sm) ─────────────────────────────── */}
      <ul className="flex flex-col gap-2 sm:hidden">
        {ordered.map((s, i) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white px-4 py-3 shadow-sm"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-800">{s.full_name}</p>
              <p className="font-mono text-xs text-gray-400">{s.student_number}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-green-600" onClick={() => onShowQR(s)} title="Show QR code">
                <QrCode size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600" onClick={() => onEdit(s)} title="Edit student">
                <Pencil size={16} />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-300 hover:text-red-500" onClick={() => handleDelete(s.id)} title="Delete student">
                <Trash2 size={16} />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      {/* ── Desktop table (≥ sm) ────────────────────────────────── */}
      <div className="hidden sm:block border border-gray-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
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
                onDragStart={() => handleDragStart(s.id)}
                onDragEnter={() => handleDragEnter(s.id)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing active:bg-blue-50"
              >
                <td className="px-2 py-3 text-gray-300"><GripVertical size={14} /></td>
                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.student_number}</td>
                <td className="px-4 py-3 font-medium text-gray-800">{s.full_name}</td>
                <td className="px-4 py-3 text-right flex justify-end gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-green-600" onClick={() => onShowQR(s)} title="Show QR code">
                    <QrCode size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-blue-600" onClick={() => onEdit(s)} title="Edit student">
                    <Pencil size={14} />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-red-500" onClick={() => handleDelete(s.id)} title="Delete student">
                    <Trash2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}