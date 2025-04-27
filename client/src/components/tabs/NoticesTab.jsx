"use client"

import { useState, useEffect, memo } from "react"
import axios from "axios"
import { Bell, AlertCircle } from "lucide-react"
import axiosInstance from "../../api/axiosInstance"

// Memoized notice item component
const NoticeItem = memo(({ notice }) => {
  return (
    <li className="p-4 hover:bg-blue-50 transition-colors">
      <div className="flex items-start">
        <AlertCircle className="text-blue-600 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <p className="text-gray-700">{notice.notice}</p>
          {notice.date && (
            <p className="text-sm text-gray-500 mt-1">Posted on: {new Date(notice.date).toLocaleDateString()}</p>
          )}
        </div>
      </div>
    </li>
  )
})

function NoticesTab() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const res = await axiosInstance.get("http://localhost:5001/api/student/display-notices")
        setNotices(res.data)
      } catch (error) {
        console.error("Error fetching notices:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <Bell className="mr-2" />
          Notice Board
        </h2>
      </div>
      {notices.length > 0 ? (
        <ul className="divide-y divide-gray-200">
          {notices.map((notice) => (
            <NoticeItem key={notice.id} notice={notice} />
          ))}
        </ul>
      ) : (
        <div className="p-8 text-center text-gray-500">No notices available at this time.</div>
      )}
    </div>
  )
}

export default NoticesTab
