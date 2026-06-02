import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createStudent } from "../../api/studentApi";

interface Props {
  classId: number;
  onCreated: () => void;
}

export default function StudentForm({ classId, onCreated }: Props) {
  const [studentNumber, setStudentNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentNumber || !fullName) return;
    setLoading(true);
    try {
      await createStudent({ class_id: classId, student_number: studentNumber, full_name: fullName });
      setStudentNumber("");
      setFullName("");
      onCreated();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Student Number</Label>
        <Input value={studentNumber} onChange={(e) => setStudentNumber(e.target.value)}
          placeholder="e.g. 2024-0001" className="w-40 h-9 text-sm" />
      </div>
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Full Name</Label>
        <Input value={fullName} onChange={(e) => setFullName(e.target.value)}
          placeholder="Juan Dela Cruz" className="w-52 h-9 text-sm" />
      </div>
      <Button type="submit" disabled={loading}
        className="h-9 bg-green-600 hover:bg-green-700 text-white text-sm">
        {loading ? "Adding…" : "Add Student"}
      </Button>
    </form>
  );
}