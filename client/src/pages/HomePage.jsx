"use client";

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { ScanLine, UserPlus } from "lucide-react";
import { ManagerDataContext } from "../context/ManagerContext";
import managerAxios from '../api/managerAxios'


const HomePage = () => {
  const [studentStats, setStudentStats] = useState({ active: 0, inactive: 0 });
  const [attendanceToday, setAttendanceToday] = useState([]);
  const [forecast, setForecast] = useState({});
  const [loading, setLoading] = useState(true);
  const { manager, setManager } = useContext(ManagerDataContext);
  const navigate = useNavigate();

  console.log("home", manager);

  const fetchStudentStats = async () => {
    try {
      const { data } = await managerAxios.get(
        "/active-student"
      );
      setStudentStats(data);
    } catch (error) {
      console.error("Error fetching student stats:", error);
    }
  };

  const fetchAttendanceToday = async () => {
    try {
      const { data } = await managerAxios.get(
        "/todays-attendance"
      );
      setAttendanceToday(data);
    } catch (error) {
      console.error("Error fetching today's attendance:", error);
    }
  };

  const fetchForecast = async () => {
    try {
      const { data } = await managerAxios.get(
        "/attendance-probability"
      );
      setForecast(data);
    } catch (error) {
      console.error("Error fetching forecast:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStudentStats(),
        fetchAttendanceToday(),
        fetchForecast(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, []);

  const getNext7Days = () => {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayIndex = new Date().getDay();

    return [
      ...daysOfWeek.slice(todayIndex),
      ...daysOfWeek.slice(0, todayIndex),
    ].slice(0, 7);
  };

  const renderForecastTable = () => {
    const meals = ["Breakfast", "Lunch", "Snack", "Dinner"];

    return meals.map((meal) => (
      <tr key={meal}>
        <td className="px-4 py-2 border-b font-medium">{meal}</td>
        {forecast[meal]?.slice(0, 7).map((value, index) => (
          <td key={index} className="px-4 py-2 border-b text-center">
            {Math.round(value) > 0 ? Math.round(value) : 0}
          </td>
        ))}
      </tr>
    ));
  };

  // Data for pie chart
  const pieData = [
    { name: "Active", value: studentStats.active, color: "#10b981" },
    { name: "Inactive", value: studentStats.inactive, color: "#ef4444" },
  ];

  const totalStudents = studentStats.active + studentStats.inactive;

  const handleLogout = async () => {
    try {
      await managerAxios.get(
        "/logout",
        {},
        {
          withCredentials: true,
        }
      );

      // Clear student context
      setManager(null);

      // Optional: remove any localStorage data related to student
      localStorage.removeItem("student-data");

      // Redirect to login/home
      navigate("/manager/login");
    } catch (error) {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 mb-2 mt-2">
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-bold text-gray-900">
                {manager?.mess_name}
              </h1>
              <div className="text-sm text-gray-700 mb-1">
                <p>Block Number: {manager?.block_no}</p>
                <p>Manager Name: {manager?.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/mess-stat"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Mess Statistics
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
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
                <h3 className="text-lg font-medium text-gray-900">
                  Student Statistics
                </h3>
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
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
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
                    <p className="text-2xl font-bold text-green-600">
                      {studentStats.active}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Inactive</p>
                    <p className="text-2xl font-bold text-red-600">
                      {studentStats.inactive}
                    </p>
                  </div>
                  <div className="col-span-2 bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalStudents}
                    </p>
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
                <h3 className="text-lg font-medium text-gray-900">
                  Today's Attendance
                </h3>
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
                            <td className="px-4 py-2 whitespace-nowrap">
                              {row.breakfast}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {row.lunch}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {row.snack}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              {row.dinner}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No attendance data available for today
                  </p>
                )}
              </div>
            </div>

            {/* Predicted Attendance */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-4 py-5 sm:px-6 border-b">
                <h3 className="text-lg font-medium text-gray-900">
                  Predicted Attendance for next seven days
                </h3>
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
                      <tbody className="bg-white divide-y divide-gray-200">
                        {renderForecastTable()}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">
                    No forecast data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;


// "use client"

// import { useContext, useEffect, useState, useMemo, lazy, Suspense } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
// import { ScanLine, UserPlus, LogOut, Coffee, Utensils, Cookie, Moon, BarChart } from "lucide-react"
// import { ManagerDataContext } from "../context/ManagerContext"
// import managerAxios from "../api/managerAxios"

// // Lazy load the MessStatistics component

// const HomePage = () => {
//   const [studentStats, setStudentStats] = useState({ active: 0, inactive: 0 })
//   const [attendanceToday, setAttendanceToday] = useState([])
//   const [forecast, setForecast] = useState({})
//   const [loading, setLoading] = useState(true)
//   const [showStats, setShowStats] = useState(false)
//   const { manager, setManager } = useContext(ManagerDataContext)
//   const navigate = useNavigate()

//   const fetchStudentStats = async () => {
//     try {
//       const { data } = await managerAxios.get("/active-student")
//       setStudentStats(data)
//     } catch (error) {
//       console.error("Error fetching student stats:", error)
//     }
//   }

//   const fetchAttendanceToday = async () => {
//     try {
//       const { data } = await managerAxios.get("/todays-attendance")
//       setAttendanceToday(data)
//     } catch (error) {
//       console.error("Error fetching today's attendance:", error)
//     }
//   }

//   // Fetch forecast in the background
//   useEffect(() => {
//     const fetchForecastInBackground = async () => {
//       try {
//         const { data } = await managerAxios.get("/attendance-probability")
//         setForecast(data)
//       } catch (error) {
//         console.error("Error fetching forecast:", error)
//       }
//     }

//     // Don't block the UI while fetching forecast
//     setTimeout(() => {
//       fetchForecastInBackground()
//     }, 100)
//   }, [])

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true)
//       await Promise.all([fetchStudentStats(), fetchAttendanceToday()])
//       setLoading(false)
//     }

//     fetchData()
//   }, [])

//   // Memoize the next 7 days calculation to avoid recalculating on every render
//   const next7Days = useMemo(() => {
//     const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//     const todayIndex = new Date().getDay()

//     return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)].slice(0, 7)
//   }, [])

//   // Memoize the forecast table to avoid recalculating on every render
//   const forecastTable = useMemo(() => {
//     const meals = ["Breakfast", "Lunch", "Snack", "Dinner"]
//     const mealIcons = {
//       Breakfast: <Coffee className="h-4 w-4 inline mr-1 text-amber-600" />,
//       Lunch: <Utensils className="h-4 w-4 inline mr-1 text-green-600" />,
//       Snack: <Cookie className="h-4 w-4 inline mr-1 text-orange-600" />,
//       Dinner: <Moon className="h-4 w-4 inline mr-1 text-indigo-600" />,
//     }

//     return meals.map((meal) => (
//       <tr key={meal}>
//         <td className="px-4 py-3 border-b font-medium flex items-center">
//           {mealIcons[meal]}
//           {meal}
//         </td>
//         {forecast[meal]?.slice(0, 7).map((value, index) => (
//           <td key={index} className="px-4 py-3 border-b text-center">
//             {Math.round(value) > 0 ? Math.round(value) : 0}
//           </td>
//         ))}
//       </tr>
//     ))
//   }, [forecast])

//   // Memoize pie chart data to avoid recalculating on every render
//   const pieData = useMemo(
//     () => [
//       { name: "Active", value: studentStats.active, color: "#10b981" },
//       { name: "Inactive", value: studentStats.inactive, color: "#ef4444" },
//     ],
//     [studentStats.active, studentStats.inactive],
//   )

//   const totalStudents = studentStats.active + studentStats.inactive

//   const handleLogout = async () => {
//     try {
//       await managerAxios.get("/logout", {}, { withCredentials: true })
//       setManager(null)
//       localStorage.removeItem("student-data")
//       navigate("/manager/login")
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data?.message || error.message)
//       alert("Logout failed. Please try again.")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Enhanced Navigation Bar */}
//       <nav className="bg-white shadow-md border-b sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex items-center">
//               <div className="flex-shrink-0 flex items-center">
//                 <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl mr-3">
//                   {manager?.mess_name?.charAt(0) || "M"}
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900">{manager?.mess_name}</h1>
//                   <div className="text-xs text-gray-600">
//                     <span className="inline-block mr-2">Block: {manager?.block_no}</span>
//                     <span className="inline-block">Manager: {manager?.name}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex items-center space-x-4">
              
//             <Link
//                 to="/mess-stat"
//                 className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
//               >
//                 Mess Statistics
//               </Link>

//               <button
//                 onClick={handleLogout}
//                 className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
//               >
//                 <LogOut className="h-4 w-4 mr-1" />
//                 Logout
//               </button>

              
//             </div>
            
//           </div>
//         </div>
//       </nav>

//       {/* Lazy-loaded Mess Statistics
//       {showStats && (
//         <Suspense
//           fallback={
//             <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//             </div>
//           }
//         >
//           <MessStatistics />
//         </Suspense>
//       )} */}

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Left Column - Actions and Stats */}
//           <div className="space-y-6">
//             {/* Action Buttons */}
//             <div className="grid grid-cols-1 gap-4">
//               <Link
//                 to="/scan"
//                 className="py-5 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
//               >
//                 <ScanLine className="mr-2 h-5 w-5" />
//                 Scan a Student
//               </Link>

//               <Link
//                 to="/register"
//                 className="py-5 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg shadow-md transition-all transform hover:scale-[1.02]"
//               >
//                 <UserPlus className="mr-2 h-5 w-5" />
//                 Register a Student
//               </Link>
//             </div>

//             {/* Student Stats Card with Pie Chart */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
//                 <h3 className="text-lg font-medium text-gray-900">Student Statistics</h3>
//               </div>

//               <div className="px-4 py-5">
//                 <div className="h-56">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={pieData}
//                         cx="50%"
//                         cy="50%"
//                         innerRadius={60}
//                         outerRadius={80}
//                         paddingAngle={5}
//                         dataKey="value"
//                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
//                       >
//                         {pieData.map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={entry.color} />
//                         ))}
//                       </Pie>
//                       <Legend />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//                 <div className="mt-4 grid grid-cols-2 gap-4 text-center">
//                   <div className="bg-green-50 p-3 rounded-lg shadow-sm">
//                     <p className="text-sm text-gray-500">Active</p>
//                     <p className="text-2xl font-bold text-green-600">{studentStats.active}</p>
//                   </div>
//                   <div className="bg-red-50 p-3 rounded-lg shadow-sm">
//                     <p className="text-sm text-gray-500">Inactive</p>
//                     <p className="text-2xl font-bold text-red-600">{studentStats.inactive}</p>
//                   </div>
//                   <div className="col-span-2 bg-blue-50 p-3 rounded-lg shadow-sm">
//                     <p className="text-sm text-gray-500">Total Students</p>
//                     <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Tables */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Today's Attendance */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
//                 <h3 className="text-lg font-medium text-gray-900">Today's Attendance</h3>
//               </div>
//               <div className="px-4 py-5">
//                 {loading ? (
//                   <div className="flex justify-center items-center h-32">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : attendanceToday.length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr className="bg-gray-100">
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
//                             <Coffee className="h-4 w-4 mr-1 text-amber-600" />
//                             Breakfast
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
//                             <Utensils className="h-4 w-4 mr-1 text-green-600" />
//                             Lunch
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
//                             <Cookie className="h-4 w-4 mr-1 text-orange-600" />
//                             Snack
//                           </th>
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
//                             <Moon className="h-4 w-4 mr-1 text-indigo-600" />
//                             Dinner
//                           </th>
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">
//                         {attendanceToday.map((row, index) => (
//                           <tr key={index} className="hover:bg-gray-50">
//                             <td className="px-4 py-3 whitespace-nowrap">{row.breakfast}</td>
//                             <td className="px-4 py-3 whitespace-nowrap">{row.lunch}</td>
//                             <td className="px-4 py-3 whitespace-nowrap">{row.snack}</td>
//                             <td className="px-4 py-3 whitespace-nowrap">{row.dinner}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No attendance data available for today</p>
//                 )}
//               </div>
//             </div>

//             {/* Predicted Attendance */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-4 py-4 border-b bg-gradient-to-r from-gray-50 to-gray-100">
//                 <h3 className="text-lg font-medium text-gray-900">Predicted Attendance for Next Seven Days</h3>
//               </div>
//               <div className="px-4 py-5">
//                 {loading ? (
//                   <div className="flex justify-center items-center h-32">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : Object.keys(forecast).length > 0 ? (
//                   <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                       <thead>
//                         <tr className="bg-gray-100">
//                           <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Meal
//                           </th>
//                           {next7Days.map((day, index) => (
//                             <th
//                               key={index}
//                               className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                             >
//                               {day}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="bg-white divide-y divide-gray-200">{forecastTable}</tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <p className="text-center text-gray-500 py-4">No forecast data available</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default HomePage
