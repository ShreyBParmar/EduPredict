import { useState } from "react";
import Analytics from "./tabs/Analytics";
import MarkAttendence from "./tabs/MarkAttendence";
import UploadMarks from "./tabs/UploadMarks";
import RiskStudent from "./tabs/RiskStudent";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";
import { generateFacultyStudentReportPDF } from "../../utils/generatePdfReport";
import axios from "axios";

const FacultyGraph = ({ subjects = [] }) => {
  const [active, setActive] = useState("Analytics");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { selectedSubject } = useSubject();
  const { user } = useAuth();

  const tabs = ["Analytics", "Mark Attendance", "Upload Marks", "At-Risk Student"];

  const handleGeneratePDF = async () => {
    try {
      if (!selectedSubject) {
        alert('Please select a subject first');
        return;
      }

      setGeneratingPdf(true);
      
      // Fetch students for the selected subject
      console.log("📡 Fetching students for subject:", selectedSubject._id);
      const res = await axios.get(
        `http://localhost:5000/api/student/risk-students?subjectId=${selectedSubject._id}&semester=${selectedSubject?.semester || ""}`
      );

      console.log("📥 Fetched students response:", res.data);

      if (res.data.success && res.data.students) {
        await generateFacultyStudentReportPDF(user, selectedSubject, res.data.students);
        console.log("✅ PDF generated successfully");
      } else {
        alert('No student data found for this subject');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  // ---------------- DATA PROCESSING ----------------
  const subjectNames = subjects.map(s => s.subject?.subjectName || "Sub");

  const attendanceValues = subjects.map(s => s.attendance || 0);

  const marksValues = subjects.map(
    s => (s.internalMarks || 0) + (s.externalMarks || 0)
  );

  return (
    <div className="mt-5 ml-5 flex flex-col">

      {/* PDF Download Button */}
      <div className="flex justify-end mb-6 pr-5">
        <button
          onClick={handleGeneratePDF}
          disabled={generatingPdf || !selectedSubject}
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
              📄 Generate Subject Report
            </>
          )}
        </button>
      </div>

      {/* ---------------- TABS ---------------- */}
      <div className="flex bg-gray-200 rounded-full p-1 mb-6 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-full transition
            ${
              active === tab
                ? "bg-white shadow text-black"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ---------------- GRAPH SECTION ---------------- */}
      <div className="w-full max-w-5xl">

        {/* ANALYTICS TAB */}
        {active === "Analytics" && (<Analytics />)}

        {/* ATTENDANCE TAB */}
        {active === "Mark Attendance" && (<MarkAttendence />)}

        {/* MARKS TAB */}
        {active === "Upload Marks" && (<UploadMarks />)}

        {/* RISK TAB */}
        {active === "At-Risk Student" && (<RiskStudent />)}

      </div>
    </div>
  );
};

export default FacultyGraph;