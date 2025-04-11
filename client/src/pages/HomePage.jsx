"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { ScanLine, UserPlus } from "lucide-react"

const HomePage = () => {
  const [studentStats, setStudentStats] = useState({ active: 0, inactive: 0 })
  const [attendanceToday, setAttendanceToday] = useState([])
  const [forecast, setForecast] = useState({})
  const [loading, setLoading] = useState(true)

  const fetchStudentStats = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/manager/active-student")
      setStudentStats(data)
    } catch (error) {
      console.error("Error fetching student stats:", error)
    }
  }

  const fetchAttendanceToday = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/manager/todays-attendance")
      setAttendanceToday(data)
    } catch (error) {
      console.error("Error fetching today's attendance:", error)
    }
  }

  const fetchForecast = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/manager/attendance-probability")
      setForecast(data)
    } catch (error) {
      console.error("Error fetching forecast:", error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await Promise.all([fetchStudentStats(), fetchAttendanceToday(), fetchForecast()])
      setLoading(false)
    }

    fetchData()
  }, [])

  const getNext7Days = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const todayIndex = new Date().getDay()

    return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)].slice(0, 7)
  }

  const renderForecastTable = () => {
    const meals = ["Breakfast", "Lunch", "Snack", "Dinner"]

    return meals.map((meal) => (
      <tr key={meal}>
        <td className="px-4 py-2 border-b font-medium">{meal}</td>
        {forecast[meal]?.slice(0, 7).map((value, index) => (
          <td key={index} className="px-4 py-2 border-b text-center">
            {Math.round(value) > 0 ? Math.round(value) : 0}
          </td>
        ))}
      </tr>
    ))
  }

  // Data for pie chart
  const pieData = [
    { name: "Active", value: studentStats.active, color: "#10b981" },
    { name: "Inactive", value: studentStats.inactive, color: "#ef4444" },
  ]

  const totalStudents = studentStats.active + studentStats.inactive

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/mess-stat"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Mess Statistics
              </Link>
              {/* <Link
                to="/student-stat"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Student Statistics
              </Link> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions and Stats */}
          <div className="space-y-8">
            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                to="/scan"
                className="w-full py-6 text-lg flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md"
              >
                <ScanLine className="mr-2 h-5 w-5" />
                Scan a Student
              </Link>

              <Link
                to="/register"
                className="w-full py-6 text-lg flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md"
              >
                <UserPlus className="mr-2 h-5 w-5" />
                Register a Student
              </Link>
            </div>

            {/* Student Stats Card with Pie Chart */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Student Statistics</h3>
              </div>

              <div className="px-4 py-5 sm:p-6">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Active</p>
                    <p className="text-2xl font-bold text-green-600">{studentStats.active}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-red-600">{studentStats.inactive}</p>
                  </div>
                  <div className="col-span-2 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Right Column - Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Attendance */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Today's Attendance</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : attendanceToday.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Breakfast
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Lunch
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Snack
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Dinner
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendanceToday.map((row, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap">{row.breakfast}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{row.lunch}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{row.snack}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{row.dinner}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No attendance data available for today</p>
                )}
              </div>
            </div>

            {/* Predicted Attendance */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">Predicted Attendance for next seven days</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : Object.keys(forecast).length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meal
                          </th>
                          {getNext7Days().map((day, index) => (
                            <th
                              key={index}
                              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {day}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">{renderForecastTable()}</tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No forecast data available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage

