import { useState, useEffect } from 'react';
import { useSubject } from '../../../context/subjectContext';
import { useToast } from '../../../context/toastContext';
import { getStudentsBySemester, updateMarks } from '../../../services/facultyApi';
import { BookOpen, Award, UploadCloud, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { SkeletonTable } from '../../../components/ui/Skeleton';

const UploadMarks = () => {
  const { selectedSubject } = useSubject();
  const toast = useToast();

  const [examType, setExamType] = useState('internal');
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when subject or examType changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedSubject?._id, selectedSubject?.semester, examType]);

  const totalPages = Math.ceil(students.length / 5);

  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * 5;
  const paginatedStudents = students.slice(startIndex, startIndex + 5);

  const examTypes = [
    { value: 'internal', label: 'Internal Marks (Max: 30)', max: 30 },
    { value: 'external', label: 'External Marks (Max: 70)', max: 70 },
    { value: 'Practical', label: 'Practical Marks (Max: 30)', max: 30 }
  ];

  // Fetch students when subject changes
  useEffect(() => {
    if (selectedSubject?.semester && selectedSubject?._id) {
      fetchStudents();
    }
  }, [selectedSubject?.semester, selectedSubject?._id]);

  useEffect(() => {
    if (students.length === 0) return;

    const resetMarks = {};
    students.forEach((student) => {
      resetMarks[student._id] = "";
    });

    setMarks(resetMarks);
  }, [examType]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getStudentsBySemester(selectedSubject.semester);
      setStudents(data.students || []);
      
      // Initialize marks
      const initialMarks = {};
      (data.students || []).forEach(student => {
        initialMarks[student._id] = '';
      });
      setMarks(initialMarks);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkChange = (studentId, value) => {
    setMarks(prev => ({
      ...prev,
      [studentId]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedSubject?._id) {
        toast.warning('Please select a subject first.');
        return;
      }

      // Validate marks before submission
      const currentCategory = examTypes.find(e => e.value === examType);
      const maxMark = currentCategory?.max || 30;
      const marksToSubmit = {};
      let hasMarks = false;
      
      for (const [studentId, markValue] of Object.entries(marks)) {
        if (markValue === '') {
          continue;
        }
        
        hasMarks = true;
        const mark = parseFloat(markValue);
        if (isNaN(mark) || mark < 0 || mark > maxMark) {
          toast.error(`${currentCategory?.label || examType} must be between 0 and ${maxMark}.`);
          return;
        }
        
        marksToSubmit[studentId] = mark;
      }

      if (!hasMarks) {
        toast.warning('Please enter marks for at least one student before submitting.');
        return;
      }

      setSubmitting(true);
      await updateMarks(selectedSubject._id, selectedSubject.semester, examType, marksToSubmit);
      
      toast.success(`${currentCategory?.label || examType} marks updated successfully for ${Object.keys(marksToSubmit).length} student(s)!`);
      
      // Reset marks
      const initialMarks = {};
      students.forEach(student => {
        initialMarks[student._id] = '';
      });
      setMarks(initialMarks);
      
    } catch (error) {
      console.error('Error submitting marks:', error);
      toast.error(error.response?.data?.message || 'Failed to submit marks. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const hasMarksEntered = Object.values(marks).some(val => val !== "");

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Upload Student Marks</h2>
        {selectedSubject && (
          <p className="text-xs text-slate-500 mt-1">
            Subject: <span className="font-semibold text-slate-700">{selectedSubject.subjectName}</span> • Semester <span className="font-semibold text-slate-700">{selectedSubject.semester}</span>
          </p>
        )}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Display */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <BookOpen size={14} className="text-slate-400" />
            <span>Active Subject</span>
          </label>
          <p className="text-sm font-semibold text-slate-900">
            {selectedSubject?.subjectName || "No subject selected"}
          </p>
        </div>

        {/* Exam Type Selector */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-1">
          <label className="block text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <Award size={14} className="text-slate-400" />
            <span>Exam Category</span>
          </label>
          <select
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium text-slate-900 focus:border-blue-600 outline-none cursor-pointer"
          >
            {examTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Marks Entry Table Container */}
      {!selectedSubject ? (
        <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl">
          <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs font-semibold text-slate-600">Please select a subject above to upload marks</p>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <SkeletonTable rows={5} cols={3} />
          ) : students.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-8">No students in this semester</p>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200/80">
                    <tr>
                      <th className="px-6 py-3.5">Student Name</th>
                      <th className="px-6 py-3.5">Enrollment ID</th>
                      <th className="px-6 py-3.5 text-center">
                        {examTypes.find(e => e.value === examType)?.label}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedStudents.map(student => (
                      <tr key={student._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-6 py-4 font-semibold text-slate-900">{student.fullName}</td>
                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{student.enrollmentId}</td>
                        <td className="px-6 py-4 text-center">
                          <input
                            type="number"
                            min="0"
                            max={examTypes.find(e => e.value === examType)?.max}
                            value={marks[student._id] || ''}
                            onChange={(e) => handleMarkChange(student._id, e.target.value)}
                            disabled={submitting}
                            className="w-24 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-center text-sm font-semibold text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
                            placeholder="0"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              <div className="px-5 py-3.5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/50">
                <div className="text-xs text-slate-500 font-medium">
                  {students.length === 0 ? (
                    <span>Showing 0 students</span>
                  ) : (
                    <span>
                      Showing <span className="font-semibold text-slate-700">{startIndex + 1}</span> to{" "}
                      <span className="font-semibold text-slate-700">
                        {Math.min(startIndex + 5, students.length)}
                      </span>{" "}
                      of <span className="font-semibold text-slate-700">{students.length}</span> students
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage <= 1 || totalPages === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`min-w-8 h-8 px-2 flex items-center justify-center text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          isActive
                            ? "bg-blue-600 text-white shadow-xs font-bold"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                        aria-label={`Page ${pageNum}`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage >= totalPages || totalPages === 0}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={!selectedSubject?._id || !hasMarksEntered || submitting}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all disabled:bg-slate-300 disabled:shadow-none disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting Marks...</span>
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  <span>Submit Evaluation Marks</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadMarks;
