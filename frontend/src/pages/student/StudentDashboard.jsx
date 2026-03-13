import React, { useEffect, useState }  from 'react'
import Header from './Header'
import Cards from './Cards'
import Graph from './Graph'
import { getStudentDashboard } from '../../services/studentApi'

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {

    const fetchData = async () => {
      const data = await getStudentDashboard();
      setSubjects(data);
    };

    fetchData();

  }, []);

  return (
    <div>
      {/* Header*/}
      <Header />
      <Cards subjects={subjects}/>
      <Graph subjects={subjects}/>
    </div>
  )
}

export default StudentDashboard