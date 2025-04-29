"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios";
axios.defaults.withCredentials = true;
import managerAxios from '../api/managerAxios'


import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Home,
  Calendar,
  Users,
  Bell,
  Coffee,
  Utensils,
  Clock,
  Moon,
  Search,
  Download,
} from "lucide-react"

const MessStatistics = () => {
  const [data, setData] = useState([])
  const [students, setStudents] = useState([])
  const [filter, setFilter] = useState("inactive")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Function to get sorted data
  const getSortedData = (items) => {
    if (!sortConfig.key) return items

    return [...items].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Function to get sorted and filtered students
  const getFilteredStudents = () => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.reg_no.toString().includes(searchTerm),
    )
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const filteredStudents = getFilteredStudents()
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const fetchStudents = (status) => {
    setIsLoading(true)
  
    managerAxios
      .get(`/students-status-list?status=${status}`)
      .then((res) => {
        setStudents(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
        setError('Failed to load student data. Please try again.')
        setIsLoading(false)
      })
  }
  
  useEffect(() => {
    setIsLoading(true)
  
    managerAxios
      .get('/mess-stat')
      .then((res) => {
        setData(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Error fetching data:', err)
        setError('Failed to load mess statistics. Please try again.')
        setIsLoading(false)
      })
  
    fetchStudents(filter)
  }, [filter])


  // Calculate meal trends (increase/decrease from previous day)
  const calculateTrend = (index, mealType) => {
    if (index === 0 || !data[index - 1]) return null

    const currentCount = data[index][`${mealType}_count`]
    const previousCount = data[index - 1][`${mealType}_count`]

    if (currentCount > previousCount) return "up"
    if (currentCount < previousCount) return "down"
    return "same"
  }

  // // Function to export table data as CSV


  // Get today's date in a readable format
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Function to render trend indicator
  const renderTrendIndicator = (trend) => {
    if (trend === "up") {
      return <ChevronUp className="inline-block text-green-500" size={16} />
    } else if (trend === "down") {
      return <ChevronDown className="inline-block text-red-500" size={16} />
    }
    return null
  }

  // Function to get meal icon
  const getMealIcon = (mealType) => {
    switch (mealType) {
      case "breakfast":
        return <Coffee className="inline-block mr-1" size={16} />
      case "lunch":
        return <Utensils className="inline-block mr-1" size={16} />
      case "snack":
        return <Clock className="inline-block mr-1" size={16} />
      case "dinner":
        return <Moon className="inline-block mr-1" size={16} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Mess Management</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/student-stat"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Home className="mr-1 h-4 w-4" />
                Student Statistics
              </Link>
              <Link
                to="/menu"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Calendar className="mr-1 h-4 w-4" />
                Menu
              </Link>
              <Link
                to="/feedback"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Users className="mr-1 h-4 w-4" />
                Feedback
              </Link>
              <Link
                to="/notice-board"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Bell className="mr-1 h-4 w-4" />
                Notice Board
              </Link>
              {/* <Link
                to="/student-stat"
                className="flex items-center text-blue-700 bg-blue-50 px-3 py-2 rounded-md text-sm font-medium"
              >
                <Users className="mr-1 h-4 w-4" />
                Student Statistics
              </Link> */}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-blue-50 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/student-stat"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Home className="mr-2 h-5 w-5" />
                Student Statistics
              </Link>
              <Link
                to="/menu"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Menu
              </Link>
              <Link
                to="/feedback"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Users className="mr-2 h-5 w-5" />
                Feedback
              </Link>
              <Link
                to="/notice-board"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Bell className="mr-2 h-5 w-5" />
                Notice Board
              </Link>
              {/* <Link
                to="/student-stat"
                className="flex items-center text-blue-700 bg-blue-50 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Users className="mr-2 h-5 w-5" />
                Student Statistics
              </Link> */}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mess Statistics</h1>
            <p className="text-sm text-gray-500">{today}</p>
          </div>

        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <>
            {/* Student Attendance Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">

              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600">

                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="mr-2" />
                  Student Attendance
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                      <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("formatted_date")}>
                        <div className="flex items-center">
                          Date
                          {sortConfig.key === "formatted_date" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th
                        className="py-3 px-6 text-center cursor-pointer"
                        onClick={() => requestSort("breakfast_count")}
                      >
                        <div className="flex items-center justify-center">
                          {getMealIcon("breakfast")} Breakfast
                          {sortConfig.key === "breakfast_count" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("lunch_count")}>
                        <div className="flex items-center justify-center">
                          {getMealIcon("lunch")} Lunch
                          {sortConfig.key === "lunch_count" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("snack_count")}>
                        <div className="flex items-center justify-center">
                          {getMealIcon("snack")} Snack
                          {sortConfig.key === "snack_count" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("dinner_count")}>
                        <div className="flex items-center justify-center">
                          {getMealIcon("dinner")} Dinner
                          {sortConfig.key === "dinner_count" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {getSortedData(data).map((row, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{row.formatted_date}</td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                            {row.breakfast_count} {renderTrendIndicator(calculateTrend(index, "breakfast"))}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs">
                            {row.lunch_count} {renderTrendIndicator(calculateTrend(index, "lunch"))}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-yellow-100 text-yellow-800 py-1 px-3 rounded-full text-xs">
                            {row.snack_count} {renderTrendIndicator(calculateTrend(index, "snack"))}
                          </span>
                        </td>
                        <td className="py-3 px-6 text-center">
                          <span className="bg-purple-100 text-purple-800 py-1 px-3 rounded-full text-xs">
                            {row.dinner_count} {renderTrendIndicator(calculateTrend(index, "dinner"))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Student List Section */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">

              <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 flex flex-col md:flex-row md:items-center md:justify-between">
                
                <h2 className="text-xl font-bold text-white flex items-center">
                  <Users className="mr-2" />
                  Student List
                </h2>
                <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-4 py-1 rounded-md border-0 focus:ring-2 focus:ring-blue-300 text-sm"
                    />
                    <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setFilter("active")
                        setCurrentPage(1)
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filter === "active" ? "bg-white text-blue-700" : "bg-blue-400 text-white hover:bg-blue-300"
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => {
                        setFilter("inactive")
                        setCurrentPage(1)
                      }}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        filter === "inactive" ? "bg-white text-blue-700" : "bg-blue-400 text-white hover:bg-blue-300"
                      }`}
                    >
                      Inactive
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                      <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("reg_no")}>
                        <div className="flex items-center">
                          Mess Reg No
                          {sortConfig.key === "reg_no" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("name")}>
                        <div className="flex items-center">
                          Name
                          {sortConfig.key === "name" &&
                            (sortConfig.direction === "ascending" ? (
                              <ChevronUp size={16} />
                            ) : (
                              <ChevronDown size={16} />
                            ))}
                        </div>
                      </th>
                      <th className="py-3 px-6 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm">
                    {currentStudents.length > 0 ? (
                      currentStudents.map((student) => (
                        <tr
                          key={student.reg_no}
                          className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{student.reg_no}</td>
                          <td className="py-3 px-6 text-left">{student.name}</td>
                          <td className="py-3 px-6 text-center">
                            <span
                              className={`py-1 px-3 rounded-full text-xs ${
                                filter === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                              }`}
                            >
                              {filter === "active" ? "Active" : "Inactive"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-6 text-center text-gray-500">
                          {searchTerm ? "No students match your search" : "No students found"}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredStudents.length > itemsPerPage && (
                <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
                    {filteredStudents.length} entries
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Logic to show pages around current page
                      let pageNum
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => paginate(pageNum)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === pageNum
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default MessStatistics

