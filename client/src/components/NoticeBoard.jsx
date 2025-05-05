// import { useEffect, useState } from "react";
// import axios from "axios";
// axios.defaults.withCredentials = true;

// export default function NoticeBoard() {
//   const [notice, setNotice] = useState("");
//   const [notices, setNotices] = useState([]);

//   useEffect(() => {
//     fetchNotices();
//   }, []);

//   const fetchNotices = async () => {
//     const res = await axios.get("http://localhost:5000/api/manager/display-notices");
//     setNotices(res.data);
//   };

//   const addNotice = async () => {
//     if (!notice.trim()) return;
//     await axios.post("http://localhost:5000/api/manager/add-notice", { notice });
//     setNotice("");
//     fetchNotices();
//   };

//   const deleteNotice = async (id) => {
//     await axios.delete(`http://localhost:5000/api/manager/remove-notice/${id}`);
//     fetchNotices();
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Notice Board</h2>
//       <div className="flex gap-2 mb-4">
//         <input
//           type="text"
//           placeholder="Enter notice"
//           value={notice}
//           onChange={(e) => setNotice(e.target.value)}
//           className="flex-1 border rounded p-2"
//         />
//         <button onClick={addNotice} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Add
//         </button>
//       </div>
//       <ul>
//         {notices.map((n) => (
//           <li key={n.id} className="flex justify-between p-2 border-b">
//             {n.notice}
//             <button onClick={() => deleteNotice(n.id)} className="text-red-500">✖</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import managerAxios from '../api/managerAxios'
import NavStat from "./NavStat"

axios.defaults.withCredentials = true

export default function NoticeBoard() {
  const [notice, setNotice] = useState("")
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchNotices()
  }, [])

  const fetchNotices = async () => {
    setLoading(true)
    try {
      const res = await managerAxios.get("/display-notices")
      setNotices(res.data)
      setError("")
    } catch (err) {
      console.error("Error fetching notices:", err)
      setError("Failed to load notices. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const addNotice = async () => {
    if (!notice.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      await managerAxios.post("/add-notice", { notice })
      setNotice("")
      fetchNotices()
    } catch (err) {
      console.error("Error adding notice:", err)
      setError("Failed to add notice. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteNotice = async (id) => {
    try {
      await managerAxios.delete(`/remove-notice/${id}`)
      fetchNotices()
    } catch (err) {
      console.error("Error deleting notice:", err)
      setError("Failed to delete notice. Please try again.")
    }
  }

  return (
    <>      <NavStat />

    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 py-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <svg
          className="w-6 h-6 mr-2 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          ></path>
        </svg>
        Notice Board
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
          {error}
          <button onClick={fetchNotices} className="ml-2 underline font-medium">
            Try Again
          </button>
        </div>
      )}

      <div className="mb-6">
        <label htmlFor="notice" className="block text-sm font-medium text-gray-700 mb-1">
          New Notice
        </label>
        <div className="flex gap-2">
          <input
            id="notice"
            type="text"
            placeholder="Enter important announcement..."
            value={notice}
            onChange={(e) => setNotice(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
          />
          <button
            onClick={addNotice}
            disabled={isSubmitting || !notice.trim()}
            className={`px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 ${
              isSubmitting || !notice.trim()
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 active:bg-green-700 shadow-md hover:shadow-lg"
            }`}
          >
            {isSubmitting ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      ) : notices.length === 0 ? (
        <div className="text-center py-8 text-gray-500 border-t border-dashed">
          <svg
            className="w-12 h-12 mx-auto text-gray-300 mb-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
          <p className="text-lg font-medium">No notices available</p>
          <p className="mt-1">Add a notice to get started</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {notices.map((n) => (
            <div
              key={n.id}
              className="flex items-start justify-between p-4 rounded-lg border border-gray-100 hover:border-amber-100 hover:bg-amber-50 transition-colors"
            >
              <div className="flex items-start">
                <svg
                  className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <div>
                  <p className="text-gray-800">{n.notice}</p>
                  {n.created_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(n.created_at).toLocaleDateString()} at{" "}
                      {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteNotice(n.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                aria-label="Delete notice"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  )
}
