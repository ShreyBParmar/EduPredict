import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Eye, EyeOff, GraduationCap } from "lucide-react";



const FacultySignupForm = () => {
  const semesters = [1, 2, 3, 4, 5, 6, 7];
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    facultyId: ""
  });

  const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [teachingData, setTeachingData] = useState([]);

  // 🔹 Input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔹 Add semester block
  const addSemester = () => {
    setTeachingData([
      ...teachingData,
      { semester: "", subjects: [], availableSubjects: [] }
    ]);
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
    } catch (err) {
      console.error("FETCH ERROR:", err.message);
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
  };

  // 🔹 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validations
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (teachingData.length === 0) {
      alert("Add at least one semester");
      return;
    }

    for (const item of teachingData) {
      if (!item.semester || item.subjects.length === 0) {
        alert("Each semester must have subjects");
        return;
      }
    }

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
        alert(data.message);
        return;
      }

      alert("Faculty Registered Successfully");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert("Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-xl space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">
          Faculty Signup
        </h2>

        {/* Basic Info */}
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          required
        />

        <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Password"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          required
        />

        <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        </div>

        <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          required
        />
         <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <input
          type="text"
          name="facultyId"
          placeholder="Faculty ID"
          className="border p-2 rounded w-full"
          onChange={handleChange}
          required
        />

        {/* Add Semester */}
        <button
          type="button"
          onClick={addSemester}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          + Add Semester
        </button>

        {/* Dynamic Blocks */}
        {teachingData.map((item, index) => (
          <div key={index} className="border p-3 rounded mt-3">

            <div className="flex justify-between items-center mb-2">
              <p className="font-semibold">Semester Block</p>
              <button
                type="button"
                onClick={() => removeSemester(index)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>

            {/* Semester */}
            <select
              value={item.semester}
              onChange={(e) =>
                handleSemesterChange(index, e.target.value)
              }
              className="border p-2 rounded w-full mb-2"
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem} value={sem}>
                  Sem {sem}
                </option>
              ))}
            </select>

            {/* Subjects */}
            <div className="max-h-32 overflow-y-auto">
              {item.availableSubjects?.map((sub) => (
                <label key={sub._id} className="block text-sm">
                  <input
                    type="checkbox"
                    checked={item.subjects.includes(sub._id)}
                    onChange={() =>
                      handleSubjectSelect(index, sub._id)
                    }
                    className="mr-2"
                  />
                  {sub.subjectName}
                </label>
              ))}
            </div>

          </div>
        ))}

        {/* Submit */}
        <button className="w-full bg-green-600 text-white py-2 rounded">
          Register
        </button>

        <span>
          <a href="/login" className="text-blue-500 hover:underline">
            Already have an account?
          </a>
        </span>
      </form>
    </div>
  );
};

export default FacultySignupForm;