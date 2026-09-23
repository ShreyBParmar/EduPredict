import React from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import { GraduationCap, LogOut, BookOpen } from "lucide-react";

const FacultyHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitial = () => {
    if (user?.fullName) {
      return user.fullName.charAt(0).toUpperCase();
    }
    return 'F';
  };

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Left Section: Brand Logo & Faculty Profile */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 pr-4 border-r border-slate-200">
            <div className="bg-blue-600 p-2 rounded-xl text-white shadow-sm shadow-blue-500/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 text-base tracking-tight hidden sm:inline-block">
              EduPredict
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold text-base flex items-center justify-center shadow-xs">
              {getInitial()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-900 leading-none">
                  {user?.fullName || 'Faculty Member'}
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-purple-50 text-purple-700 rounded-full border border-purple-100 uppercase">
                  Faculty
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <span>{user?.facultyId ? `ID: ${user.facultyId}` : 'Faculty Portal'}</span>
                <span>•</span>
                <span className="text-slate-600 font-medium">Computer Science</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section: Logout Button */}
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 rounded-xl transition-all cursor-pointer"
        >
          <LogOut size={15} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default FacultyHeader;