import axios from "axios";

const API = "http://localhost:5000/api/faculty";

export const getFacultyProfile = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const getStudentsBySemester = async (semester) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/students/${semester}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};

export const markAttendance = async (subjectId, semester, attendanceData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/mark-attendance`,
    { subjectId, semester, attendanceData },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const updateMarks = async (subjectId, semester, examType, marksData) => {
  const token = localStorage.getItem("token");
  const res = await axios.post(
    `${API}/update-marks`,
    { subjectId, semester, examType, marksData },
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

export const getSubjectMarksData = async (subjectId, semester) => {
  const token = localStorage.getItem("token");
  const res = await axios.get(
    `${API}/subject-marks/${subjectId}?semester=${semester}`,
    {
      headers: { Authorization: `Bearer ${token}` }
    }
  );
  return res.data;
};

{/*
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
*/ }
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