// "use client"

// import { useEffect } from "react"
// import studentAxios from "../../api/studentAxios"

// import { useState, useCallback, memo } from "react"
// import axios from "axios"
// import { ThumbsUp, Star } from "lucide-react"

// // Memoized rating input component
// const RatingInput = memo(({ name, value, onChange, label }) => {
//   return (
//     <div className="mb-4">
//       <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
//       <div className="flex items-center">
//         <input
//           type="range"
//           name={name}
//           min="1"
//           max="5"
//           value={value}
//           onChange={onChange}
//           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//         />
//         <div className="flex ml-4 space-x-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               size={20}
//               className={`${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// })

// function FeedbackTab({ student }) {
//   const [formData, setFormData] = useState({
//     reg_no: student?.reg_no || "",
//     block_no: student?.block_no || "",
//     meal_type: "Breakfast",
//     taste: 3,
//     hygiene: 3,
//     quantity: 3,
//     want_change: false,
//     comments: "",
//   })
//   const [feedbackSuccess, setFeedbackSuccess] = useState(false)
//   const [submitting, setSubmitting] = useState(false)

//   // Update form data when student context changes
//   useEffect(() => {
//     if (student) {
//       setFormData((prevData) => ({
//         ...prevData,
//         reg_no: student.reg_no || "",
//         block_no: student.block_no || "",
//       }))
//     }
//   }, [student])

//   const handleChange = useCallback((e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }, [])

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault()

//       if (!formData.reg_no || !formData.block_no) {
//         alert("Student registration number and block number are required.")
//         return
//       }

//       try {
//         setSubmitting(true)
//         await studentAxios.post("/feedback-form", formData)
//         setFeedbackSuccess(true)

//         // Reset form
//         setFormData({
//           reg_no: student?.reg_no || "",
//           block_no: student?.block_no || "",
//           meal_type: "Breakfast",
//           taste: 3,
//           hygiene: 3,
//           quantity: 3,
//           want_change: false,
//           comments: "",
//         })

//         // Hide success message after 3 seconds
//         setTimeout(() => setFeedbackSuccess(false), 3000)
//       } catch (error) {
//         console.error("Error submitting feedback:", error)
//         alert("Failed to submit feedback.")
//       } finally {
//         setSubmitting(false)
//       }
//     },
//     [formData, student],
//   )

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//         <h2 className="text-xl font-bold text-white flex items-center">
//           <ThumbsUp className="mr-2" />
//           Submit Meal Feedback
//         </h2>
//       </div>

//       {feedbackSuccess && (
//         <div className="m-4 p-4 bg-green-100 text-green-700 rounded-md">
//           Feedback submitted successfully! Thank you for your input.
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">Meal Type</label>
//             <div className="relative">
//               <select
//                 name="meal_type"
//                 className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.meal_type}
//                 onChange={handleChange}
//               >
//                 <option value="Breakfast">Breakfast</option>
//                 <option value="Lunch">Lunch</option>
//                 <option value="Snack">Snack</option>
//                 <option value="Dinner">Dinner</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="want_change"
//               name="want_change"
//               className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//               checked={formData.want_change}
//               onChange={handleChange}
//             />
//             <label htmlFor="want_change" className="ml-2 text-gray-700">
//               Do you want a change in this meal?
//             </label>
//           </div>
//         </div>

//         <div className="mt-6">
//           <RatingInput name="taste" value={formData.taste} onChange={handleChange} label="Taste Rating" />

//           <RatingInput name="hygiene" value={formData.hygiene} onChange={handleChange} label="Hygiene Rating" />

//           <RatingInput name="quantity" value={formData.quantity} onChange={handleChange} label="Quantity Rating" />
//         </div>

//         <div className="mt-6">
//           <label className="block text-gray-700 text-sm font-medium mb-2">Additional Comments</label>
//           <textarea
//             name="comments"
//             placeholder="Share your thoughts about the meal..."
//             rows="4"
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.comments}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         <div className="mt-6">
//           <button
//             type="submit"
//             disabled={submitting}
//             className={`w-full ${
//               submitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
//           >
//             {submitting ? "Submitting..." : "Submit Feedback"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default FeedbackTab


// "use client"

// import { useState, useCallback, memo, useEffect } from "react"
// import { ThumbsUp, Star } from "lucide-react"
// import studentAxios from "../../api/studentAxios"
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

// // Memoized rating input component
// const RatingInput = memo(({ name, value, onChange, label }) => {
//   return (
//     <div className="mb-4">
//       <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
//       <div className="flex items-center">
//         <input
//           type="range"
//           name={name}
//           min="1"
//           max="5"
//           value={value}
//           onChange={onChange}
//           className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//         />
//         <div className="flex ml-4 space-x-1">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               size={20}
//               className={`${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   )
// })

// // Shimmer UI for feedback form
// const FeedbackShimmer = () => (
//   <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
//     <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//       <div className="h-7 bg-white bg-opacity-20 rounded w-40"></div>
//     </div>
//     <div className="p-6 space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div className="h-12 bg-gray-200 rounded"></div>
//         <div className="h-12 bg-gray-200 rounded"></div>
//       </div>
//       <div className="space-y-4">
//         <div className="h-12 bg-gray-200 rounded"></div>
//         <div className="h-12 bg-gray-200 rounded"></div>
//         <div className="h-12 bg-gray-200 rounded"></div>
//       </div>
//       <div className="h-32 bg-gray-200 rounded"></div>
//       <div className="h-12 bg-gray-200 rounded"></div>
//     </div>
//   </div>
// )

// function FeedbackTab({ student }) {
//   const queryClient = useQueryClient()

//   // Check if feedback has been submitted already (no need to refetch)
//   const { data: feedbackStatus, isLoading } = useQuery({
//     queryKey: ["feedback-status", student?.reg_no],
//     queryFn: async () => {
//       if (!student?.reg_no) return { hasSubmitted: false }

//       try {
//         // You would need to create this endpoint on your backend
//         // This is just a placeholder - implement according to your API
//         const res = await studentAxios.get(`/feedback-status/${student.reg_no}`)
//         return { hasSubmitted: res.data.hasSubmitted }
//       } catch (error) {
//         console.error("Error checking feedback status:", error)
//         return { hasSubmitted: false }
//       }
//     },
//     // Never expire this data during the session - feedback is submitted once
//     staleTime: Number.POSITIVE_INFINITY,
//     cacheTime: Number.POSITIVE_INFINITY,
//     enabled: !!student?.reg_no,
//   })

//   const [formData, setFormData] = useState({
//     reg_no: student?.reg_no || "",
//     block_no: student?.block_no || "",
//     meal_type: "Breakfast",
//     taste: 3,
//     hygiene: 3,
//     quantity: 3,
//     want_change: false,
//     comments: "",
//   })

//   const [feedbackSuccess, setFeedbackSuccess] = useState(false)

//   // Update form data when student context changes
//   useEffect(() => {
//     if (student) {
//       setFormData((prevData) => ({
//         ...prevData,
//         reg_no: student.reg_no || "",
//         block_no: student.block_no || "",
//       }))
//     }
//   }, [student])

//   // Mutation for submitting feedback
//   const mutation = useMutation({
//     mutationFn: (data) => studentAxios.post("/feedback-form", data),
//     onSuccess: () => {
//       setFeedbackSuccess(true)

//       // Update the feedback status in the cache
//       queryClient.setQueryData(["feedback-status", student?.reg_no], { hasSubmitted: true })

//       // Reset form
//       setFormData({
//         reg_no: student?.reg_no || "",
//         block_no: student?.block_no || "",
//         meal_type: "Breakfast",
//         taste: 3,
//         hygiene: 3,
//         quantity: 3,
//         want_change: false,
//         comments: "",
//       })

//       // Hide success message after 3 seconds
//       setTimeout(() => setFeedbackSuccess(false), 3000)
//     },
//   })

//   const handleChange = useCallback((e) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }, [])

//   const handleSubmit = useCallback(
//     async (e) => {
//       e.preventDefault()

//       if (!formData.reg_no || !formData.block_no) {
//         alert("Student registration number and block number are required.")
//         return
//       }

//       mutation.mutate(formData)
//     },
//     [formData, mutation],
//   )

//   if (isLoading) {
//     return <FeedbackShimmer />
//   }

//   // If feedback has already been submitted, show a message
//   if (feedbackStatus?.hasSubmitted) {
//     return (
//       <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//         <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//           <h2 className="text-xl font-bold text-white flex items-center">
//             <ThumbsUp className="mr-2" />
//             Feedback Status
//           </h2>
//         </div>
//         <div className="p-8 text-center">
//           <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
//             You have already submitted your feedback. Thank you for your input!
//           </div>
//           <p className="text-gray-600">Your feedback helps us improve our services.</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//         <h2 className="text-xl font-bold text-white flex items-center">
//           <ThumbsUp className="mr-2" />
//           Submit Meal Feedback
//         </h2>
//       </div>

//       {feedbackSuccess && (
//         <div className="m-4 p-4 bg-green-100 text-green-700 rounded-md">
//           Feedback submitted successfully! Thank you for your input.
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-gray-700 text-sm font-medium mb-2">Meal Type</label>
//             <div className="relative">
//               <select
//                 name="meal_type"
//                 className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={formData.meal_type}
//                 onChange={handleChange}
//               >
//                 <option value="Breakfast">Breakfast</option>
//                 <option value="Lunch">Lunch</option>
//                 <option value="Snack">Snack</option>
//                 <option value="Dinner">Dinner</option>
//               </select>
//               <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                 <svg
//                   className="w-5 h-5 text-gray-400"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
//                 </svg>
//               </div>
//             </div>
//           </div>

//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="want_change"
//               name="want_change"
//               className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//               checked={formData.want_change}
//               onChange={handleChange}
//             />
//             <label htmlFor="want_change" className="ml-2 text-gray-700">
//               Do you want a change in this meal?
//             </label>
//           </div>
//         </div>

//         <div className="mt-6">
//           <RatingInput name="taste" value={formData.taste} onChange={handleChange} label="Taste Rating" />

//           <RatingInput name="hygiene" value={formData.hygiene} onChange={handleChange} label="Hygiene Rating" />

//           <RatingInput name="quantity" value={formData.quantity} onChange={handleChange} label="Quantity Rating" />
//         </div>

//         <div className="mt-6">
//           <label className="block text-gray-700 text-sm font-medium mb-2">Additional Comments</label>
//           <textarea
//             name="comments"
//             placeholder="Share your thoughts about the meal..."
//             rows="4"
//             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             value={formData.comments}
//             onChange={handleChange}
//           ></textarea>
//         </div>

//         <div className="mt-6">
//           <button
//             type="submit"
//             disabled={mutation.isLoading}
//             className={`w-full ${
//               mutation.isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
//             } text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
//           >
//             {mutation.isLoading ? "Submitting..." : "Submit Feedback"}
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default FeedbackTab


"use client"

import { useState, useCallback, memo, useEffect } from "react"
import { ThumbsUp, Star } from "lucide-react"
import studentAxios from "../../api/studentAxios"

// Memoized rating input component
const RatingInput = memo(({ name, value, onChange, label }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>
      <div className="flex items-center">
        <input
          type="range"
          name={name}
          min="1"
          max="5"
          value={value}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex ml-4 space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={20}
              className={`${star <= value ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
})

function FeedbackTab({ student }) {
  const [formData, setFormData] = useState({
    reg_no: student?.reg_no || "",
    block_no: student?.block_no || "",
    meal_type: "Breakfast",
    taste: 3,
    hygiene: 3,
    quantity: 3,
    want_change: false,
    comments: "",
  })

  const [feedbackSuccess, setFeedbackSuccess] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData((prevData) => ({
        ...prevData,
        reg_no: student.reg_no || "",
        block_no: student.block_no || "",
      }))
    }
  }, [student])

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (!formData.reg_no || !formData.block_no) {
        alert("Student registration number and block number are required.")
        return
      }

      setIsSubmitting(true)
      try {
        await studentAxios.post("/feedback-form", formData)
        setFeedbackSuccess(true)
        setAlreadySubmitted(false)

        // Reset form
        setFormData((prev) => ({
          ...prev,
          meal_type: "Breakfast",
          taste: 3,
          hygiene: 3,
          quantity: 3,
          want_change: false,
          comments: "",
        }))

        setTimeout(() => setFeedbackSuccess(false), 3000)
      } catch (error) {
        if (error?.response?.status === 409) {
          setAlreadySubmitted(true)
        } else {
          alert("Something went wrong while submitting your feedback.")
        }
      } finally {
        setIsSubmitting(false)
      }
    },
    [formData],
  )

  if (alreadySubmitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ThumbsUp className="mr-2" />
            Feedback Status
          </h2>
        </div>
        <div className="p-8 text-center">
          <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4">
            You have already submitted your feedback. Thank you for your input!
          </div>
          <p className="text-gray-600">Your feedback helps us improve our services.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center">
          <ThumbsUp className="mr-2" />
          Submit Meal Feedback
        </h2>
      </div>

      {feedbackSuccess && (
        <div className="m-4 p-4 bg-green-100 text-green-700 rounded-md">
          Feedback submitted successfully! Thank you for your input.
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Meal Type</label>
            <div className="relative">
              <select
                name="meal_type"
                className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.meal_type}
                onChange={handleChange}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snack">Snack</option>
                <option value="Dinner">Dinner</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="want_change"
              name="want_change"
              className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              checked={formData.want_change}
              onChange={handleChange}
            />
            <label htmlFor="want_change" className="ml-2 text-gray-700">
              Do you want a change in this meal?
            </label>
          </div>
        </div>

        <div className="mt-6">
          <RatingInput name="taste" value={formData.taste} onChange={handleChange} label="Taste Rating" />
          <RatingInput name="hygiene" value={formData.hygiene} onChange={handleChange} label="Hygiene Rating" />
          <RatingInput name="quantity" value={formData.quantity} onChange={handleChange} label="Quantity Rating" />
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 text-sm font-medium mb-2">Additional Comments</label>
          <textarea
            name="comments"
            placeholder="Share your thoughts about the meal..."
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors`}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FeedbackTab
