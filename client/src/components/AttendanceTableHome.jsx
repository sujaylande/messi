"use client"
import { ChevronUp, ChevronDown, Coffee, Utensils, Cookie, Moon, TrendingUp, TrendingDown, Minus } from "lucide-react"

const AttendanceTable = ({ data, isLoading, sortConfig, requestSort, calculateTrend }) => {
  console.log("a table", data)
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

  // Render trend indicator
  const renderTrendIndicator = (trend) => {
    if (trend === "up") return <TrendingUp className="inline h-3 w-3 ml-1 text-green-600" />
    if (trend === "down") return <TrendingDown className="inline h-3 w-3 ml-1 text-red-600" />
    return <Minus className="inline h-3 w-3 ml-1 text-gray-400" />
  }

  // Sort function for tables
  const getSortedData = (data) => {
    if (!data || data.length === 0) return []

    const sortableData = [...data]
    sortableData.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
    return sortableData
  }

  return (
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
        {isLoading ? (
          <tr>
            <td colSpan={5} className="py-4 text-center">
              Loading...
            </td>
          </tr>
        ) : data.length > 0 ? (
          getSortedData(data).map((row, index) => (
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
            <td colSpan={5} className="py-4 text-center">
              No attendance data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default AttendanceTable
