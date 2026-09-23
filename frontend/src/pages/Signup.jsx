import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, UserCheck, BookOpen, ArrowRight } from 'lucide-react';

const Signup = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleNext = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select the role!!!');
      return;
    }

    if (role === 'Student') {
      navigate('/signup/student');
    } else if (role === 'Faculty') {
      navigate('/signup/faculty');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-full max-w-md space-y-6">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-500/30 text-white">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create an Account</h1>
          <p className="text-sm text-slate-500">Select your account type to get started with EduPredict</p>
        </div>

        {/* Role Selection Options */}
        <form onSubmit={handleNext} className="space-y-4">
          <div className="space-y-3">
            {/* Student Option */}
            <label
              htmlFor="student"
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                role === 'Student'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="student"
                  name="role"
                  value="student"
                  checked={role === 'Student'}
                  onChange={() => setRole('Student')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Student</p>
                  <p className="text-xs text-slate-500">Access performance & risk insights</p>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${role === 'Student' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                <UserCheck className="w-5 h-5" />
              </div>
            </label>

            {/* Faculty Option */}
            <label
              htmlFor="faculty"
              className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                role === 'Faculty'
                  ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="faculty"
                  name="role"
                  value="faculty"
                  checked={role === 'Faculty'}
                  onChange={() => setRole('Faculty')}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Faculty Member</p>
                  <p className="text-xs text-slate-500">Manage courses, marks & risk analysis</p>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${role === 'Faculty' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                <BookOpen className="w-5 h-5" />
              </div>
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Already registered?{' '}
          <a href="/login" className="font-semibold text-blue-600 hover:underline">
            Sign In
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;