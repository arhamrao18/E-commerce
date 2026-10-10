import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button, Eyebrow } from "../components/ui/UI";
import { useAuth } from "../context/AuthContext";
 
export default function Auth({ mode = "login" }) {
  const [isLogin, setIsLogin] = useState(mode === "login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/account";
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (isLogin) await login(email, password);
      else await register({ fullName, email, password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };
 
  return (
    <div className="relative flex min-h-[calc(100vh-73px)] items-center justify-center overflow-hidden bg-ink px-6 py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[130px]" />
 
      <div className="relative w-full max-w-md rounded-4xl glass-dark p-9 shadow-glass-lg">
        <Eyebrow className="text-emerald-400">{isLogin ? "Welcome back" : "Create account"}</Eyebrow>
        <h1 className="mt-2 font-display text-3xl text-porcelain">{isLogin ? "Sign in" : "Join Lumen"}</h1>
 
        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          {!isLogin && (
            <FieldDark icon={<User size={16} />} placeholder="Full name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          )}
          <FieldDark icon={<Mail size={16} />} placeholder="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <FieldDark icon={<Lock size={16} />} placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
 
          {error && <p className="text-sm text-red-400">{error}</p>}
 
          {isLogin && (
            <div className="flex justify-end">
              <Link to="/forgot-password" className="font-mono text-[11px] text-porcelain/50 hover:text-porcelain">
                Forgot password?
              </Link>
            </div>
          )}
 
          <Button type="submit" variant="brass" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : isLogin ? "Sign in" : "Create account"} <ArrowRight size={15} />
          </Button>
        </form>
 
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-porcelain/10" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-porcelain/30">or</span>
          <div className="h-px flex-1 bg-porcelain/10" />
        </div>
 
        <button
          onClick={() => navigate("/shop")}
          className="w-full rounded-full glass-dark py-3 text-sm font-medium text-porcelain hover:bg-white/10"
        >
          Continue as guest
        </button>
 
        <p className="mt-7 text-center text-sm text-porcelain/50">
          {isLogin ? "New to Lumen?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin((v) => !v)} className="font-medium text-emerald-400 hover:underline">
            {isLogin ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
 
function FieldDark({ icon, ...props }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-porcelain/15 bg-white/5 px-4 py-3">
      <span className="text-porcelain/40">{icon}</span>
      <input
        required
        {...props}
        className="w-full bg-transparent text-sm text-porcelain placeholder:text-porcelain/35 focus:outline-none"
      />
    </div>
  );
}
 
// Turns the backend's error response into one readable line
function getErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return "Could not reach the server. Please try again.";
  if (data.detail) return data.detail;
  const first = Object.values(data)[0];
  return Array.isArray(first) ? first[0] : String(first);
}
 