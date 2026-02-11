import { useState } from 'react'
import logo from '../assets/logo.png'
import student_logo from '../assets/student_logo.png'
import faculty_logo from '../assets/faculty_logo.png'
import {useNavigate} from 'react-router-dom'

const Signup = () => {
  const [role,setRole]=useState('') 
  const navigate=useNavigate()

  const handleNext=(e)=>{
    e.preventDefault();
    if(!role){
      alert('Please select the role!!!')
      return
    }
    
      if(role==="Student"){
        navigate('/signup/student')
      }
      else if(role==="Faculty"){
        navigate('/signup/faculty')
      }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-6 rounded-lg shadow-xl/70 grid gap-4 w-80 boder">

        <div className="relative flex items-center justify-center">
          <img src={logo} className='absolute left-0 w-20 h-20 object-contain'/>
          <h2 className="text-xl font-semibold text-center pr-3">Signup</h2>
        </div>

        <label
          htmlFor="student"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            id="student"
            name="role"
            value="student"
            onChange={()=>setRole('Student')}
          />
          Are you a Student
          <img src={student_logo} className=' w-10 h-10 '/>
        </label>

        <label
          htmlFor="faculty"
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="radio"
            id="faculty"
            name="role"
            value="faculty"
             onChange={()=>setRole('Faculty')}
          />
          Are you a Faculty
          <img src={faculty_logo} className='w-10 h-10'/>
        </label>

        <button 
        className="mt-0 bg-blue-700 text-white py-2 rounded hover:bg-blue-500 hover:text-black"
        onClick={handleNext}>
          Next
        </button>
      </form>
    </div>

  )
}

export default Signup;  