import { useState } from "react"
import logo from '/src/assets/logo.png'
import { Eye, EyeOff,GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../context/authContext.jsx';

const Login = () => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

   const auth = useAuth();
  const navigate= useNavigate();
  
   const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleClick=async(e)=>{
    e.preventDefault();
    navigate("/forgot-password")
  }

  const handleSubmit= async(e)=>{
    e.preventDefault();

    try{
      const res= await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: formData.email,
          password: formData.password
        })
      });

      const data=await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      
      // save auth state via context (includes token, role, fullName)
      auth.loginAction({
        token: data.token,
        role: data.role,
        fullName: data.fullName,
        enrollmentId: data.enrollmentId ?? null,
        facultyId: data.facultyId ?? null,
        semester:data.semester,
        subjects: data.subjects
      });

      // also keep token separately if other code expects it
      localStorage.setItem("token", data.token);
      console.log("Login detail: ", data);
      
      // redirect based on role
      if (data.role === "student") {
        navigate("/student/dashboard");
      } else {
        navigate("/faculty/dashboard");
      }
    } catch(error){
      console.error(error);
      alert("Login failed");
    }
  }

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center ">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-xl/70 w-96 grid gap-3">

            <div className="relative flex items-center justify-center">
              <div className="bg-blue-600 w-10 h-10 rounded-2xl absolute left-0 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-center pr-3">Login</h2>
            </div>

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
              <span>
                <div>
                  <input 
                    type="text" 
                    value="Forgot your password?" 
                    className="hover:text-blue-500 hover:underline display:inline cursor-pointer"
                    onClick={handleClick}
                  />
                </div>
              </span>
              <button
                type="submit"
                className="mt-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-500 hover:text-black">
                Submit
              </button>
      </form>
      </div>
    </div>
  )
}

export default Login