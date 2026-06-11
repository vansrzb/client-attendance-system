import { useNavigate } from "react-router-dom";
import { ShieldOff } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 font-sans">
      <div className="text-center space-y-5 max-w-sm">

        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center">
            <ShieldOff size={28} className="text-red-400" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <p className="text-xs font-mono text-red-400 tracking-widest uppercase">
            403 — Unauthorized
          </p>
          <h1 className="text-xl font-semibold text-gray-800">
            Access Denied
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            You do not have the necessary permissions to access this page.
            If you believe this is an error, please contact your system
            administrator for assistance.
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Actions */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Go Back
          </button>
          <span className="text-gray-200">·</span>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              navigate("/login", { replace: true });
            }}
            className="text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}