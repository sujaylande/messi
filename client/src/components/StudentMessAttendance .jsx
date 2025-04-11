import React, { useState } from "react";
import axios from "axios";

const StudentMessAttendance = () => {
  const [regNo, setRegNo] = useState("");
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [actionRegNo, setActionRegNo] = useState("");
  const [removeRegNo, setRemoveRegNo] = useState("");

  const fetchAttendance = async () => {
    if (!regNo) {
      setError("Please enter a valid registration number.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:5000/api/manager/student-stat/${regNo}`
      );
      setAttendanceData(response.data.attendance);
      setTotalAmount(response.data.totalAmount);
      setStudentDetails(response.data.studentDetails);
      setRegNo("");
    } catch (err) {
      setError("Error fetching data.");
      alert(err.response?.data?.error || "Unknown error");
      setRegNo("");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    if (!actionRegNo) {
      setError("Please enter a valid registration number for the action.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/manager/student-status",
        {
          reg_no: actionRegNo,
          status: status,
        }
      );

      if (response.data.message) {
        alert(response.data.message);
      } else if (response.data.error) {
        alert(response.data.error);
      }
      setActionRegNo("");
    } catch (err) {
      setError("Error updating student status.");
      alert(err.response?.data?.error || "Unknown error");
      setActionRegNo("");
    }
  };

  const removeStudent = async () => {
    if (!removeRegNo) {
      setError("Please enter a valid registration number for the action.");
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:5000/api/manager/remove-student/${removeRegNo}`
      );
      if (response.status === 404) {
        alert("Student not found");
      } else if (response.status === 200) {
        alert("Student removed successfully");
      }
      setRemoveRegNo("");
    } catch (err) {
      setError("Error removing student.");
      alert(err.response?.data?.error || "Unknown error");
      setRemoveRegNo("");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* <h2 className="text-xl font-bold mb-4">Student Statistics </h2> */}

      <div className="bg-white shadow-md rounded p-4 mt-4">
        <h3 className="text-lg font-bold mb-2">Update student status</h3>
        <input
          type="text"
          placeholder="Enter Mess Reg No"
          value={actionRegNo}
          onChange={(e) => setActionRegNo(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-2 w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={() => updateStatus("active")}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Make Active
          </button>
          <button
            onClick={() => updateStatus("inactive")}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Make Inactive
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-4 mt-4">
        <h3 className="text-lg font-bold mb-2">Remove student from the mess</h3>
        <input
          type="text"
          placeholder="Enter Mess Reg No"
          value={removeRegNo}
          onChange={(e) => setRemoveRegNo(e.target.value)}
          className="border border-gray-300 rounded p-2 mb-2 w-full"
        />
        <div className="flex gap-2">
          <button
            onClick={() => removeStudent()}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Remove Student
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded p-4 mt-4">
        <h3 className="text-lg font-bold mb-2">
          Get student details and attendance
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Student Mess Reg No"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            className="border border-gray-300 rounded p-2 flex-grow"
          />
          <button
            onClick={fetchAttendance}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? "Loading..." : "Fetch"}
          </button>
        </div>
      </div>

      {/* {error && <p className="text-red-500">{error}</p>} */}

      {studentDetails && (
        <div className="bg-white shadow-md rounded p-4 mb-4">
          <h3 className="text-lg font-bold mb-2">Student Details</h3>
          <p>
            <strong>Name:</strong> {studentDetails.name}
          </p>
          <p>
            <strong>Reg No:</strong> {studentDetails.reg_no}
          </p>
          <p>
            <strong>Email:</strong> {studentDetails.email}
          </p>
          <p>
            <strong>Registered_on:</strong> {studentDetails.registered_on}
          </p>
          <p>
            <strong>Status:</strong> {studentDetails.status}
          </p>
        </div>
      )}

      {attendanceData?.length > 0 && (
        <div className="bg-white shadow-md rounded p-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Date</th>
                <th className="border p-2">Breakfast</th>
                <th className="border p-2">Lunch</th>
                <th className="border p-2">Snack</th>
                <th className="border p-2">Dinner</th>
                <th className="border p-2">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((row, index) => (
                <tr key={index} className="text-center">
                  <td className="border p-2">{row.formatted_date}</td>
                  <td className="border p-2">{row.breakfast_time || "--"}</td>
                  <td className="border p-2">{row.lunch_time || "--"}</td>
                  <td className="border p-2">{row.snack_time || "--"}</td>
                  <td className="border p-2">{row.dinner_time || "--"}</td>
                  <td className="border p-2 font-bold">₹{row.total_cost}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right font-bold text-lg mt-4">
            Total Amount: ₹{totalAmount}
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentMessAttendance;
