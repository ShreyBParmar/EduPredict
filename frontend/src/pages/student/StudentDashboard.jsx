import React, { useEffect, useState }  from 'react'
import Header from './Header'
import Cards from './Cards'
import Graph from './Graph'
import { getStudentDashboard } from '../../services/studentApi'
import { generateAcademicReportPDF } from '../../utils/generatePdfReport'
import { useAuth } from '../../context/authContext'

const StudentDashboard = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  useEffect(() => {

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getStudentDashboard();
        
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

  const handleGeneratePDF = async () => {
    try {
      setGeneratingPdf(true);
      await generateAcademicReportPDF(user, subjects);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

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
      
      {/* PDF Download Button */}
      <div className="px-6 py-4 flex justify-end">
        <button
          onClick={handleGeneratePDF}
          disabled={generatingPdf || subjects.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {generatingPdf ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              📄 Generate PDF Report
            </>
          )}
        </button>
      </div>

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
