import axios from "axios";

export const getStudentDashboard = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/student/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};