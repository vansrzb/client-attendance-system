import { useState, useRef } from "react";
import { Trash2, QrCode, GripVertical } from "lucide-react";
import { Button } from "../ui/button";
import type { Student } from "../../types/student";
import { deleteStudent } from "../../api/studentApi";

interface Props {
  students: Student[];
  onDeleted: () => void;
  onShowQR: (s: Student) => void;
}

function sortByStudentNumber(list: Student[]): Student[] {
  return [...list].sort((a, b) =>
    a.student_number.localeCompare(b.student_number, undefined, {
      numeric: true,
      sensitivity: "base",
    })
  );
}

export default function StudentTable({
  students,
  onDeleted,
  onShowQR,
}: Props) {
  const [ordered, setOrdered] = useState<Student[]>(() =>
    sortByStudentNumber(students)
  );

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
            {/* Index badge */}
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
              {i + 1}
            </span>

            {/* Student info */}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-gray-800">{s.full_name}</p>
              <p className="font-mono text-xs text-gray-400">{s.student_number}</p>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-green-600"
                onClick={() => onShowQR(s)}
                title="Show QR code"
              >
                <QrCode size={16} />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-red-500"
                onClick={() => handleDelete(s.id)}
                title="Delete student"
              >
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
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                #
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                Student No.
              </th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                Full Name
              </th>
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
                onDragOver={(e) => e.preventDefault()}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-grab active:cursor-grabbing active:bg-blue-50"
              >
                <td className="px-2 py-3 text-gray-300">
                  <GripVertical size={14} />
                </td>

                <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                <td className="px-4 py-3 font-mono text-xs text-gray-600">
                  {s.student_number}
                </td>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {s.full_name}
                </td>

                <td className="px-4 py-3 text-right flex justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-gray-400 hover:text-green-600"
                    onClick={() => onShowQR(s)}
                    title="Show QR code"
                  >
                    <QrCode size={14} />
                  </Button>

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
    </>
  );
}