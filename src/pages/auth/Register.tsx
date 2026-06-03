import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="bg-white border border-gray-100 rounded-xl p-6 sm:p-8 w-full max-w-sm shadow-sm">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800">AttendTrack</span>
        </div>

        <h1 className="text-xl font-semibold text-gray-900 mb-1">
          Create account
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Register as a teacher
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-10 text-sm"
              required
            />
          </div>

          {error && (
            <p className="text-xs text-red-500">{error}</p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-green-600 text-white text-sm"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-xs text-gray-400 mt-4 text-center">
          Already have an account? Go to login
        </p>

      </div>
    </div>
  );
}