import React from 'react'
import { useAuth } from '../context/authContext.jsx'
import Student_profile from '../assets/134954835116345278834481.svg'

const Header = () => {
  const { user } = useAuth();

  return (
    <div>
        <div className="relative flex items-center">
           {/* <img src={logo} className='absolute left-0 w-20 h-20 object-contain'/> */}
            <div className="mt-15 bg-blue-600 w-14 h-14 rounded-2xl absolute left-0 flex items-center justify-center">
              <img src={Student_profile}/>
            </div>

            <h2 className="text-xl font-semibold text-center pr-3">
              Welcome {user?.fullName || ''}
            </h2>
            {user?.role === 'student' && user?.enrollmentId && (
              <div className="text-xl font-semibold text-center pr-3">
                ID: {user.enrollmentId}
              </div>
            )}
        </div>
    </div>
  )
}

export default Header