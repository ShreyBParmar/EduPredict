import { BrowserRouter, Routes, Route } from "react-router-dom"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import StudentSignupForm from "./components/signup/StudentSignupForm"
import FacultySignupForm from "./components/signup/FacultySignupForm"
import StudentDashboard from "./pages/student/StudentDashboard"
import FacultyDashboard from "./pages/faculty/FacultyDashboard"
import ForgotPassword from "./pages/ForgotPassowrd"
import ResetPassword from "./pages/ResetPassword"


function App() {
   return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/student" element={<StudentSignupForm />} />
        <Route path="/signup/faculty" element={<FacultySignupForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/student/dashboard" element={<StudentDashboard />}/>
        <Route path="/faculty/dashboard" element={<FacultyDashboard />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password/:token" element={<ResetPassword />}/>
      </Routes>
    </BrowserRouter>
   )
}

export default App;
