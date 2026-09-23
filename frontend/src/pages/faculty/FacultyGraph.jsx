import { useState } from "react";
import Analytics from "./tabs/Analytics";
import MarkAttendence from "./tabs/MarkAttendence";
import UploadMarks from "./tabs/UploadMarks";
import RiskStudent from "./tabs/RiskStudent";
import { useSubject } from "../../context/subjectContext";
import { useAuth } from "../../context/authContext";
import { generateFacultyStudentReportPDF } from "../../utils/generatePdfReport";
import axios from "axios";
import { FileText, Loader2, BarChart2, CheckSquare, UploadCloud, AlertTriangle } from "lucide-react";

const FacultyGraph = () => {
  const [active, setActive] = useState("Analytics");
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const { selectedSubject } = useSubject();
  const { user } = useAuth();

  const tabs = [
    { id: "Analytics", label: "Analytics Overview", icon: BarChart2 },
    { id: "Mark Attendance", label: "Mark Attendance", icon: CheckSquare },
    { id: "Upload Marks", label: "Upload Marks", icon: UploadCloud },
    { id: "At-Risk Student", label: "At-Risk Students", icon: AlertTriangle }
  ];

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
        `${import.meta.env.VITE_API_URL}/api/student/risk-students?subjectId=${selectedSubject._id}&semester=${selectedSubject?.semester || ""}`
      );

      if (res.data.success && res.data.students) {
        await generateFacultyStudentReportPDF(user, selectedSubject, res.data.students);
        console.log("✅ PDF generated successfully");
      } else {
        alert('No student data found for this subject');
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Failed to generate PDF. Please try again.');
    } fontally: {
      setGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Toolbar & Segmented Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        {/* Segmented Control Tabs */}
        <div className="bg-slate-200/70 p-1 rounded-xl flex flex-wrap items-center gap-1 w-full md:w-fit border border-slate-200">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActive(tab.id)}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-white text-blue-600 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Generate PDF Button */}
        <button
          onClick={handleGeneratePDF}
          disabled={generatingPdf || !selectedSubject}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer shrink-0"
        >
          {generatingPdf ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Report...</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Generate Subject Report</span>
            </>
          )}
        </button>
      </div>

      {/* Tab Content Display */}
      <div className="w-full">
        {active === "Analytics" && <Analytics />}
        {active === "Mark Attendance" && <MarkAttendence />}
        {active === "Upload Marks" && <UploadMarks />}
        {active === "At-Risk Student" && <RiskStudent />}
      </div>
    </div>
  );
};

export default FacultyGraph;