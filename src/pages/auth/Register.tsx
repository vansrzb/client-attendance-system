import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GraduationCap } from "lucide-react";
import { register as registerApi } from "../../api/authApi";

export default function Register() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError(null);

    try {
      await registerApi({
        full_name: fullName,
        email,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-green-100 shadow-lg p-8">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>

          <div>
            <h2 className="font-bold text-lg text-gray-900">
              AttendTrack
            </h2>
            <p className="text-xs text-gray-500">
              QR Attendance System
            </p>
          </div>
        </div>

        {/* Header */}
        <div className="mb-6">
          <p className="text-green-600 text-xs font-semibold uppercase tracking-wider mb-2">
            Teacher Registration
          </p>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Account
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Create your teacher account and start managing attendance.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <Label className="text-sm mb-2 block">
              Full Name
            </Label>

            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Juan Dela Cruz"
              className="h-11"
              required
            />
          </div>

          <div>
            <Label className="text-sm mb-2 block">
              Email Address
            </Label>

            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teacher@example.com"
              className="h-11"
              required
            />
          </div>

          <div>
            <Label className="text-sm mb-2 block">
              Password
            </Label>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="h-11"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-green-600 hover:bg-green-700 text-white rounded-xl"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}