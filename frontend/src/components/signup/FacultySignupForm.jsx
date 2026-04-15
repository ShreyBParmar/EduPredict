import { useState, useEffect } from "react"; // ✅ added useEffect
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff, GraduationCap } from "lucide-react"; 

const FacultySignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    facultyId: "",
    role: ""
  })

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const semesters = [1, 2, 3, 4, 5, 6, 7];

  const [semester, setSemester] = useState(""); // ✅ keep this
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  // ✅ NEW: handle subject checkbox
  const handleSubjectSelect = (id) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      if (formData.password.length <= 6) {
        alert("Password should be more than 6 characters");
        return; // ✅ added return
      }

      // ✅ include semester + subjects
      const payload = {
        ...formData,
        semester,
        subjects: selectedSubjects
      };

      const res = await fetch("http://localhost:5000/api/auth/register_faculty", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("Faculty Signup Data:", payload);

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Registration failed");
        return;
      }

      alert("Registration successful");
      navigate("/login");

    } catch (error) {
      console.error(error);
      alert("Signup failed");
    }
  }

  // ✅ FIXED: full URL + reset subjects
  useEffect(() => {
     if (semester) {
    console.log("Selected Sem:", semester)}; // ✅ debug

    if (semester) {
      fetch(`http://localhost:5000/api/subjects/?sem=${semester}`)
        .then(res => res.json())
        .then(data => {
          setSubjects(data);
          setSelectedSubjects([]); // reset when sem changes
        });
    }
  }, [semester]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl w-96 grid gap-3"
      >

        <div className="relative flex items-center justify-center">
          <div className="bg-blue-600 w-10 h-10 rounded-2xl absolute left-0 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold">Signup</h2>
        </div>

        <input type="text" name="fullName" placeholder="Full Name" className="border p-2 rounded" onChange={handleChange} required />

        <input type="email" name="email" placeholder="Email" className="border p-2 rounded" onChange={handleChange} required />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            className="border p-2 rounded w-full pr-10"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="border p-2 rounded w-full pr-10"
            onChange={handleChange}
            required
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2">
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <input type="text" name="facultyId" placeholder="Faculty ID" className="border p-2 rounded" onChange={handleChange} required />

        {/* ✅ FIXED Semester */}
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Semester</option>
          {semesters.map((sem) => (
            <option key={sem} value={sem}>
              Sem {sem}
            </option>
          ))}
        </select>

        {/* ✅ Subjects */}
        {subjects.length > 0 && (
          <div className="mt-3 border p-2 rounded max-h-40 overflow-y-auto">
            <p className="text-sm font-semibold mb-2">Select Subjects:</p>

            {subjects.map((sub) => (
              <label key={sub._id} className="block text-sm">
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(sub._id)}
                  onChange={() => handleSubjectSelect(sub._id)}
                  className="mr-2"
                />
                {sub.subjectName}
              </label>
            ))}
          </div>
        )}

        <button type="submit" className="mt-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-500">
          Register
        </button>

        <span>
          <a href="/login" className="hover:underline text-blue-500">
            Already have an account?
          </a>
        </span>

      </form>
    </div>
  )
}

export default FacultySignupForm;