import React from 'react';
import FacultyHeader from './FacultyHeader';
import SubjectSelector from './SubjectSelector';
import FacultyGraph from './FacultyGraph';
import { SubjectProvider } from '../../context/subjectContext';

const FacultyDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      <FacultyHeader />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <SubjectProvider>
          <SubjectSelector />
          <FacultyGraph />
        </SubjectProvider>
      </main>
    </div>
  );
};

export default FacultyDashboard;