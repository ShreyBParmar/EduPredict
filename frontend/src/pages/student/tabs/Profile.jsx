import React from 'react'
import { useAuth } from '../../../context/authContext'

const Profile = ({ subjects }) => {
  const { user } = useAuth();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section with Avatar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-8 mb-6 text-white">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="w-32 h-32 rounded-full bg-white text-blue-600 flex items-center justify-center text-5xl font-bold shadow-lg flex-shrink-0">
            {user?.fullName?.charAt(0) || 'S'}
          </div>

          {/* Header Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{user?.fullName || 'Student Name'}</h1>
            <p className="text-blue-100 text-lg mb-3">{user?.email || 'N/A'}</p>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">Student</span>
              <span className="bg-blue-500 px-4 py-2 rounded-full text-sm font-semibold">Semester {user?.semester || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Personal & Academic Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Personal Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Full Name</p>
                <p className="text-gray-800 text-lg font-semibold">{user?.fullName || 'N/A'}</p>
              </div>
              <div className="border-l-4 border-blue-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Email</p>
                <p className="text-gray-800 text-lg font-semibold break-all">{user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Academic Details Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17.25c0 5.25 3.07 9.386 7.252 11.391.5.23.972-.217.972-.72v-5.294c0-.745.662-1.358 1.498-1.393.805-.03 1.498.562 1.498 1.393v5.294c0 .503.472.95.972.72 4.182-2.005 7.252-6.142 7.252-11.39 0-6.253-4.5-11-10-11z" />
              </svg>
              Academic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Enrollment ID</p>
                <p className="text-gray-800 text-lg font-semibold">{user?.enrollmentId || 'N/A'}</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Semester</p>
                <p className="text-gray-800 text-lg font-semibold">{user?.semester || 'N/A'}</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Department</p>
                <p className="text-gray-800 text-lg font-semibold">{user?.department || 'Computer Science'}</p>
              </div>
              <div className="border-l-4 border-green-600 pl-4 py-2">
                <p className="text-gray-500 text-sm font-semibold uppercase">Status</p>
                <p className="text-gray-800 text-lg font-semibold">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">Active</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Quick Stats */}
        <div className="space-y-6">
          
          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Role</span>
                <span className="text-orange-600 font-bold capitalize">{user?.role || 'Student'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Current Semester</span>
                <span className="text-blue-600 font-bold">{user?.semester || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Account Status</span>
                <span className="text-green-600 font-bold">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile