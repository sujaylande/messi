// import React, { useState } from "react";
// import axios from "axios";

// const StudentMessAttendance = () => {
//   const [regNo, setRegNo] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [actionRegNo, setActionRegNo] = useState("");
//   const [removeRegNo, setRemoveRegNo] = useState("");

//   const fetchAttendance = async () => {
//     if (!regNo) {
//       setError("Please enter a valid registration number.");
//       return;
//     }
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/manager/student-stat/${regNo}`
//       );
//       setAttendanceData(response.data.attendance);
//       setTotalAmount(response.data.totalAmount);
//       setStudentDetails(response.data.studentDetails);
//       setRegNo("");
//     } catch (err) {
//       setError("Error fetching data.");
//       alert(err.response?.data?.error || "Unknown error");
//       setRegNo("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateStatus = async (status) => {
//     if (!actionRegNo) {
//       setError("Please enter a valid registration number for the action.");
//       return;
//     }

//     try {
//       const response = await axios.post(
//         "http://localhost:5000/api/manager/student-status",
//         {
//           reg_no: actionRegNo,
//           status: status,
//         }
//       );

//       if (response.data.message) {
//         alert(response.data.message);
//       } else if (response.data.error) {
//         alert(response.data.error);
//       }
//       setActionRegNo("");
//     } catch (err) {
//       setError("Error updating student status.");
//       alert(err.response?.data?.error || "Unknown error");
//       setActionRegNo("");
//     }
//   };

//   const removeStudent = async () => {
//     if (!removeRegNo) {
//       setError("Please enter a valid registration number for the action.");
//       return;
//     }

//     try {
//       const response = await axios.delete(
//         `http://localhost:5000/api/manager/remove-student/${removeRegNo}`
//       );
//       if (response.status === 404) {
//         alert("Student not found");
//       } else if (response.status === 200) {
//         alert("Student removed successfully");
//       }
//       setRemoveRegNo("");
//     } catch (err) {
//       setError("Error removing student.");
//       alert(err.response?.data?.error || "Unknown error");
//       setRemoveRegNo("");
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       {/* <h2 className="text-xl font-bold mb-4">Student Statistics </h2> */}

//       <div className="bg-white shadow-md rounded p-4 mt-4">
//         <h3 className="text-lg font-bold mb-2">Update student status</h3>
//         <input
//           type="text"
//           placeholder="Enter Mess Reg No"
//           value={actionRegNo}
//           onChange={(e) => setActionRegNo(e.target.value)}
//           className="border border-gray-300 rounded p-2 mb-2 w-full"
//         />
//         <div className="flex gap-2">
//           <button
//             onClick={() => updateStatus("active")}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
//           >
//             Make Active
//           </button>
//           <button
//             onClick={() => updateStatus("inactive")}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Make Inactive
//           </button>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded p-4 mt-4">
//         <h3 className="text-lg font-bold mb-2">Remove student from the mess</h3>
//         <input
//           type="text"
//           placeholder="Enter Mess Reg No"
//           value={removeRegNo}
//           onChange={(e) => setRemoveRegNo(e.target.value)}
//           className="border border-gray-300 rounded p-2 mb-2 w-full"
//         />
//         <div className="flex gap-2">
//           <button
//             onClick={() => removeStudent()}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Remove Student
//           </button>
//         </div>
//       </div>

//       <div className="bg-white shadow-md rounded p-4 mt-4">
//         <h3 className="text-lg font-bold mb-2">
//           Get student details and attendance
//         </h3>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             placeholder="Enter Student Mess Reg No"
//             value={regNo}
//             onChange={(e) => setRegNo(e.target.value)}
//             className="border border-gray-300 rounded p-2 flex-grow"
//           />
//           <button
//             onClick={fetchAttendance}
//             disabled={loading}
//             className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
//           >
//             {loading ? "Loading..." : "Fetch"}
//           </button>
//         </div>
//       </div>

//       {/* {error && <p className="text-red-500">{error}</p>} */}

//       {studentDetails && (
//         <div className="bg-white shadow-md rounded p-4 mb-4">
//           <h3 className="text-lg font-bold mb-2">Student Details</h3>
//           <p>
//             <strong>Name:</strong> {studentDetails.name}
//           </p>
//           <p>
//             <strong>Reg No:</strong> {studentDetails.reg_no}
//           </p>
//           <p>
//             <strong>Email:</strong> {studentDetails.email}
//           </p>
//           <p>
//             <strong>Registered_on:</strong> {studentDetails.registered_on}
//           </p>
//           <p>
//             <strong>Status:</strong> {studentDetails.status}
//           </p>
//         </div>
//       )}

//       {attendanceData?.length > 0 && (
//         <div className="bg-white shadow-md rounded p-4">
//           <table className="w-full border-collapse border border-gray-300">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border p-2">Date</th>
//                 <th className="border p-2">Breakfast</th>
//                 <th className="border p-2">Lunch</th>
//                 <th className="border p-2">Snack</th>
//                 <th className="border p-2">Dinner</th>
//                 <th className="border p-2">Total Cost</th>
//               </tr>
//             </thead>
//             <tbody>
//               {attendanceData.map((row, index) => (
//                 <tr key={index} className="text-center">
//                   <td className="border p-2">{row.formatted_date}</td>
//                   <td className="border p-2">{row.breakfast_time || "--"}</td>
//                   <td className="border p-2">{row.lunch_time || "--"}</td>
//                   <td className="border p-2">{row.snack_time || "--"}</td>
//                   <td className="border p-2">{row.dinner_time || "--"}</td>
//                   <td className="border p-2 font-bold">₹{row.total_cost}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <div className="text-right font-bold text-lg mt-4">
//             Total Amount: ₹{totalAmount}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default StudentMessAttendance;

"use client"

import { useState } from "react"
import axios from "axios"
import managerAxios from "../api/managerAxios"

const StudentMessAttendance = () => {
  const [regNo, setRegNo] = useState("")
  const [attendanceData, setAttendanceData] = useState([])
  const [totalAmount, setTotalAmount] = useState(0)
  const [studentDetails, setStudentDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [actionRegNo, setActionRegNo] = useState("")
  const [removeRegNo, setRemoveRegNo] = useState("")
  const [activeTab, setActiveTab] = useState("fetch") // "fetch", "update", "remove"

  const fetchAttendance = async () => {
    if (!regNo) {
      setError("Please enter a valid registration number.")
      return
    }
    setLoading(true)
    setError("")

    try {
      const response = await managerAxios.get(`/student-stat/${regNo}`)
      setAttendanceData(response.data.attendance)
      setTotalAmount(response.data.totalAmount)
      setStudentDetails(response.data.studentDetails)
      setRegNo("")
    } catch (err) {
      setError("Error fetching data.")
      alert(err.response?.data?.error || "Unknown error")
      setRegNo("")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (status) => {
    if (!actionRegNo) {
      setError("Please enter a valid registration number for the action.")
      return
    }

    try {
      const response = await managerAxios.post("/student-status", {
        reg_no: actionRegNo,
        status: status,
      })

      if (response.data.message) {
        alert(response.data.message)
      } else if (response.data.error) {
        alert(response.data.error)
      }
      setActionRegNo("")
    } catch (err) {
      setError("Error updating student status.")
      alert(err.response?.data?.error || "Unknown error")
      setActionRegNo("")
    }
  }

  const removeStudent = async () => {
    if (!removeRegNo) {
      setError("Please enter a valid registration number for the action.")
      return
    }

    try {
      const response = await managerAxios.delete(`/remove-student/${removeRegNo}`)
      if (response.status === 404) {
        alert("Student not found")
      } else if (response.status === 200) {
        alert("Student removed successfully")
      }
      setRemoveRegNo("")
    } catch (err) {
      setError("Error removing student.")
      alert(err.response?.data?.error || "Unknown error")
      setRemoveRegNo("")
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "update":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="bg-green-100 text-green-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </span>
              Update Student Status
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Mess Registration Number"
                  value={actionRegNo}
                  onChange={(e) => setActionRegNo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => updateStatus("active")}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg font-medium hover:from-green-600 hover:to-green-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Make Active
                </button>
                <button
                  onClick={() => updateStatus("inactive")}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Make Inactive
                </button>
              </div>
            </div>
          </div>
        )
      case "remove":
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="bg-red-100 text-red-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Remove Student from Mess
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Mess Registration Number"
                  value={removeRegNo}
                  onChange={(e) => setRemoveRegNo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              <button
                onClick={removeStudent}
                className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove Student
              </button>
            </div>
          </div>
        )
      default: // fetch
        return (
          <div className="bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Get Student Details and Attendance
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Enter Student Mess Registration Number"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              <button
                onClick={fetchAttendance}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg flex items-center justify-center transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                }`}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Fetch
                  </>
                )}
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Student Mess Management</h1>
          <p className="text-gray-600 mt-2">Track attendance, update status, and manage student records</p>
        </div>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("fetch")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "fetch"
                  ? "bg-blue-50 text-blue-600 border-b-2 border-blue-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clipRule="evenodd"
                  />
                </svg>
                Fetch Details
              </div>
            </button>
            <button
              onClick={() => setActiveTab("update")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "update"
                  ? "bg-green-50 text-green-600 border-b-2 border-green-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Status
              </div>
            </button>
            <button
              onClick={() => setActiveTab("remove")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "remove"
                  ? "bg-red-50 text-red-600 border-b-2 border-red-500"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Remove Student
              </div>
            </button>
          </div>

          <div className="p-6">{renderTabContent()}</div>
        </div>

        {studentDetails && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8 animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="bg-purple-100 text-purple-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </span>
              Student Details
            </h3>
            <div className="grid md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-800">{studentDetails.name}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registration Number</p>
                  <p className="font-medium text-gray-800">{studentDetails.reg_no}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-800">{studentDetails.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Registered On</p>
                  <p className="font-medium text-gray-800">{studentDetails.registered_on}</p>
                </div>
              </div>
              <div className="flex items-center md:col-span-2">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      studentDetails.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {studentDetails.status === "active" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {attendanceData?.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-hidden animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="bg-yellow-100 text-yellow-600 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Attendance Records
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Breakfast</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Lunch</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Snack</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b">Dinner</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b">Total Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((row, index) => (
                    <tr
                      key={index}
                      className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                    >
                      <td className="px-4 py-3 text-sm text-gray-800 border-b">{row.formatted_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-b">
                        {row.breakfast_time ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {row.breakfast_time}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-b">
                        {row.lunch_time ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {row.lunch_time}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-b">
                        {row.snack_time ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            {row.snack_time}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-800 border-b">
                        {row.dinner_time ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            {row.dinner_time}
                          </span>
                        ) : (
                          <span className="text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-800 border-b text-right">
                        ₹{row.total_cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50">
                    <td colSpan="5" className="px-4 py-3 text-right font-bold text-gray-700">
                      Total Amount:
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-lg text-green-600">₹{totalAmount}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudentMessAttendance
