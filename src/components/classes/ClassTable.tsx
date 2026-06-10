import { Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Class } from "../../types/class";
import { deleteClass } from "../../api/classApi";

interface Props {
  classes: Class[];
  onDeleted: () => void;
  onSelect: (c: Class) => void;
  selected: Class | null;
}

export default function ClassTable({
  classes,
  onDeleted,
  onSelect,
  selected,
}: Props) {
  const handleDelete = async (id: number) => {
    if (!confirm("Delete this class?")) return;
    await deleteClass(id);
    onDeleted();
  };

  if (!classes.length)
    return (
      <p className="text-sm text-gray-400 py-6 text-center">No classes yet.</p>
    );

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
              Class Name
            </th>
            <th className="text-left px-7 py-3 text-xs font-medium text-gray-500 text">
              Type
            </th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {classes.map((cls) => (
            <tr
              key={cls.id}
              onClick={() => onSelect(cls)}
              className={`border-b border-gray-50 cursor-pointer transition-colors ${
                selected?.id === cls.id ? "bg-green-50" : "hover:bg-gray-50"
              }`}
            >
              <td className="px-4 py-3 font-medium text-gray-800 max-w-0 w-full">
                <span className="block truncate">{cls.class_name}</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant="secondary" className="text-xs capitalize">
                  {cls.class_type}
                </Badge>
              </td>
              <td className="px-4 py-3 text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-red-500 h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(cls.id);
                  }}
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
