
import React from 'react'
import { useAuth } from '../../context/authContext';
import FacultyHeader from './FacultyHeader';
import SubjectSelector from './SubjectSelector';

const FacultyDashboard = () => {
  return (
    <div>
      <FacultyHeader />
      <SubjectSelector />
    </div>

    
  )
}

export default FacultyDashboard
