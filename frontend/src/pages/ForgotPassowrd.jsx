import { useState } from "react";
import { GraduationCap, Mail, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "../context/toastContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const validateEmail = (val) => {
    if (!val) {
      setEmailError("Email address is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateEmail(email)) {
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!data.ok) {
        const errorMsg = data.message || "Unable to send reset link. Please check your email.";
        setMessage(errorMsg);
        setIsError(true);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      const successMsg = "Password reset instructions have been sent to your email.";
      setMessage(successMsg);
      setIsError(false);
      toast.success(successMsg);
      setLoading(false);
    } catch (err) {
      console.error(err);
      const networkError = "Server connection error. Please try again later.";
      setMessage(networkError);
      setIsError(true);
      toast.error(networkError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
          <p className="text-sm text-slate-500">Enter your registered email address to receive a password reset link.</p>
        </div>

        {/* Status Notification Banner */}
        {message && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2.5 animate-in fade-in ${
              isError
                ? "bg-rose-50 border-rose-200 text-rose-800"
                : "bg-emerald-50 border-emerald-200 text-emerald-800"
            }`}
          >
            {isError ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                type="email"
                placeholder="name@institution.edu"
                name="email"
                value={email}
                onBlur={(e) => validateEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                  emailError
                    ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (emailError) validateEmail(e.target.value);
                  if (message) setMessage("");
                }}
                required
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-rose-600 mt-1.5 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} className="shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "Sending Link..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          <a href="/login" className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
