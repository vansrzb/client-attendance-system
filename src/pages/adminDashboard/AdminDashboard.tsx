import { useEffect, useState } from "react";
import { getPendingTeachers, approveTeacher, rejectTeacher } from "../../api/adminApi";
import { Button } from "@/components/ui/button";
import { UserCheck, X } from "lucide-react";

type Teacher = {
  id: number;
  full_name: string;
  email: string;
};

function RejectModal({
  teacher,
  onConfirm,
  onCancel,
  loading,
}: {
  teacher: Teacher;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-lg w-full max-w-sm p-6 space-y-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
          <X size={18} className="text-red-500" />
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-gray-800">
            Reject teacher?
          </h3>
          <p className="text-sm text-gray-400">
            <span className="font-medium text-gray-600">
              {teacher.full_name}
            </span>{" "}
            will be permanently removed from the system. This cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
            className="h-8 px-4 text-xs text-gray-500"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="h-8 px-4 text-xs bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? "Rejecting…" : "Yes, reject"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Teacher | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const data = await getPendingTeachers();
      setTeachers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleApprove = async (id: number) => {
    setApprovingId(id);
    try {
      await approveTeacher(id);
      setTeachers((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setRejectingId(rejectTarget.id);
    try {
      await rejectTeacher(rejectTarget.id);
      setTeachers((prev) => prev.filter((t) => t.id !== rejectTarget.id));
      setRejectTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setRejectingId(null);
    }
  };

  return (
    <>
      {/* Reject modal */}
      {rejectTarget && (
        <RejectModal
          teacher={rejectTarget}
          onConfirm={handleRejectConfirm}
          onCancel={() => setRejectTarget(null)}
          loading={rejectingId === rejectTarget.id}
        />
      )}

      <div className="space-y-5">
        {/* Page header */}
        <div>
          <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Review and approve pending teacher registrations.
          </p>
        </div>

        {/* Table card */}
        <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <h2 className="text-sm font-medium text-gray-700">
              Pending Approvals
            </h2>
          </div>

          {loading ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              Loading...
            </p>
          ) : teachers.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center">
              No pending approvals.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <table className="hidden sm:table w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                      #
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                      Name
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">
                      Email
                    </th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((t, i) => (
                    <tr
                      key={t.id}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">
                        {i + 1}
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {t.full_name}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{t.email}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleApprove(t.id)}
                            disabled={approvingId === t.id}
                            className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs gap-1.5"
                          >
                            <UserCheck size={13} />
                            {approvingId === t.id ? "Approving…" : "Approve"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setRejectTarget(t)}
                            disabled={rejectingId === t.id}
                            className="h-7 px-3 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 gap-1.5"
                          >
                            <X size={13} />
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile card list */}
              <div className="sm:hidden divide-y divide-gray-50">
                {teachers.map((t, i) => (
                  <div key={t.id} className="px-4 py-3.5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {t.full_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">
                          {t.email}
                        </p>
                      </div>
                      <span className="text-[10px] font-mono text-gray-300 shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleApprove(t.id)}
                        disabled={approvingId === t.id}
                        className="bg-green-600 hover:bg-green-700 text-white h-7 px-3 text-xs gap-1.5"
                      >
                        <UserCheck size={13} />
                        {approvingId === t.id ? "Approving…" : "Approve"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setRejectTarget(t)}
                        disabled={rejectingId === t.id}
                        className="h-7 px-3 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 gap-1.5"
                      >
                        <X size={13} />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}