import React from 'react'
import { useAuth } from '../context/authContext.jsx'

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome {user?.fullName || 'Faculty'}
      </h1>
      {user?.role === 'faculty' && user?.facultyId && (
        <div className="text-sm text-gray-600">ID: {user.facultyId}</div>
      )}
    </div>
  )
}

export default FacultyDashboard