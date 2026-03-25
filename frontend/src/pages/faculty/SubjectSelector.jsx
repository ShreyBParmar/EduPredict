import React, { useEffect, useState } from "react";
import {
  getSubjectsBySemester,
  getStudentsBySubject
} from "../../services/facultyApi";

const SubjectSelector = ({ setStudents }) => {

  const [semester, setSemester] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");

  useEffect(() => {

    if (!semester) return;

    const fetchSubjects = async () => {

      const data = await getSubjectsBySemester(semester);
      setSubjects(data);

    };

    fetchSubjects();

  }, [semester]);

  useEffect(() => {

    if (!subject) return;

    const fetchStudents = async () => {

      const data = await getStudentsBySubject(subject);
      setStudents(data);

    };

    fetchStudents();

  }, [subject]);

  return (
    <div className="p-6">

      <h3 className="font-semibold mb-2">
        Select Subject
      </h3>

      <select
        className="border p-2 mr-4"
        onChange={(e) => setSemester(e.target.value)}
      >

        <option>Select Semester</option>

        {[1,2,3,4,5,6,7,8].map((s)=>(
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}

      </select>

      <select
        className="border p-2"
        onChange={(e) => setSubject(e.target.value)}
      >

        <option>Select Subject</option>

        {subjects.map((sub)=>(
          <option key={sub._id} value={sub._id}>
            {sub.subjectName}
          </option>
        ))}

      </select>

    </div>
  );
};

export default SubjectSelector;