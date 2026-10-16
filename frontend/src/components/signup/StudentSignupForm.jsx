import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Loader2, Mail, User, Hash, BookOpen, Lock, AlertCircle, CheckCircle2 } from "lucide-react"; 
import { useToast } from "../../context/toastContext";

const StudentSignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    enrollmentId: "",
    semester: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "Email address is required";
      } else if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address (e.g. name@domain.com)";
      }
    } else if (name === "password") {
      if (!value) {
        errorMsg = "Password is required";
      } else if (value.length <= 6) {
        errorMsg = "Password must be at least 7 characters";
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        errorMsg = "Please confirm your password";
      } else if (value !== formData.password) {
        errorMsg = "Passwords do not match";
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg
    }));
    return !errorMsg;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      validateField(name, value);
    }
    if (name === "password" && formData.confirmPassword) {
      if (formData.confirmPassword !== value) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
    if (serverError) setServerError("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    // Validate all fields
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length <= 6) {
      newErrors.password = "Password must be at least 7 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.enrollmentId) newErrors.enrollmentId = "Enrollment ID is required";
    if (!formData.semester) newErrors.semester = "Please select your semester";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register_student`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formData,
          enrollmentId: Number(formData.enrollmentId),
          semester: Number(formData.semester)
        })
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || "Registration failed. Please check your details.";
        setServerError(msg);
        if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("already")) {
          setErrors((prev) => ({ ...prev, email: msg }));
        }
        toast.error(msg);
        setLoading(false);
        return;
      }

      setSuccessMessage("Registration successful! Redirecting to login...");
      toast.success("Account created successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) { 
      console.error(error);
      const networkError = "Unable to connect to the server. Please try again later.";
      setServerError(networkError);
      toast.error(networkError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 my-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Student Registration</h1>
          <p className="text-sm text-slate-500">Create your student profile on EduPredict</p>
        </div>

        {/* Server Error Alert Banner */}
        {serverError && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{serverError}</span>
          </div>
        )}

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                type="text"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                  errors.fullName
                    ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
                onChange={handleChange}
                required
              />
            </div>
            {errors.fullName && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email */}
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
                name="email"
                placeholder="student@university.edu"
                value={formData.email}
                onBlur={(e) => validateField("email", e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                  errors.email
                    ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
                onChange={handleChange}
                required
              />
            </div>
            {errors.email && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          {/* Passwords grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onBlur={(e) => validateField("password", e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                    errors.password
                      ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                      : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onBlur={(e) => validateField("confirmPassword", e.target.value)}
                  className={`w-full pl-3 pr-8 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                    errors.confirmPassword
                      ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                      : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.confirmPassword}</span>
                </p>
              )}
            </div>
          </div>

          {/* Academic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Enrollment ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Hash size={16} />
                </div>
                <input
                  type="text"
                  name="enrollmentId"
                  placeholder="e.g. 102938"
                  value={formData.enrollmentId}
                  className={`w-full pl-8 pr-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                    errors.enrollmentId
                      ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                      : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  onChange={handleChange}
                  required
                />
              </div>
              {errors.enrollmentId && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.enrollmentId}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Semester
              </label>
              <div className="relative">
                <select
                  name="semester"
                  className={`w-full px-3 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm focus:bg-white transition-all outline-none cursor-pointer ${
                    errors.semester
                      ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                      : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  }`}
                  value={formData.semester}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Semester</option>
                  <option value="1">1st Semester</option>
                  <option value="2">2nd Semester</option>
                  <option value="3">3rd Semester</option>
                  <option value="4">4th Semester</option>
                  <option value="5">5th Semester</option>
                  <option value="6">6th Semester</option>
                  <option value="7">7th Semester</option>
                  <option value="8">8th Semester</option>
                </select>
              </div>
              {errors.semester && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.semester}</span>
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <span>Register Student Account</span>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already have an account?{' '}
          <a href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default StudentSignupForm;
