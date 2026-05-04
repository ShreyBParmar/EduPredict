import React, { useEffect, useState } from "react";
import { getFacultyProfile } from "../../services/facultyApi";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";
import faculty_logo from "/src/assets/faculty_logo.png"
const FacultyHeader = () => {
{/*
  const [faculty, setFaculty] = useState(null);

  useEffect(() => {
    {/*
    const fetchProfile = async () => {
      const data = await getFacultyProfile();
      setFaculty(data);
    };

    fetchProfile();
     

     const data=fetch("/faculty_credential")


  }, []);

  if (!faculty) return null;
  
  */}
//const { user } = useAuth();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>

      <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
        
        {/* Left Section: Profile + Name */}
        <div className="flex items-center gap-4">
          
          {/* Profile Icon */}
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg overflow-hidden">
           <img src={faculty_logo} className="w-full h-full object-contain p-1"/>
          </div>
      
          {/* Name + Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.fullName || ''}
            </h2>
            <p className="text-sm text-gray-500">
              {user?.facultyId} • Computer Science
            </p>
          </div>
      
        </div>
      
        {/* Right Section: Logout */}
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700 transition hover:text-white"
        >
          Logout
        </button>
      
      </div>

    </div>
  );
};

export default FacultyHeader;