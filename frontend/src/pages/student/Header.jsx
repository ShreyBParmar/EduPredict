
import { useAuth } from '../../context/authContext';
import Student_profile from '/src/assets/134954835116345278834481.svg'

const Header = () => {
  const { user } = useAuth();

  return (
    <div>
     <div className="bg-white shadow-sm border-b px-6 py-4 flex items-center justify-between">
  
  {/* Left Section: Profile + Name */}
  <div className="flex items-center gap-4">
    
    {/* Profile Icon */}
    <div className="w-15 h-15 flex items-center justify-center rounded-full bg-blue-600 text-white font-semibold text-lg">
     <img src={Student_profile}/>
    </div>

    {/* Name + Info */}
    <div>
      <h2 className="text-lg font-semibold text-gray-800">
        {user?.fullName || ''}
      </h2>
      <p className="text-sm text-gray-500">
        {user.enrollmentId} • Computer Science
      </p>
    </div>

  </div>

  {/* Right Section: Logout */}
  <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
  Logout
</button>

</div>
    </div>
  )
}

export default Header
