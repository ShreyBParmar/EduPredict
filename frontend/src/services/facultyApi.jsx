import axios from "axios";

export const getFacultyProfile = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(
    "http://localhost:5000/api/faculty/profile",
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.data;
};

{/* 
const API = "http://localhost:5000/api/faculty";

export const getFacultyProfile = async () => {

  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};
*/}
export const getSubjectsBySemester = async (semester) => {

  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/subjects/${semester}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};

export const getStudentsBySubject = async (subjectId) => {

  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/students/${subjectId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return res.data;
};