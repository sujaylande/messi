

"use client"

import { useState, useRef, lazy, Suspense } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Menu, X, Home, Calendar, Users, Bell } from "lucide-react"
import managerAxios from "../api/managerAxios"
import TableShimmer from "./TableShimmer"
import NavStat from "./NavStat"

// Lazy loaded components
const AttendanceTable = lazy(() => import("./AttendanceTableStat"))
const StudentList = lazy(() => import("./StudentList"))

const MessStatistics = () => {
  const [filter, setFilter] = useState("inactive")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Refs for maintaining scroll position
  const studentListRef = useRef(null)
  const queryClient = useQueryClient()

  // React Query for mess statistics data with improved caching
  const {
    data: messData = [],
    isLoading: messLoading,
    error: messError,
  } = useQuery({
    queryKey: ["mess-statistics"],
    queryFn: async () => {
      const { data } = await managerAxios.get("/mess-stat")
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Handle filter change with scroll position preservation
  const handleFilterChange = (newFilter) => {
    // Save current scroll position
    const scrollPosition = studentListRef.current?.getBoundingClientRect().top || 0
    const windowScroll = window.scrollY

    // Change filter
    setFilter(newFilter)

    // Restore scroll position after a short delay to allow rendering
    setTimeout(() => {
      if (studentListRef.current) {
        window.scrollTo({
          top: windowScroll + studentListRef.current.getBoundingClientRect().top - scrollPosition,
          behavior: "instant",
        })
      }
    }, 10)
  }

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}

    <NavStat/>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mess Statistics</h1>
            <p className="text-sm text-gray-500">{today}</p>
          </div>
        </div>

        {/* Student Attendance Section */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users className="mr-2" />
              Student Attendance
            </h2>
          </div>

          <div className="overflow-x-auto">
            <Suspense fallback={<TableShimmer rows={7} columns={5} />}>
              <AttendanceTable data={messData} isLoading={messLoading} error={messError} />
            </Suspense>
          </div>
        </div>

        {/* Student List Section */}
        <div ref={studentListRef} className="bg-white rounded-lg shadow-md overflow-hidden">
          <Suspense fallback={<TableShimmer rows={10} columns={3} />}>
              <StudentList filter={filter} onFilterChange={handleFilterChange} />
            </Suspense>
          </div>
        </div>
    </div>
  )
}

export default MessStatistics
