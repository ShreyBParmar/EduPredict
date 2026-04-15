import React, { useState } from 'react'
import { useAuth } from '../../context/authContext';
import FacultyHeader from './FacultyHeader';
import SubjectSelector from './SubjectSelector';
import FacultyGraph from './FacultyGraph';
import { SubjectProvider } from '../../context/subjectContext';

const FacultyDashboard = () => {

  return (
    <div>
      <FacultyHeader />
      <SubjectProvider>
        <SubjectSelector />
        <FacultyGraph />
      </SubjectProvider>
    </div>

    
  )
}

export default FacultyDashboard 