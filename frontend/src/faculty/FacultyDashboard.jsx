import React from 'react'
import { useAuth } from '../context/authContext.jsx'

const FacultyDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold">
        Welcome {user?.fullName || 'Faculty'}
      </h1>
    </div>
  )
}

export default FacultyDashboard