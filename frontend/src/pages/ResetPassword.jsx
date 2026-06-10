import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Eye, EyeOff,GraduationCap } from "lucide-react";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  })

  const { token } = useParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

      try{
        if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match")
        return
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...formData})
      });

      const data = await res.json();

      if (!data.success) {
        setMessage(data.message || "Reset failed");
        return;
      }

      setMessage("Password reset successful");
      setTimeout(() => navigate("/login"), 2000);
  }

  catch(error){
    console.error(error);
    alert("Reset password failed");
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
                      <h2 className="text-xl font-semibold text-center pr-3">Forgot password</h2>
                    </div>

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

      <button type="submit" className="mt-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-500 hover:text-black">Reset Password</button>
      {message && <p>{message}</p>}
    </form>
    </div>
    </div>
  )
}

export default ResetPassword