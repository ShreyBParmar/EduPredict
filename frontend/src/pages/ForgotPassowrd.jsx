import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Mail, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  MailCheck, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw 
} from "lucide-react";
import { useToast } from "../context/toastContext";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [directResetLink, setDirectResetLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();
  const toast = useToast();

  // Cooldown countdown effect
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [cooldown]);

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

  const handleSendLink = async (targetEmail) => {
    const emailToSend = (targetEmail || email).trim();
    if (!validateEmail(emailToSend)) {
      return;
    }

    setServerError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToSend })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        let errorMsg = data.message || "Failed to process password reset request.";
        if (res.status === 404) {
          errorMsg = "No account found with this email address. Please check spelling or sign up.";
        }
        setServerError(errorMsg);
        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      // Success
      setSubmittedEmail(emailToSend);
      setIsSubmitted(true);
      setCooldown(30); // 30s resend cooldown

      const token = data.token || "";
      const link = data.resetLink || (token ? `${window.location.origin}/reset-password/${token}` : "");
      setResetToken(token);
      setDirectResetLink(link);

      toast.success("Password reset link generated successfully!");
      setLoading(false);
    } catch (err) {
      console.error(err);
      const networkError = "Unable to connect to the authentication server. Please check your connection.";
      setServerError(networkError);
      toast.error(networkError);
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendLink(email);
  };

  const handleResend = () => {
    if (cooldown > 0 || loading) return;
    handleSendLink(submittedEmail);
  };

  const handleCopyLink = () => {
    const linkToCopy = directResetLink || `${window.location.origin}/reset-password/${resetToken}`;
    navigator.clipboard.writeText(linkToCopy);
    setCopied(true);
    toast.success("Reset link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenResetPage = () => {
    if (resetToken) {
      navigate(`/reset-password/${resetToken}`);
    } else if (directResetLink) {
      window.location.href = directResetLink;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-full max-w-md space-y-6">
        
        {/* State 1: Link Sent Successfully */}
        {isSubmitted ? (
          <div className="space-y-6 animate-in fade-in">
            {/* Header / Icon */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="bg-emerald-50 text-emerald-600 p-3.5 rounded-2xl border border-emerald-100 shadow-sm">
                <MailCheck className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Check Your Inbox</h1>
              <p className="text-xs text-slate-500">A password reset link has been dispatched to:</p>
              <div className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-800 break-all text-center">
                {submittedEmail}
              </div>
            </div>

            {/* Expiry Badge */}
            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 font-medium bg-amber-50/70 border border-amber-100 p-2.5 rounded-xl text-amber-800">
              <Clock size={14} className="text-amber-600 shrink-0" />
              <span>Link is active for <strong>10 minutes</strong>.</span>
            </div>

            {/* Direct Access for Testing / Development */}
            {(resetToken || directResetLink) && (
              <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                    Direct Reset Link
                  </span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-semibold px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
                <p className="text-xs text-blue-800">
                  You can immediately proceed to set your new password:
                </p>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleOpenResetPage}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <span>Open Reset Page</span>
                    <ExternalLink size={14} />
                  </button>

                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                    title="Copy reset link"
                  >
                    {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>{copied ? "Copied" : "Copy"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Resend Action */}
            <div className="space-y-3 pt-1">
              <button
                onClick={handleResend}
                disabled={cooldown > 0 || loading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>
                  {cooldown > 0
                    ? `Resend link in ${cooldown}s`
                    : loading
                    ? "Sending..."
                    : "Resend Reset Link"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setServerError("");
                }}
                className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-semibold hover:underline cursor-pointer"
              >
                Use a different email address
              </button>
            </div>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              <a 
                href="/login" 
                className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </a>
            </div>
          </div>
        ) : (
          /* State 2: Input Email Form */
          <div className="space-y-6">
            {/* Header Branding */}
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot Password</h1>
              <p className="text-sm text-slate-500">
                Enter your registered email address to receive a secure password reset link.
              </p>
            </div>

            {/* Server Error Alert Banner */}
            {serverError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{serverError}</span>
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
                      if (serverError) setServerError("");
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
                {loading ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
              <a 
                href="/login" 
                className="inline-flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Sign In
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
