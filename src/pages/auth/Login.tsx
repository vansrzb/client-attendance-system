import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { GraduationCap } from "lucide-react";

export default function Login() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white border border-gray-100 rounded-xl p-8 w-full max-w-sm shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800">AttendTrack</span>
        </div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-400 mb-6">Sign in to your teacher account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@school.edu" className="h-9 text-sm" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-500">Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" className="h-9 text-sm" required />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button type="submit" disabled={loading}
            className="w-full h-9 bg-green-600 hover:bg-green-700 text-white text-sm">
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}