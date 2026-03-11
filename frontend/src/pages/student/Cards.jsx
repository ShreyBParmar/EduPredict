import React from 'react'

const Cards = () => {
  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 mt-6 ">
            <div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm  hover:shadow-xl/30">
  
  <div className="flex justify-between items-center ">
    <h3 className="text-gray-600 text-sm">Attendance</h3>
    <span className="text-blue-500 text-xl">📅</span>
  </div>

  <h2 className="text-2xl font-semibold text-gray-900">
    76.7%
  </h2>

  <div className="w-full bg-gray-200 h-2 rounded-full">
    <div className="bg-blue-600 h-2 rounded-full w-[76%]"></div>
  </div>

</div>
<div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm  hover:shadow-xl/30">
  
  <div className="flex justify-between items-center">
    <h3 className="text-gray-600 text-sm">Average Marks</h3>
    <span className="text-green-500 text-xl">🎖</span>
  </div>

  <h2 className="text-2xl font-semibold text-gray-900">
    72.7%
  </h2>

  <div className="w-full bg-gray-200 h-2 rounded-full">
    <div className="bg-green-500 h-2 rounded-full w-[72%]"></div>
  </div>

</div>
<div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl/30">

  <div className="flex justify-between items-center">
    <h3 className="text-gray-600 text-sm">Predicted Grade</h3>
    <span className="text-purple-500 text-xl">📈</span>
  </div>

  <h2 className="text-3xl font-semibold text-gray-900">
    B
  </h2>

</div>
<div className="bg-white border rounded-xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-xl/30">

  <div className="flex justify-between items-center">
    <h3 className="text-gray-600 text-sm">Risk Level</h3>
    <span className="text-yellow-500 text-xl">⚠</span>
  </div>

  <span className="bg-yellow-100 text-yellow-700 text-sm font-medium px-3 py-1 rounded-full w-fit">
    MEDIUM
  </span>

</div>
        </div>
    </div>
  )
}

export default Cards