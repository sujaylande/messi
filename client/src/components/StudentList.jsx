"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { ChevronDown, ChevronUp, Search } from "lucide-react"
import managerAxios from "../api/managerAxios"
import TableShimmer from "./TableShimmer"

const StudentList = ({ filter, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortConfig, setSortConfig] = useState({ key: "name", direction: "ascending" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [filter])

  // Function to handle sorting
  const requestSort = (key) => {
    let direction = "ascending"
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // React Query for students data with proper caching
  // Using separate query keys for active and inactive students
  const {
    data: studentsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["students", filter], // Separate cache key for each filter value
    queryFn: async () => {
      const { data } = await managerAxios.get(`/students-status-list?status=${filter}`)
      return data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - longer stale time to reduce API calls
    gcTime: 30 * 60 * 1000, // 30 minutes - keep in cache longer
  })

  // Function to get sorted data
  const getSortedData = (items) => {
    if (!items || !Array.isArray(items) || items.length === 0) return []

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

  // Function to get filtered students
  const getFilteredStudents = () => {
    if (!studentsData || !Array.isArray(studentsData)) return []

    return studentsData.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (student.reg_no && student.reg_no.toString().includes(searchTerm)),
    )
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const filteredStudents = getFilteredStudents()
  const sortedStudents = getSortedData(filteredStudents)
  const currentStudents = sortedStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  // Pagination controls
  const renderPagination = () => {
    return (
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredStudents.length)} of{" "}
          {filteredStudents.length} entries
        </div>
        <div className="flex space-x-1">
          <button
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
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
                onClick={() => setCurrentPage(pageNum)}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === pageNum ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {pageNum}
              </button>
            )
          })}
          <button
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 flex flex-col md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-white flex items-center">Student List</h2>
        <div className="mt-3 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-8 pr-4 py-1 rounded-md border-0 bg-white focus:ring-2 focus:ring-blue-300 text-sm"
            />
            <Search className="absolute left-2 top-1.5 h-4 w-4 text-gray-400" />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onFilterChange("active")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === "active" ? "bg-white text-blue-700" : "bg-blue-400 text-white hover:bg-blue-300"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => onFilterChange("inactive")}
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
        {isLoading ? (
          <TableShimmer rows={10} columns={3} />
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> Failed to load student data. Please try again.</span>
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("reg_no")}>
                    <div className="flex items-center">
                      Mess Reg No
                      {sortConfig.key === "reg_no" &&
                        (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </div>
                  </th>
                  <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("name")}>
                    <div className="flex items-center">
                      Name
                      {sortConfig.key === "name" &&
                        (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
                    </div>
                  </th>
                  <th className="py-3 px-6 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <tr key={student.reg_no} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
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

            {/* Pagination */}
            {filteredStudents.length > itemsPerPage && renderPagination()}
          </>
        )}
      </div>
    </>
  )
}

export default StudentList
