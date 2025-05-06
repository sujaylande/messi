// "use client"

// import { useState, useEffect } from "react"
// import axios from "axios"
// import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Label } from "recharts"
// import managerAxios from "../api/managerAxios";
// import NavStat from "../components/NavStat";
// axios.defaults.withCredentials = true;


// export default function FeedbackInsights() {
//   const [feedbackStats, setFeedbackStats] = useState([])
//   const [negativeComments, setNegativeComments] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true)
//         const [statsResponse, commentsResponse] = await Promise.all([
//           managerAxios.get("/feedback-stats"),
//           managerAxios.get("/negative-feedback"),
//         ])

//         // Data validation and transformation
//         const validStats = statsResponse.data.map((meal) => ({
//           ...meal,
//           // Ensure ratings are within 0-5 range
//           avg_taste: Math.min(5, Math.max(0, Number.parseFloat(meal.avg_taste) || 0)),
//           avg_hygiene: Math.min(5, Math.max(0, Number.parseFloat(meal.avg_hygiene) || 0)),
//           avg_quantity: Math.min(5, Math.max(0, Number.parseFloat(meal.avg_quantity) || 0)),
//           // Ensure counts are non-negative integers
//           feedback_count: Math.max(0, Number.parseInt(meal.feedback_count) || 0),
//           change_requests: Math.max(0, Number.parseInt(meal.change_requests) || 0),
//         }))

//         setFeedbackStats(validStats)
//         setNegativeComments(commentsResponse.data)
//         setError(null)
//       } catch (err) {
//         console.error("Error fetching data:", err)
//         setError("Failed to load feedback data. Please try again later.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchData()
//   }, [])

//   // Custom tooltip for better readability
//   const CustomTooltip = ({ active, payload, label }) => {
//     if (active && payload && payload.length) {
//       return (
//         <div className="bg-white p-2 border border-gray-200 shadow-md rounded-md">
//           <p className="font-semibold">{`${payload[0].name}: ${payload[0].value.toFixed(1)}`}</p>
//         </div>
//       )
//     }
//     return null
//   }

//   // Rating colors with better contrast and accessibility
//   const COLORS = {
//     excellent: "#22c55e", // Green
//     good: "#3b82f6", // Blue
//     average: "#f59e0b", // Amber
//     poor: "#ef4444", // Red
//     yes: "#8b5cf6", // Purple
//     no: "#94a3b8", // Slate
//   }

//   // Helper function to get rating label
//   const getRatingLabel = (score) => {
//     if (score >= 4.5) return "Excellent"
//     if (score >= 3.5) return "Good"
//     if (score >= 2.5) return "Average"
//     return "Poor"
//   }

//   // Helper function to get rating color
//   const getRatingColor = (score) => {
//     if (score >= 4.5) return COLORS.excellent
//     if (score >= 3.5) return COLORS.good
//     if (score >= 2.5) return COLORS.average
//     return COLORS.poor
//   }

//   if (loading) {
//     return (
//       <div className="max-w-5xl mx-auto p-6 flex justify-center items-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <div className="max-w-5xl mx-auto p-6 bg-red-50 rounded-lg shadow-md">
//         <p className="text-red-600 text-center">{error}</p>
//       </div>
//     )
//   }

//   return (
//     <>      <NavStat/>

//     <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
//       <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Feedback Statistics</h2>

//       {feedbackStats.length > 0 ? (
//         feedbackStats.map((meal, index) => (
//           <div key={index} className="mb-8 p-4 bg-gray-50 rounded-lg">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-xl font-semibold text-gray-700">{meal.meal_type} Feedback</h3>
//               <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
//                 Total Responses: {meal.feedback_count}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
//               {/* Taste Rating Chart */}
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h4 className="text-center text-gray-700 font-semibold mb-2">Taste Rating</h4>
//                 <div className="text-center text-3xl font-bold" style={{ color: getRatingColor(meal.avg_taste) }}>
//                   {meal.avg_taste.toFixed(1)}/5
//                 </div>
//                 <p className="text-center text-sm text-gray-500 mb-2">{getRatingLabel(meal.avg_taste)}</p>
//                 <ResponsiveContainer width="100%" height={150}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         { name: "Rating", value: meal.avg_taste, color: getRatingColor(meal.avg_taste) },
//                         { name: "Remaining", value: 5 - meal.avg_taste, color: "#e5e7eb" },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={40}
//                       outerRadius={60}
//                       startAngle={90}
//                       endAngle={-270}
//                       dataKey="value"
//                       strokeWidth={0}
//                     >
//                       {[0, 1].map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={index === 0 ? getRatingColor(meal.avg_taste) : "#e5e7eb"} />
//                       ))}
//                       <Label
//                         position="center"
//                         content={({ viewBox }) => {
//                           const { cx, cy } = viewBox
//                           return (
//                             <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-xs">
//                               {((meal.avg_taste / 5) * 100).toFixed(0)}%
//                             </text>
//                           )
//                         }}
//                       />
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Hygiene Rating Chart */}
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h4 className="text-center text-gray-700 font-semibold mb-2">Hygiene Rating</h4>
//                 <div className="text-center text-3xl font-bold" style={{ color: getRatingColor(meal.avg_hygiene) }}>
//                   {meal.avg_hygiene.toFixed(1)}/5
//                 </div>
//                 <p className="text-center text-sm text-gray-500 mb-2">{getRatingLabel(meal.avg_hygiene)}</p>
//                 <ResponsiveContainer width="100%" height={150}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         { name: "Rating", value: meal.avg_hygiene, color: getRatingColor(meal.avg_hygiene) },
//                         { name: "Remaining", value: 5 - meal.avg_hygiene, color: "#e5e7eb" },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={40}
//                       outerRadius={60}
//                       startAngle={90}
//                       endAngle={-270}
//                       dataKey="value"
//                       strokeWidth={0}
//                     >
//                       {[0, 1].map((entry, index) => (
//                         <Cell key={`cell-${index}`} fill={index === 0 ? getRatingColor(meal.avg_hygiene) : "#e5e7eb"} />
//                       ))}
//                       <Label
//                         position="center"
//                         content={({ viewBox }) => {
//                           const { cx, cy } = viewBox
//                           return (
//                             <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-xs">
//                               {((meal.avg_hygiene / 5) * 100).toFixed(0)}%
//                             </text>
//                           )
//                         }}
//                       />
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Quantity Rating Chart */}
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h4 className="text-center text-gray-700 font-semibold mb-2">Quantity Rating</h4>
//                 <div className="text-center text-3xl font-bold" style={{ color: getRatingColor(meal.avg_quantity) }}>
//                   {meal.avg_quantity.toFixed(1)}/5
//                 </div>
//                 <p className="text-center text-sm text-gray-500 mb-2">{getRatingLabel(meal.avg_quantity)}</p>
//                 <ResponsiveContainer width="100%" height={150}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         { name: "Rating", value: meal.avg_quantity, color: getRatingColor(meal.avg_quantity) },
//                         { name: "Remaining", value: 5 - meal.avg_quantity, color: "#e5e7eb" },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={40}
//                       outerRadius={60}
//                       startAngle={90}
//                       endAngle={-270}
//                       dataKey="value"
//                       strokeWidth={0}
//                     >
//                       {[0, 1].map((entry, index) => (
//                         <Cell
//                           key={`cell-${index}`}
//                           fill={index === 0 ? getRatingColor(meal.avg_quantity) : "#e5e7eb"}
//                         />
//                       ))}
//                       <Label
//                         position="center"
//                         content={({ viewBox }) => {
//                           const { cx, cy } = viewBox
//                           return (
//                             <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-xs">
//                               {((meal.avg_quantity / 5) * 100).toFixed(0)}%
//                             </text>
//                           )
//                         }}
//                       />
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* Change Requests Chart */}
//               <div className="bg-white p-4 rounded-lg shadow-md">
//                 <h4 className="text-center text-gray-700 font-semibold mb-2">Change Requests</h4>
//                 <div className="text-center text-3xl font-bold text-gray-800">
//                   {meal.change_requests} / {meal.feedback_count}
//                 </div>
//                 <p className="text-center text-sm text-gray-500 mb-2">
//                   {((meal.change_requests / meal.feedback_count) * 100).toFixed(0)}% want changes
//                 </p>
//                 <ResponsiveContainer width="100%" height={150}>
//                   <PieChart>
//                     <Pie
//                       data={[
//                         {
//                           name: "Want Change",
//                           value: meal.change_requests,
//                           color: COLORS.yes,
//                         },
//                         {
//                           name: "No Change",
//                           value: Math.max(0, meal.feedback_count - meal.change_requests),
//                           color: COLORS.no,
//                         },
//                       ]}
//                       cx="50%"
//                       cy="50%"
//                       innerRadius={40}
//                       outerRadius={60}
//                       dataKey="value"
//                       strokeWidth={0}
//                       labelLine={false}
//                     >
//                       <Cell fill={COLORS.yes} />
//                       <Cell fill={COLORS.no} />
//                     </Pie>
//                     <Tooltip content={<CustomTooltip />} />
//                     <Legend
//                       layout="horizontal"
//                       verticalAlign="bottom"
//                       align="center"
//                       iconSize={8}
//                       iconType="circle"
//                       wrapperStyle={{ fontSize: "10px", marginTop: "10px" }}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>

//             {/* Summary Section */}
//             <div className="mt-6 p-4 bg-blue-50 rounded-lg">
//               <h4 className="font-semibold text-gray-700 mb-2">Quick Summary</h4>
//               <ul className="space-y-1 text-sm">
//                 <li className="flex items-center">
//                   <span className="w-32">Overall Rating:</span>
//                   <span
//                     className="font-medium"
//                     style={{
//                       color: getRatingColor((meal.avg_taste + meal.avg_hygiene + meal.avg_quantity) / 3),
//                     }}
//                   >
//                     {((meal.avg_taste + meal.avg_hygiene + meal.avg_quantity) / 3).toFixed(1)}/5
//                   </span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32">Strongest Area:</span>
//                   <span className="font-medium">
//                     {
//                       [
//                         { name: "Taste", value: meal.avg_taste },
//                         { name: "Hygiene", value: meal.avg_hygiene },
//                         { name: "Quantity", value: meal.avg_quantity },
//                       ].sort((a, b) => b.value - a.value)[0].name
//                     }
//                   </span>
//                 </li>
//                 <li className="flex items-center">
//                   <span className="w-32">Needs Improvement:</span>
//                   <span className="font-medium">
//                     {
//                       [
//                         { name: "Taste", value: meal.avg_taste },
//                         { name: "Hygiene", value: meal.avg_hygiene },
//                         { name: "Quantity", value: meal.avg_quantity },
//                       ].sort((a, b) => a.value - b.value)[0].name
//                     }
//                   </span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//         ))
//       ) : (
//         <div className="p-8 bg-gray-50 rounded-lg text-center">
//           <p className="text-gray-600">No feedback data available for today.</p>
//         </div>
//       )}

//       {/* Negative Comments Section */}
//       <div className="mt-8">
//         <div className="flex items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Top Negative Comments From Todays Feedback Form</h2>
//           <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//             {negativeComments.length}
//           </span>
//         </div>

//         {negativeComments.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {negativeComments.map((comment, index) => (
//               <div key={index} className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
//                 <p className="text-gray-700">{comment.comment}</p>
//                 {comment.meal_type && (
//                   <div className="mt-2 flex items-center">
//                     <span className="text-xs font-medium text-gray-500">
//                       {comment.meal_type} •{" "}
//                       {comment.feedback_date ? new Date(comment.feedback_date).toLocaleDateString() : "Unknown date"}
//                     </span>
//                   </div>
//                 )}
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="p-6 bg-gray-50 rounded-lg text-center">
//             <p className="text-gray-600">No negative feedback found.</p>
//           </div>
//         )}
//       </div>
//     </div>
//     </>
//   )
// }

"use client"

import { lazy, Suspense } from "react"

// Lazy load components for code splitting
const NavStat = lazy(() => import("../components/NavStat"))
const FeedbackStats = lazy(() => import("../components/FeedbackStats"))
const NegativeFeedback = lazy(() => import("../components/NegativeFeedback"))

// Shimmer UI components
const ShimmerSection = () => (
  <div className="mb-8 p-4 bg-gray-50 rounded-lg animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
      <div className="h-6 bg-gray-200 rounded w-1/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white p-4 rounded-lg shadow-md animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-32 bg-gray-200 rounded-full w-32 mx-auto"></div>
        </div>
      ))}
    </div>
  </div>
)

const ShimmerComments = () => (
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

export default function FeedbackInsights() {
  return (
    <>
      <Suspense fallback={<div className="h-16 bg-gray-100 animate-pulse"></div>}>
        <NavStat />
      </Suspense>

      <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Today's Feedback Statistics</h2>

        <Suspense fallback={<ShimmerSection />}>
          <FeedbackStats />
        </Suspense>

        <Suspense fallback={<ShimmerComments />}>
          <NegativeFeedback />
        </Suspense>
      </div>
    </>
  )
}
