import React, { useEffect, useState } from 'react';
import Header from './Header';
import Cards from './Cards';
import Graph from './Graph';
import { getStudentDashboard } from '../../services/studentApi';
import { generateAcademicReportPDF } from '../../utils/generatePdfReport';
import { useAuth } from '../../context/authContext';
import { FileText, Loader2, AlertCircle, Inbox } from 'lucide-react';
import { Skeleton, SkeletonKPICards, SkeletonTable } from '../../components/ui/Skeleton';

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
      <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
          {/* Skeleton Action Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
            <div className="space-y-1.5">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-3.5 w-72" />
            </div>
            <Skeleton className="h-9 w-44 rounded-xl" />
          </div>

          {/* Skeleton KPI Cards */}
          <SkeletonKPICards count={4} />

          {/* Skeleton Tabs & Content */}
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <Skeleton className="h-9 w-28 rounded-lg" />
              <Skeleton className="h-9 w-32 rounded-lg" />
              <Skeleton className="h-9 w-28 rounded-lg" />
            </div>
            <SkeletonTable rows={4} cols={5} />
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Dashboard Error</p>
              <p className="text-xs text-rose-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* PDF Download Button & Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Academic Overview</h1>
            <p className="text-xs text-slate-500">Real-time attendance, performance marks, and risk prediction</p>
          </div>

          <button
            onClick={handleGeneratePDF}
            disabled={generatingPdf || subjects.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
          >
            {generatingPdf ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating Report...</span>
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                <span>Generate PDF Report</span>
              </>
            )}
          </button>
        </div>

        {subjects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center my-8 shadow-xs">
            <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-800">No Subjects Assigned</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              There are currently no registered subjects assigned for this semester. Contact your academic advisor.
            </p>
          </div>
        ) : (
          <div className="space-y-6 mt-4">
            <Cards subjects={subjects} />
            <Graph subjects={subjects} />
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
