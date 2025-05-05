"use client"
import { Users, Coffee, Utensils, Cookie, Moon } from "lucide-react"

const AttendanceTableHome = ({ attendanceToday, isLoading }) => {
  // Get meal icon
  const getMealIcon = (meal) => {
    switch (meal) {
      case "breakfast":
        return <Coffee className="inline h-4 w-4 mr-1" />
      case "lunch":
        return <Utensils className="inline h-4 w-4 mr-1" />
      case "snack":
        return <Cookie className="inline h-4 w-4 mr-1" />
      case "dinner":
        return <Moon className="inline h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  // Debug log to check what data is coming in
  console.log("AttendanceTable received data:", attendanceToday)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Today's Attendance
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
              <th className="py-3 px-6 text-center cursor-pointer" >
                <div className="flex items-center justify-center">{getMealIcon("breakfast")} Breakfast</div>
              </th>
              <th className="py-3 px-6 text-center cursor-pointer" >
                <div className="flex items-center justify-center">{getMealIcon("lunch")} Lunch</div>
              </th>
              <th className="py-3 px-6 text-center cursor-pointer" >
                <div className="flex items-center justify-center">{getMealIcon("snack")} Snack</div>
              </th>
              <th className="py-3 px-6 text-center cursor-pointer" >
                <div className="flex items-center justify-center">{getMealIcon("dinner")} Dinner</div>
              </th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="py-4 text-center">
                  Loading...
                </td>
              </tr>
            ) : Array.isArray(attendanceToday) && attendanceToday.length > 0 ? (
              attendanceToday.map((row, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 text-center">
                    <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                      {row.breakfast || 0}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                      {row.lunch || 0}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">
                      {row.snack || 0}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-xs">
                      {row.dinner || 0}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="py-3 px-6 text-center">
                  No attendance data available
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceTableHome
