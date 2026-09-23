import { useState } from "react";
import { GraduationCap, Mail, ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted");
    console.log("Email: ", email);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!data.ok) {
      const errorMsg = data.message || "Something went wrong";
      setMessage(errorMsg);
      alert(errorMsg);
      return;
    }

    const successMsg = "Reset link sent. Check console/email.";
    setMessage(successMsg);
    alert(successMsg);
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-none"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            Send Reset Link
          </button>
        </form>

        {message && (
          <p className="text-sm text-blue-600 text-center font-medium bg-blue-50 py-2 px-3 rounded-lg border border-blue-100">
            {message}
          </p>
        )}

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
