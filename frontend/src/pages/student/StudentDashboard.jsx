import React, { useEffect, useState }  from 'react'
import Header from './Header'
import Cards from './Cards'
import Graph from './Graph'
import { getStudentDashboard } from '../../services/studentApi'

const StudentDashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getStudentDashboard();
        
        console.log("API Response: ", data);
        console.log("Subjects from API: ", data.subjects);
        
        if (data && data.subjects && Array.isArray(data.subjects)) {
          setSubjects(data.subjects);
          console.log("✅ Subjects loaded successfully:", data.subjects.length, "subjects");
        } else {
          console.error("❌ Invalid data structure:", data);
          setError("Invalid subject data received");
        }
      } catch (err) {
        console.error("❌ Error fetching dashboard:", err);
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header*/}
      <Header />
      {subjects.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          <p>No subjects assigned for this semester</p>
        </div>
      ) : (
        <>
          <Cards subjects={subjects}/>
          <Graph subjects={subjects}/>
        </>
      )}
    </div>
  )
}

export default StudentDashboard
