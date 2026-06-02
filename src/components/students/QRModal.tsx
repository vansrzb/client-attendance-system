import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import type { Student } from "../../types/student";

interface Props {
  student: Student | null;
  onClose: () => void;
}

export default function QRModal({ student, onClose }: Props) {
  if (!student) return null;
  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-xs text-center">
        <DialogHeader>
          <DialogTitle className="text-base">{student.full_name}</DialogTitle>
        </DialogHeader>
        <p className="text-xs text-gray-400 font-mono mb-3">{student.student_number}</p>
        {student.qr_image ? (
          <img src={student.qr_image} alt="QR Code" className="mx-auto w-48 h-48" />
        ) : (
          <p className="text-sm text-gray-400">No QR image available.</p>
        )}
        <p className="text-[11px] text-gray-400 mt-2">Scan to mark absent</p>
      </DialogContent>
    </Dialog>
  );
}