import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, GraduationCap, Loader2, Plus, Trash2, BookOpen, User, Mail, Lock, Hash, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "../../context/toastContext";

const FacultySignupForm = () => {
  const semesters = [1, 2, 3, 4, 5, 6, 7];
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    facultyId: ""
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [teachingData, setTeachingData] = useState([]);

  const validateField = (name, value) => {
    let errorMsg = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) {
        errorMsg = "Email address is required";
      } else if (!emailRegex.test(value)) {
        errorMsg = "Please enter a valid email address";
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

  // 🔹 Input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

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

  // 🔹 Add semester block
  const addSemester = () => {
    setTeachingData([
      ...teachingData,
      { semester: "", subjects: [], availableSubjects: [] }
    ]);
    if (errors.teachingData) {
      setErrors((prev) => ({ ...prev, teachingData: "" }));
    }
  };

  // 🔹 Remove semester block
  const removeSemester = (index) => {
    const updated = teachingData.filter((_, i) => i !== index);
    setTeachingData(updated);
  };

  // 🔹 Handle semester change + fetch subjects
  const handleSemesterChange = async (index, sem) => {
    const updated = [...teachingData];
    updated[index].semester = sem;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/subjects/?sem=${sem}`
      );

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }
      const data = await res.json();

      updated[index].availableSubjects = data;
      updated[index].subjects = [];

      setTeachingData(updated);
      if (errors.teachingData) {
        setErrors((prev) => ({ ...prev, teachingData: "" }));
      }
    } catch (err) {
      console.error("FETCH ERROR:", err.message);
      toast.error("Failed to load subjects for this semester");
    }
  };

  // 🔹 Handle subject select
  const handleSubjectSelect = (index, subId) => {
    const updated = [...teachingData];
    const subjects = updated[index].subjects;

    if (subjects.includes(subId)) {
      updated[index].subjects = subjects.filter((id) => id !== subId);
    } else {
      updated[index].subjects.push(subId);
    }

    setTeachingData(updated);
    if (errors.teachingData) {
      setErrors((prev) => ({ ...prev, teachingData: "" }));
    }
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");

    // Validations
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

    if (!formData.facultyId.trim()) newErrors.facultyId = "Faculty ID is required";

    if (teachingData.length === 0) {
      newErrors.teachingData = "Please add at least one semester assignment";
    } else {
      for (const item of teachingData) {
        if (!item.semester || item.subjects.length === 0) {
          newErrors.teachingData = "Each semester block must have a semester selected and at least one subject assigned";
          break;
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.teachingData) {
        toast.warning(newErrors.teachingData);
      }
      return;
    }

    setLoading(true);

    const payload = {
      ...formData,
      teachingData
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/auth/register_faculty`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const msg = data.message || "Faculty registration failed.";
        setServerError(msg);
        if (msg.toLowerCase().includes("email") || msg.toLowerCase().includes("already")) {
          setErrors((prev) => ({ ...prev, email: msg }));
        }
        toast.error(msg);
        setLoading(false);
        return;
      }

      setSuccessMessage("Faculty registered successfully! Redirecting to login...");
      toast.success("Account created successfully!");
      setLoading(false);
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.error(err);
      const networkError = "Unable to connect to the server. Please try again later.";
      setServerError(networkError);
      toast.error(networkError);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 my-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-full max-w-xl space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Faculty Registration</h1>
          <p className="text-sm text-slate-500">Register to manage subjects and evaluate student performance</p>
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
          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  name="fullName"
                  type="text"
                  placeholder="Prof. Jane Smith"
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  name="email"
                  type="email"
                  placeholder="faculty@university.edu"
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
          </div>

          {/* Passwords Grid */}
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
                Confirm Password
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

          {/* Faculty ID */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Faculty ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Hash size={18} />
              </div>
              <input
                type="text"
                name="facultyId"
                placeholder="e.g. FAC-2024-09"
                value={formData.facultyId}
                className={`w-full pl-10 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:bg-white transition-all outline-none ${
                  errors.facultyId
                    ? "border-rose-400 focus:border-rose-600 focus:ring-1 focus:ring-rose-600"
                    : "border-slate-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                }`}
                onChange={handleChange}
                required
              />
            </div>
            {errors.facultyId && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-semibold">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.facultyId}</span>
              </p>
            )}
          </div>

          {/* Teaching Assignment Section Header */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Teaching Assignments</h3>
              <p className="text-xs text-slate-500">Add the semesters and subjects you teach</p>
            </div>
            <button
              type="button"
              onClick={addSemester}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus size={14} /> Add Semester
            </button>
          </div>

          {errors.teachingData && (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 p-2.5 rounded-xl flex items-center gap-2 text-xs font-semibold">
              <AlertCircle size={14} className="text-amber-600 shrink-0" />
              <span>{errors.teachingData}</span>
            </div>
          )}

          {/* Dynamic Semester Blocks */}
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {teachingData.length === 0 ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-xs font-medium text-slate-500">No semesters added yet.</p>
                <p className="text-[11px] text-slate-400">Click "+ Add Semester" above to configure subjects.</p>
              </div>
            ) : (
              teachingData.map((item, index) => (
                <div key={index} className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Semester Block #{index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeSemester(index)}
                      className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                    >
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>

                  <select
                    value={item.semester}
                    onChange={(e) => handleSemesterChange(index, e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-blue-600 outline-none cursor-pointer"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((sem) => (
                      <option key={sem} value={sem}>
                        Semester {sem}
                      </option>
                    ))}
                  </select>

                  {item.availableSubjects?.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[11px] font-semibold text-slate-500 uppercase">Available Subjects:</p>
                      <div className="max-h-32 overflow-y-auto bg-white border border-slate-200 rounded-lg p-2.5 space-y-1.5">
                        {item.availableSubjects.map((sub) => (
                          <label key={sub._id} className="flex items-center gap-2.5 text-xs text-slate-800 cursor-pointer hover:bg-slate-50 p-1 rounded">
                            <input
                              type="checkbox"
                              checked={item.subjects.includes(sub._id)}
                              onChange={() => handleSubjectSelect(index, sub._id)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <span className="font-medium">{sub.subjectName}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Submit */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:bg-blue-400 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering Faculty Account...</span>
              </>
            ) : (
              <span>Register Faculty Account</span>
            )}
          </button>

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-blue-600 hover:underline">
              Sign In
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacultySignupForm;