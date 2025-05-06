"use client"

import { useQuery } from "@tanstack/react-query"
import managerAxios from "../api/managerAxios"

export default function NegativeFeedback() {
  // Fetch negative comments using React Query v5
  const {
    data: negativeComments = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["negativeComments"],
    queryFn: async () => {
      const response = await managerAxios.get("/negative-feedback")
      return response.data
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  if (isPending) {
    return (
      <div className="mt-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-4 bg-gray-100 rounded-lg">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 p-6 bg-red-50 rounded-lg shadow-md">
        <p className="text-red-600 text-center">
          {error.message || "Failed to load negative feedback. Please try again later."}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Top Negative Comments From Todays Feedback Form</h2>
        <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {negativeComments.length}
        </span>
      </div>

      {negativeComments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {negativeComments.map((comment, index) => (
            <div key={index} className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
              <p className="text-gray-700">{comment.comment}</p>
              {comment.meal_type && (
                <div className="mt-2 flex items-center">
                  <span className="text-xs font-medium text-gray-500">
                    {comment.meal_type} •{" "}
                    {comment.feedback_date ? new Date(comment.feedback_date).toLocaleDateString() : "Unknown date"}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600">No negative feedback found.</p>
        </div>
      )}
    </div>
  )
}
