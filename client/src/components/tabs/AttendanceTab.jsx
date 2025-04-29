"use client"

import { useState, useEffect, useCallback, memo } from "react"
import axios from "axios"
import studentAxios from "../../api/studentAxios"
import { User, Clipboard, Download } from "lucide-react"

// Memoized student details component
const StudentDetails = memo(({ studentDetails }) => {
  if (!studentDetails) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-3">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <User className="mr-2" />
            Student Details
          </h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-lg font-semibold text-gray-800">{studentDetails.name}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Registration Number</h3>
              <p className="text-lg font-semibold text-gray-800">{studentDetails.reg_no}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-lg font-semibold text-gray-800">{studentDetails.email}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Registered On</h3>
              <p className="text-lg font-semibold text-gray-800">{studentDetails.registered_on}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500">Status</h3>
              <p
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  studentDetails.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}
              >
                {studentDetails.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Memoized attendance table component
const AttendanceTable = memo(({ attendanceData, totalAmount, downloadAttendanceCSV }) => {
  if (!attendanceData || attendanceData.length === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Clipboard className="mr-2" />
          Attendance History
        </h2>
        <button
          onClick={downloadAttendanceCSV}
          className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 flex items-center text-sm"
        >
          <Download className="mr-1 h-4 w-4" />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-600 text-sm">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-4 font-semibold">Breakfast</th>
              <th className="py-3 px-4 font-semibold">Lunch</th>
              <th className="py-3 px-4 font-semibold">Snack</th>
              <th className="py-3 px-4 font-semibold">Dinner</th>
              <th className="py-3 px-4 font-semibold text-right">Cost</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {attendanceData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-3 px-4 font-medium">{row.formatted_date}</td>
                <td className="py-3 px-4">
                  {row.breakfast_time ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {row.breakfast_time}
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {row.lunch_time ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {row.lunch_time}
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {row.snack_time ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      {row.snack_time}
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {row.dinner_time ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      {row.dinner_time}
                    </span>
                  ) : (
                    <span className="text-gray-400">--</span>
                  )}
                </td>
                <td className="py-3 px-4 text-right font-medium">₹{row.total_cost}</td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan="5" className="py-3 px-4 text-right font-bold">
                Total Amount
              </td>
              <td className="py-3 px-4 text-right font-bold text-blue-700">₹{totalAmount}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
})

function AttendanceTab({ student, getStudentFromStorage, setStudent }) {
  const [attendanceData, setAttendanceData] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [studentDetails, setStudentDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fetch attendance data
  const fetchAttendance = useCallback(async () => {
    setLoading(true)
    setError("")

    // Get student data from context or try localStorage
    const currentStudent = student || getStudentFromStorage()

    if (!currentStudent?.reg_no || !currentStudent?.block_no) {
      setError("Student information not found. Please log in again.")
      setLoading(false)
      return
    }

    try {
      const response = await studentAxios.get(
        `/student-stat/${currentStudent.reg_no}/${currentStudent.block_no}`,
      )

      // Process attendance data to fix date formatting
      const processedAttendance = response.data.attendance.map((item) => ({
        ...item,
        // Ensure proper date formatting
        formatted_date: new Date(item.date).toLocaleDateString(),
        // Clean up total cost by removing any non-numeric characters except decimal point
        total_cost: Number.parseFloat(item.total_cost.toString().replace(/[^\d.]/g, "")).toFixed(2),
      }))

      setAttendanceData(processedAttendance)

      // Clean up total amount by removing any non-numeric characters
      const cleanTotalAmount = Number.parseFloat(response.data.totalAmount.toString().replace(/[^\d.]/g, "")).toFixed(2)
      setTotalAmount(cleanTotalAmount)

      // Handle different response structures
      const studentData = response.data.studentDetails || response.data.studentwithoutpassword
      setStudentDetails(studentData)

      // If we got student data but it's not in context, update context
      if (studentData && !student) {
        setStudent({
          reg_no: studentData.reg_no,
          block_no: studentData.block_no,
          name: studentData.name,
          email: studentData.email,
        })

        // Also save to localStorage for future use
        localStorage.setItem(
          "student-data",
          JSON.stringify({
            reg_no: studentData.reg_no,
            block_no: studentData.block_no,
            name: studentData.name,
            email: studentData.email,
          }),
        )
      }
    } catch (err) {
      console.error("Error fetching attendance:", err)
      setError(err.response?.data?.error || "Error fetching data.")
    } finally {
      setLoading(false)
    }
  }, [student, getStudentFromStorage, setStudent])

  // Load attendance data when tab becomes active
  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  // Download attendance as CSV
  const downloadAttendanceCSV = useCallback(() => {
    if (!attendanceData || attendanceData.length === 0) return

    const headers = ["Date", "Breakfast", "Lunch", "Snack", "Dinner", "Total Cost"]
    const csvRows = []
    csvRows.push(headers.join(","))

    for (const row of attendanceData) {
      const values = [
        row.formatted_date,
        row.breakfast_time || "--",
        row.lunch_time || "--",
        row.snack_time || "--",
        row.dinner_time || "--",
        `₹${row.total_cost}`,
      ]
      csvRows.push(values.join(","))
    }

    csvRows.push(`Total Amount,,,,,₹${totalAmount}`)

    const csvString = csvRows.join("\n")
    const blob = new Blob([csvString], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.setAttribute("hidden", "")
    a.setAttribute("href", url)
    a.setAttribute("download", `attendance_${studentDetails?.reg_no || "data"}.csv`)
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [attendanceData, totalAmount, studentDetails])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading student data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
        {error}
        <button
          onClick={fetchAttendance}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 block mx-auto"
        >
          Try Again
        </button>
      </div>
    )
  }

  if (!studentDetails && !attendanceData.length) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Student Data</h3>
        <button
          onClick={fetchAttendance}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Fetch Student Data
        </button>
      </div>
    )
  }

  return (
    <div>
      <StudentDetails studentDetails={studentDetails} />
      <AttendanceTable
        attendanceData={attendanceData}
        totalAmount={totalAmount}
        downloadAttendanceCSV={downloadAttendanceCSV}
      />
    </div>
  )
}

export default AttendanceTab
