import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
 
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/admin";
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const user = await login(email, password);
      if (user.role === "customer") {
        await logout();
        setError("This account does not have admin access.");
        return;
      }
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err?.response?.data?.detail || "Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-8 shadow-2xl">
        <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400">Staff access only</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Admin sign in</h1>
        <p className="mt-1 text-sm text-slate-400">This panel is restricted to Lumen staff accounts.</p>
 
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Mail size={16} className="text-slate-400" />
            <input
              required
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
            <Lock size={16} className="text-slate-400" />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
            />
          </div>
 
          {error && <p className="text-sm text-red-400">{error}</p>}
 
          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {submitting ? "Signing in..." : "Sign in"} <ArrowRight size={15} />
          </button>
        </form>
      </div>
    </div>
  );
}
 