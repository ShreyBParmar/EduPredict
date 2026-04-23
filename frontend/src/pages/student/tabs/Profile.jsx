import React from 'react'
import { useAuth } from '../../../context/authContext'

const Profile = ({ subjects }) => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {/* Student Profile Card */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 max-w-md">
        
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold shadow-lg">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
        </div>

        {/* Student Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Full Name */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Full Name</p>
            <p className="text-gray-800 text-lg font-bold">{user?.fullName || 'N/A'}</p>
          </div>

          {/* Email */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Email</p>
            <p className="text-gray-800 text-lg font-bold">{user?.email || 'N/A'}</p>
          </div>

          {/* Student ID */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Student ID</p>
            <p className="text-gray-800 text-lg font-bold">{user?.enrollmentId || 'N/A'}</p>
          </div>

          {/* Semester */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Semester</p>
            <p className="text-gray-800 text-lg font-bold">{user?.semester || 'N/A'}</p>
          </div>

          {/* Role */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Role</p>
            <p className="text-gray-800 text-lg font-bold capitalize">{user?.role || 'N/A'}</p>
          </div>

          {/* Department */}
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm font-semibold uppercase">Department</p>
            <p className="text-gray-800 text-lg font-bold">Computer Science</p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Profile