import axios from "axios";

export const getStudentDashboard = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/api/student/dashboard",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};