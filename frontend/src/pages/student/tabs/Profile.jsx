import React from 'react';
import { useAuth } from '../../../context/authContext';
import { User, BookOpen, ShieldCheck, Award } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  const getInitial = () => {
    return user?.fullName?.charAt(0).toUpperCase() || 'S';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-md p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <User size={240} />
        </div>
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          {/* Avatar Badge */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white text-blue-600 flex items-center justify-center text-4xl font-bold shadow-lg shrink-0">
            {getInitial()}
          </div>

          {/* Header Info */}
          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{user?.fullName || 'Student Name'}</h1>
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full w-fit mx-auto sm:mx-0">
                Active Student
              </span>
            </div>
            <p className="text-blue-100 text-sm">{user?.email || 'N/A'}</p>

            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <span className="bg-blue-500/40 border border-blue-400/30 px-3 py-1 rounded-lg text-xs font-semibold">
                Enrollment: {user?.enrollmentId || 'N/A'}
              </span>
              <span className="bg-blue-500/40 border border-blue-400/30 px-3 py-1 rounded-lg text-xs font-semibold">
                Semester {user?.semester || 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Academic Info Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <User className="w-5 h-5 text-blue-600" />
              <span>Personal Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{user?.fullName || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</p>
                <p className="text-sm font-semibold text-slate-900 mt-1 break-all">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Academic Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrollment ID</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{user?.enrollmentId || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Semester</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">Semester {user?.semester || 'N/A'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Department</p>
                <p className="text-sm font-semibold text-slate-900 mt-1">{user?.department || 'Computer Science'}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account Status</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 mt-1">
                  <ShieldCheck size={14} /> Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Portal Summary</span>
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">User Role</span>
                <span className="text-xs font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{user?.role || 'Student'}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">Semester</span>
                <span className="text-xs font-bold text-slate-900">{user?.semester ? `Sem ${user.semester}` : 'N/A'}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-semibold text-slate-600">Verification</span>
                <span className="text-xs font-bold text-emerald-600">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;