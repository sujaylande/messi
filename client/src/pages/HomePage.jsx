
// "use client"

// import React, { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { useQuery, useQueryClient } from "@tanstack/react-query"
// import {
//   ScanLine,
//   UserPlus,
//   Users,
//   Coffee,
//   Utensils,
//   Cookie,
//   Moon,
//   TrendingUp,
//   TrendingDown,
//   Minus,
//   ChevronUp,
//   ChevronDown,
// } from "lucide-react"
// import Navbar from "../components/Navbar"
// import managerAxios from "../api/managerAxios"

// // Lazy loaded components
// const LazyAttendanceTable = React.lazy(() => import("../components/AttendanceTableHome"))
// const LazyForecastTable = React.lazy(() => import("../components/ForecastTable"))

// const HomePage = () => {
//   const [sortConfig, setSortConfig] = useState({
//     key: "formatted_date",
//     direction: "descending",
//   })
//   const navigate = useNavigate()
//   const queryClient = useQueryClient()

//   // React Query for data fetching with caching
//   const { data: manager } = useQuery({
//     queryKey: ["manager"],
//     queryFn: async () => {
//       const storedData = localStorage.getItem("student-data")
//       return storedData ? JSON.parse(storedData) : null
//     },
//   })

//   const { data: studentStats = { active: 0, inactive: 0 }, isLoading: statsLoading } = useQuery({
//     queryKey: ["studentStats"],
//     queryFn: async () => {
//       const { data } = await managerAxios.get("/active-student")
//       return data
//     },
//     staleTime: 2 * 60 * 1000, // 5 minutes
//   })

//   const { data: attendanceToday = [], isLoading: attendanceLoading } = useQuery({
//     queryKey: ["attendanceToday"],
//     queryFn: async () => {
//       const { data } = await managerAxios.get("/todays-attendance")
//       return data
//     },
//     staleTime: 2 * 60 * 1000, // 30 minutes
//   })

//   console.log("att", attendanceToday)

//   const { data: forecast = {}, isLoading: forecastLoading } = useQuery({
//     queryKey: ["forecast"],
//     queryFn: async () => {
//       const { data } = await managerAxios.get("/attendance-probability")
//       return data
//     },
//     staleTime: 60 * 60 * 1000, // 1 hour
//   })

//   const handleLogout = async () => {
//     try {
//       await managerAxios.get("/logout", {}, { withCredentials: true })
//       queryClient.clear() // Clear all queries from cache
//       localStorage.removeItem("student-data")
//       navigate("/manager/login")
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data?.message || error.message)
//       alert("Logout failed. Please try again.")
//     }
//   }

//   // Data for pie chart
//   const pieData = [
//     { name: "Active", value: studentStats.active, color: "#10b981" },
//     { name: "Inactive", value: studentStats.inactive, color: "#ef4444" },
//   ]

//   const totalStudents = studentStats.active + studentStats.inactive

//   // Sort function for tables
//   const requestSort = (key) => {
//     let direction = "ascending"
//     if (sortConfig.key === key && sortConfig.direction === "ascending") {
//       direction = "descending"
//     }
//     setSortConfig({ key, direction })
//   }

//   const getSortedData = (data) => {
//     if (!data || data.length === 0) return []

//     const sortableData = [...data]
//     sortableData.sort((a, b) => {
//       if (a[sortConfig.key] < b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? -1 : 1
//       }
//       if (a[sortConfig.key] > b[sortConfig.key]) {
//         return sortConfig.direction === "ascending" ? 1 : -1
//       }
//       return 0
//     })
//     return sortableData
//   }

//   // Calculate trend for attendance
//   const calculateTrend = (index, mealType) => {
//     if (index >= attendanceToday.length - 1) return "neutral"

//     const current = attendanceToday[index][`${mealType}_count`]
//     const previous = attendanceToday[index + 1][`${mealType}_count`]

//     if (current > previous) return "up"
//     if (current < previous) return "down"
//     return "neutral"
//   }

//   // Render trend indicator
//   const renderTrendIndicator = (trend) => {
//     if (trend === "up") return <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />
//     if (trend === "down") return <TrendingDown className="inline h-3 w-3 ml-1 text-red-600" />
//     return <Minus className="inline h-3 w-3 ml-1 text-gray-400" />
//   }

//   // Get meal icon
//   const getMealIcon = (meal) => {
//     switch (meal) {
//       case "breakfast":
//         return <Coffee className="inline h-4 w-4 mr-1" />
//       case "lunch":
//         return <Utensils className="inline h-4 w-4 mr-1" />
//       case "snack":
//         return <Cookie className="inline h-4 w-4 mr-1" />
//       case "dinner":
//         return <Moon className="inline h-4 w-4 mr-1" />
//       default:
//         return null
//     }
//   }

//   const isLoading = statsLoading || attendanceLoading || forecastLoading

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar manager={manager} onLogout={handleLogout} />

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Actions and Stats */}
//           <div className="space-y-8">
//             {/* Action Buttons */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
//               <Link
//                 to="/scan"
//                 className="py-6 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transition-all duration-200"
//               >
//                 <ScanLine className="mr-2 h-5 w-5" />
//                 Scan a Student
//               </Link>

//               <Link
//                 to="/register"
//                 className="py-6 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-200"
//               >
//                 <UserPlus className="mr-2 h-5 w-5" />
//                 Register a Student
//               </Link>
//             </div>

//             {/* Student Stats Card with Pie Chart */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800">
//                 <h3 className="text-lg font-medium text-white flex items-center">
//                   <Users className="mr-2 h-5 w-5" />
//                   Student Statistics
//                 </h3>
//               </div>

//               <div className="px-4 py-5 sm:p-6">
//                 {isLoading ? (
//                   <div className="flex justify-center items-center h-64">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                   </div>
//                 ) : (
//                   <>
//                     <div className="">
          
//                     </div>
//                     <div className="mt-2 grid grid-cols-2 gap-4 text-center">
//                       <div className="bg-green-50 p-3 rounded-lg">
//                         <p className="text-sm text-gray-500">Active</p>
//                         <p className="text-2xl font-bold text-green-600">{studentStats.active}</p>
//                       </div>
//                       <div className="bg-red-50 p-3 rounded-lg">
//                         <p className="text-sm text-gray-500">Inactive</p>
//                         <p className="text-2xl font-bold text-red-600">{studentStats.inactive}</p>
//                       </div>
//                       <div className="col-span-2 bg-blue-50 p-3 rounded-lg">
//                         <p className="text-sm text-gray-500">Total Students</p>
//                         <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
//                       </div>
//                     </div>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Tables */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* Today's Attendance */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
//                 <h2 className="text-xl font-bold text-white flex items-center">
//                   <Users className="mr-2 h-5 w-5" />
//                   Today's Attendance
//                 </h2>
//               </div>
//               <div className="overflow-x-auto">
//                 <React.Suspense
//                   fallback={
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                     </div>
//                   }
//                 >
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
//                         <th
//                           className="py-3 px-6 text-left cursor-pointer"
//                           onClick={() => requestSort("formatted_date")}
//                         >
//                           <div className="flex items-center">
//                             Date
//                             {sortConfig.key === "formatted_date" &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               ))}
//                           </div>
//                         </th>
//                         <th
//                           className="py-3 px-6 text-center cursor-pointer"
//                           onClick={() => requestSort("breakfast_count")}
//                         >
//                           <div className="flex items-center justify-center">
//                             {getMealIcon("breakfast")} Breakfast
//                             {sortConfig.key === "breakfast_count" &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               ))}
//                           </div>
//                         </th>
//                         <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("lunch_count")}>
//                           <div className="flex items-center justify-center">
//                             {getMealIcon("lunch")} Lunch
//                             {sortConfig.key === "lunch_count" &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               ))}
//                           </div>
//                         </th>
//                         <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("snack_count")}>
//                           <div className="flex items-center justify-center">
//                             {getMealIcon("snack")} Snack
//                             {sortConfig.key === "snack_count" &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               ))}
//                           </div>
//                         </th>
//                         <th
//                           className="py-3 px-6 text-center cursor-pointer"
//                           onClick={() => requestSort("dinner_count")}
//                         >
//                           <div className="flex items-center justify-center">
//                             {getMealIcon("dinner")} Dinner
//                             {sortConfig.key === "dinner_count" &&
//                               (sortConfig.direction === "ascending" ? (
//                                 <ChevronUp size={16} />
//                               ) : (
//                                 <ChevronDown size={16} />
//                               ))}
//                           </div>
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-600 text-sm">
//                       {isLoading ? (
//                         <tr>
//                           <td colSpan={5} className="py-4 text-center">
//                             Loading...
//                           </td>
//                         </tr>
//                       ) : attendanceToday.length > 0 ? (
//                         getSortedData(attendanceToday).map((row, index) => (
//                           <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                             <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{row.formatted_date}</td>
//                             <td className="py-3 px-6 text-center">
//                               <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
//                                 {row.breakfast_count} {renderTrendIndicator(calculateTrend(index, "breakfast"))}
//                               </span>
//                             </td>
//                             <td className="py-3 px-6 text-center">
//                               <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
//                                 {row.lunch_count} {renderTrendIndicator(calculateTrend(index, "lunch"))}
//                               </span>
//                             </td>
//                             <td className="py-3 px-6 text-center">
//                               <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">
//                                 {row.snack_count} {renderTrendIndicator(calculateTrend(index, "snack"))}
//                               </span>
//                             </td>
//                             <td className="py-3 px-6 text-center">
//                               <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-xs">
//                                 {row.dinner_count} {renderTrendIndicator(calculateTrend(index, "dinner"))}
//                               </span>
//                             </td>
//                           </tr>
//                         ))
//                       ) : (
//                         <tr>
//                           <td colSpan={5} className="py-4 text-center">
//                             No attendance data available for today
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </React.Suspense>
//               </div>
//             </div>

//             {/* Predicted Attendance */}
//             <div className="bg-white rounded-lg shadow-md overflow-hidden">
//               <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600">
//                 <h2 className="text-xl font-bold text-white flex items-center">
//                   <TrendingUp className="mr-2 h-5 w-5" />
//                   Predicted Attendance
//                 </h2>
//               </div>
//               <div className="overflow-x-auto">
//                 <React.Suspense
//                   fallback={
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//                     </div>
//                   }
//                 >
//                   {isLoading ? (
//                     <div className="flex justify-center items-center h-32">
//                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//                     </div>
//                   ) : Object.keys(forecast).length > 0 ? (
//                     <table className="w-full">
//                       <thead>
//                         <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
//                           <th className="py-3 px-6 text-left">Meal</th>
//                           {getNext7Days().map((day, index) => (
//                             <th key={index} className="py-3 px-6 text-center">
//                               {day}
//                             </th>
//                           ))}
//                         </tr>
//                       </thead>
//                       <tbody className="text-gray-600 text-sm">
//                         {Object.entries(forecast).map(([meal, values], index) => (
//                           <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
//                             <td className="py-3 px-6 text-left font-medium flex items-center">
//                               {getMealIcon(meal.toLowerCase())} {meal}
//                             </td>
//                             {values.slice(0, 7).map((value, idx) => (
//                               <td key={idx} className="py-3 px-6 text-center">
//                                 <span
//                                   className={`py-1 px-3 rounded-full text-xs ${
//                                     meal === "Breakfast"
//                                       ? "bg-blue-100 text-blue-800"
//                                       : meal === "Lunch"
//                                         ? "bg-green-100 text-green-800"
//                                         : meal === "Snack"
//                                           ? "bg-yellow-100 text-yellow-800"
//                                           : "bg-purple-100 text-purple-800"
//                                   }`}
//                                 >
//                                   {Math.round(value) > 0 ? Math.round(value) : 0}
//                                 </span>
//                               </td>
//                             ))}
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   ) : (
//                     <div className="py-4 text-center text-gray-500">No forecast data available</div>
//                   )}
//                 </React.Suspense>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Helper function to get next 7 days
// const getNext7Days = () => {
//   const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   const todayIndex = new Date().getDay()

//   return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)].slice(0, 7)
// }

// export default HomePage

"use client"

import { useState, lazy, Suspense, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import managerAxios from "../api/managerAxios"
import Navbar from "../components/Navbar"

// Import regular components
import ActionButtons from "../components/ActionButtons"
import StudentStats from "../components/StudentStats"

// Lazy loaded components
const LazyAttendanceTable = lazy(() => import("../components/AttendanceTableHome"))
const LazyForecastTable = lazy(() => import("../components/ForecastTable"))

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex justify-center items-center h-32">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)

const HomePage = () => {
  const [sortConfig, setSortConfig] = useState({
    key: "formatted_date",
    direction: "descending",
  })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // React Query for data fetching with caching
  const { data: manager } = useQuery({
    queryKey: ["manager"],
    queryFn: async () => {
      const storedData = localStorage.getItem("student-data")
      return storedData ? JSON.parse(storedData) : null
    },
  })

  const { data: studentStats = { active: 0, inactive: 0 }, isLoading: statsLoading } = useQuery({
    queryKey: ["studentStats"],
    queryFn: async () => {
      const { data } = await managerAxios.get("/active-student")
      return data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  const {
    data: attendanceToday = [],
    isLoading: attendanceLoading,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ["attendanceToday"],
    queryFn: async () => {
      try {
        const { data } = await managerAxios.get("/todays-attendance")
        console.log("Fetched attendance data:", data)
        return data || []
      } catch (error) {
        console.error("Error fetching attendance:", error)
        return []
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Force refetch on mount to ensure we have the latest data
  useEffect(() => {
    refetchAttendance()
  }, [refetchAttendance])

  const { data: forecast = {}, isLoading: forecastLoading } = useQuery({
    queryKey: ["forecast"],
    queryFn: async () => {
      const { data } = await managerAxios.get("/attendance-probability")
      return data
    },
    staleTime: 60 * 60 * 1000, // 1 hour
  })

  const handleLogout = async () => {
    try {
      await managerAxios.get("/logout", {}, { withCredentials: true })
      queryClient.clear() // Clear all queries from cache
      localStorage.removeItem("student-data")
      navigate("/manager/login")
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message)
      alert("Logout failed. Please try again.")
    }
  }

  // Sort function for tables
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  const isLoading = statsLoading || attendanceLoading || forecastLoading

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar manager={manager} onLogout={handleLogout} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Actions and Stats */}
          <div className="space-y-8">
            {/* Action Buttons */}
            <ActionButtons />

            {/* Student Stats Card */}
            <StudentStats studentStats={studentStats} isLoading={statsLoading} />
          </div>

          {/* Right Column - Tables */}
          <div className="lg:col-span-2 space-y-8">
            {/* Today's Attendance */}
            <Suspense fallback={<LoadingFallback />}>
              <LazyAttendanceTable
                attendanceToday={attendanceToday}
                isLoading={attendanceLoading}
              />
            </Suspense>

            {/* Predicted Attendance */}
            <Suspense fallback={<LoadingFallback />}>
              <LazyForecastTable forecast={forecast} isLoading={forecastLoading} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
