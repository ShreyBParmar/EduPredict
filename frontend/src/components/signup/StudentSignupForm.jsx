import { useState } from "react"
import { useNavigate } from "react-router-dom"
import logo from '/src/assets/logo.png'
import { Eye, EyeOff,GraduationCap } from "lucide-react"; 

const StudentSignupForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    enrollmentId: "",
    year: ""
  })

   const navigate = useNavigate();

   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    
    try{
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }

   const res= await fetch("http://localhost:5000/api/auth/register_student", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
      body: JSON.stringify({
      ...formData,
      enrollmentId: Number(formData.enrollmentId),
      year: Number(formData.year)
    })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Registration failed");
      return;
    }

    alert("Registration successful");

    navigate("/login");
  }
  catch(error){ 
    console.error(error);
    alert("Signup failed");
  }
  
}

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl/70 w-96 grid gap-3"
      >
        <div className="relative flex items-center justify-center">
           {/* <img src={logo} className='absolute left-0 w-20 h-20 object-contain'/> */}
            <div className="bg-blue-600 w-10 h-10 rounded-2xl absolute left-0 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-xl font-semibold text-center pr-3">Signup</h2>
        </div>

        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          className="border p-2 rounded focus:placeholder-transparent"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          className="border p-2 rounded focus:placeholder-transparent"
          onChange={handleChange}
          required
        />

        <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  className="border p-2 rounded w-full pr-10 focus:placeholder-transparent"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  className="border p-2 rounded w-full pr-10 focus:placeholder-transparent"
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

        <input
          type="text"
          name="enrollmentId"
          placeholder="Enrollment ID"
          value={formData.enrollmentId}
          className="border p-2 rounded focus:placeholder-transparent"
          onChange={handleChange}
          required
        />

        <select
          name="year"
          className="border p-2 rounded"
          value={formData.year}
          onChange={handleChange}
          required
        >
          <option value="" className="font-bold">Select Year</option>
          <option value="1">First Year</option>
          <option value="2">Second Year</option>
          <option value="3">Third Year</option>
          <option value="4">Fourth Year</option>
        </select> 

        <button
          type="submit"
          className="mt-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-500 hover:text-black">
          Register
        </button>
        <span><a href="/login" className="hover:text-blue-500 hover:underline pl-">Already have an account?</a></span>
      </form>
      
    </div>
  )
}

export default StudentSignupForm;

