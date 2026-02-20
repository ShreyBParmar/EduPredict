import { useState } from "react";
import { GraduationCap } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitted");
    console.log("Email: ",email);
    

    const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();

    if (!data.ok) {
      alert(data.message || "Something went wrong");
      return;
    }

    alert("Reset link sent. Check console/email.");
  };

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

        <input
          type="email"
          placeholder="Enter your email"
          name="email"
          value={email}
          className="border p-2 rounded focus:placeholder-transparent"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="mt-2 bg-blue-700 text-white py-2 rounded hover:bg-blue-500 hover:text-black">Send Reset Link</button>
      </form>

      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
