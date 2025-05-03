"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, Coffee, Utensils, Clock, Moon, TrendingUp, TrendingDown, Minus } from "lucide-react"
import TableShimmer from "./TableShimmer"

const AttendanceTableStat = ({ data, isLoading, error }) => {
  const [sortConfig, setSortConfig] = useState({ key: "formatted_date", direction: "descending" })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const sortedData = getSortedData(data)
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  // Calculate meal trends (increase/decrease from previous day)
  const calculateTrend = (index, mealType) => {
    // Get the actual index in the original data array
    const dataIndex = indexOfFirstItem + index

    // If this is the first item or there's no previous item, return null
    if (dataIndex >= sortedData.length - 1) return "neutral"

    const currentCount = sortedData[dataIndex][`${mealType}_count`]
    const previousCount = sortedData[dataIndex + 1][`${mealType}_count`]

    if (currentCount > previousCount) return "up"
    if (currentCount < previousCount) return "down"
    return "neutral"
  }

  // Function to render trend indicator
  const renderTrendIndicator = (trend) => {
    if (trend === "up") return <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />
    if (trend === "down") return <TrendingDown className="inline h-3 w-3 ml-1 text-red-600" />
    return <Minus className="inline h-3 w-3 ml-1 text-gray-400" />
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

  // Pagination controls
  const renderPagination = () => {
    return (
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedData.length)} of {sortedData.length}{" "}
          entries
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

  if (isLoading) {
    return <TableShimmer rows={7} columns={5} />
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative m-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> Failed to load attendance data. Please try again.</span>
      </div>
    )
  }

  return (
    <>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
            <th className="py-3 px-6 text-left cursor-pointer" onClick={() => requestSort("formatted_date")}>
              <div className="flex items-center">
                Date
                {sortConfig.key === "formatted_date" &&
                  (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("breakfast_count")}>
              <div className="flex items-center justify-center">
                {getMealIcon("breakfast")} Breakfast
                {sortConfig.key === "breakfast_count" &&
                  (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("lunch_count")}>
              <div className="flex items-center justify-center">
                {getMealIcon("lunch")} Lunch
                {sortConfig.key === "lunch_count" &&
                  (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("snack_count")}>
              <div className="flex items-center justify-center">
                {getMealIcon("snack")} Snack
                {sortConfig.key === "snack_count" &&
                  (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
            <th className="py-3 px-6 text-center cursor-pointer" onClick={() => requestSort("dinner_count")}>
              <div className="flex items-center justify-center">
                {getMealIcon("dinner")} Dinner
                {sortConfig.key === "dinner_count" &&
                  (sortConfig.direction === "ascending" ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
              </div>
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm">
          {currentItems.length > 0 ? (
            currentItems.map((row, index) => (
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
            ))
          ) : (
            <tr>
              <td colSpan={5} className="py-4 text-center text-gray-500">
                No attendance data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {sortedData.length > itemsPerPage && renderPagination()}
    </>
  )
}

export default AttendanceTableStat
