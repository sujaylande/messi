// import { useContext, useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Calendar,
//   Bell,
//   User,
//   Coffee,
//   Utensils,
//   Clock,
//   Moon,
//   Download,
//   Star,
//   ThumbsUp,
//   Clipboard,
//   AlertCircle,
// } from "lucide-react";
// import { StudentDataContext } from "../context/StudentContext";
// import { useNavigate } from "react-router-dom";

// axios.defaults.withCredentials = true;


// function StudentPublic() {
//   const [menu, setMenu] = useState([]);
//   const [notices, setNotices] = useState([]);
//   const [regNo, setRegNo] = useState("");
//   const [attendanceData, setAttendanceData] = useState([]);
//   const [totalAmount, setTotalAmount] = useState(0);
//   const [studentDetails, setStudentDetails] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [activeTab, setActiveTab] = useState("menu");
//   const { student, setStudent } = useContext(StudentDataContext);
//   const navigate = useNavigate();



//   const [formData, setFormData] = useState({
//     reg_no: student?.reg_no || "",
//     block_no: student?.block_no || "",
//     meal_type: "Breakfast",
//     taste: 3,
//     hygiene: 3,
//     quantity: 3,
//     want_change: false,
//     comments: "",
//   });
//   const [feedbackSuccess, setFeedbackSuccess] = useState(false);

//   // Function to get student data from localStorage if not in context
//   // const getStudentFromStorage = () => {
//   //   try {
//   //     // Try to get student data from localStorage if it exists
//   //     const storedStudent = localStorage.getItem("student-data");
//   //     if (storedStudent) {
//   //       const parsedStudent = JSON.parse(storedStudent);
//   //       // console.log("Found student in localStorage:", parsedStudent);
//   //       setStudent(parsedStudent); // Update the context
//   //       return parsedStudent;
//   //     }
//   //   } catch (error) {
//   //     console.error("Error getting student from storage:", error);
//   //   }
//   //   return null;
//   // };  
  
//     const handleLogout = async () => {
//       try {
//         await axios.get("http://localhost:5001/api/student/logout", {}, {
//           withCredentials: true
//         });
  
//         // Clear student context
//         setStudent(null);
  
//         // Optional: remove any localStorage data related to student
//         localStorage.removeItem("student-data");
  
//         // Redirect to login/home
//         navigate('/');
//       } catch (error) {
//         console.error("Logout failed:", error.response?.data?.message || error.message);
//         alert("Logout failed. Please try again.");
//       }
//     };

//   const fetchNotices = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5001/api/student/display-notices"
//       );
//       setNotices(res.data);
//     } catch (error) {
//       console.error("Error fetching notices:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMenu();
//     fetchNotices();

//     // If student is not in context, try to get from localStorage
//     if (!student) {
//       getStudentFromStorage();
//     }
//   }, []);

//   // Handle tab change
//   const handleTabChange = (tab) => {
//     setActiveTab(tab);

//     // If switching to attendance tab, fetch attendance data
//     if (tab === "attendance") {
//       fetchAttendance();
//     }
//   };

//   const fetchMenu = async () => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5001/api/student/display-menu"
//       );
//       setMenu(res.data);
//     } catch (error) {
//       console.error("Error fetching menu:", error);
//     }
//   };

//   const fetchAttendance = async () => {
//     console.log("Fetching attendance data...");
//     setLoading(true);
//     setError("");

//     // Get student data from context or try localStorage
//     const currentStudent = student || getStudentFromStorage();

//     // If we have student data, use it; otherwise use hardcoded values
//     const reg_no = currentStudent?.reg_no;
//     const block_no = currentStudent?.block_no;

//     // console.log(`Using reg_no: ${reg_no}, block_no: ${block_no}`);

//     try {
//       const response = await axios.get(
//         `http://localhost:5001/api/student/student-stat/${reg_no}/${block_no}`
//       );

//       // console.log("Attendance data:", response.data);

//       setAttendanceData(response.data.attendance);
//       setTotalAmount(response.data.totalAmount);

//       // Handle different response structures
//       const studentData =
//         response.data.studentDetails || response.data.studentwithoutpassword;
//       setStudentDetails(studentData);

//       // If we got student data but it's not in context, update context
//       if (studentData && !student) {
//         setStudent({
//           reg_no: studentData.reg_no,
//           block_no: studentData.block_no,
//           name: studentData.name,
//           email: studentData.email,
//         });

//         // Also save to localStorage for future use
//         localStorage.setItem(
//           "student-data",
//           JSON.stringify({
//             reg_no: studentData.reg_no,
//             block_no: studentData.block_no,
//             name: studentData.name,
//             email: studentData.email,
//           })
//         );
//       }

//       setRegNo("");
//     } catch (err) {
//       console.error("Error fetching attendance:", err);
//       setError("Error fetching data.");
//       alert(err.response?.data?.error || "Unknown error");
//       setRegNo("");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:5001/api/student/feedback-form",
//         formData
//       );
//       setFeedbackSuccess(true);
//       setTimeout(() => setFeedbackSuccess(false), 3000);

//       setFormData({
//         reg_no: student?.reg_no || "",
//         block_no: student?.block_no || "",
//         meal_type: "Breakfast",
//         taste: 3,
//         hygiene: 3,
//         quantity: 3,
//         want_change: false,
//         comments: "",
//       });
//     } catch (error) {
//       console.error("Error submitting feedback:", error);
//       alert("Failed to submit feedback.");
//     }
//   };

//   const downloadAttendanceCSV = () => {
//     if (!attendanceData || attendanceData.length === 0) return;

//     const headers = [
//       "Date",
//       "Breakfast",
//       "Lunch",
//       "Snack",
//       "Dinner",
//       "Total Cost",
//     ];
//     const csvRows = [];
//     csvRows.push(headers.join(","));

//     for (const row of attendanceData) {
//       const values = [
//         row.formatted_date,
//         row.breakfast_time || "--",
//         row.lunch_time || "--",
//         row.snack_time || "--",
//         row.dinner_time || "--",
//         `₹${row.total_cost}`,
//       ];
//       csvRows.push(values.join(","));
//     }

//     csvRows.push(`Total Amount,,,,,₹${totalAmount}`);

//     const csvString = csvRows.join("\n");
//     const blob = new Blob([csvString], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.setAttribute("hidden", "");
//     a.setAttribute("href", url);
//     a.setAttribute(
//       "download",
//       `attendance_${studentDetails?.reg_no || "data"}.csv`
//     );
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   };

//   // Helper function to get meal icon
//   const getMealIcon = (mealType) => {
//     switch (mealType.toLowerCase()) {
//       case "breakfast":
//         return <Coffee className="h-5 w-5" />;
//       case "lunch":
//         return <Utensils className="h-5 w-5" />;
//       case "snack":
//         return <Clock className="h-5 w-5" />;
//       case "dinner":
//         return <Moon className="h-5 w-5" />;
//       default:
//         return <Utensils className="h-5 w-5" />;
//     }
//   };

//   // Rating component for feedback form
//   const RatingInput = ({ name, value, onChange, label }) => {
//     return (
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-medium mb-2">
//           {label}
//         </label>
//         <div className="flex items-center">
//           <input
//             type="range"
//             name={name}
//             min="1"
//             max="5"
//             value={value}
//             onChange={onChange}
//             className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//           />
//           <div className="flex ml-4 space-x-1">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 size={20}
//                 className={`${
//                   star <= value
//                     ? "text-yellow-400 fill-yellow-400"
//                     : "text-gray-300"
//                 }`}
//               />
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
//         <div className="container mx-auto px-4 py-6">
//           <h1 className="text-3xl font-bold">Student Mess Portal</h1>
//           <p className="mt-1 text-blue-100">
//             View menu, submit feedback, and check attendance
//           </p>
//         </div>
//         <button
//       onClick={handleLogout}
//       className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//     >
//       Logout
//     </button>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="bg-white shadow">
//         <div className="container mx-auto px-4">
//           <div className="flex overflow-x-auto">
//             <button
//               onClick={() => handleTabChange("menu")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "menu"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <Calendar className="mr-2 h-5 w-5" />
//               Today's Menu
//             </button>
//             <button
//               onClick={() => handleTabChange("notices")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "notices"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <Bell className="mr-2 h-5 w-5" />
//               Notice Board
//             </button>
//             <button
//               onClick={() => handleTabChange("feedback")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "feedback"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <ThumbsUp className="mr-2 h-5 w-5" />
//               Feedback
//             </button>
//             <button
//               onClick={() => handleTabChange("attendance")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "attendance"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <User className="mr-2 h-5 w-5" />
//               {activeTab === "attendance" && loading
//                 ? "Loading..."
//                 : "Attendance"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8">
//         {/* Menu Tab */}
//         {activeTab === "menu" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {menu.length > 0 ? (
//               menu.map((m) => (
//                 <div
//                   key={m.id}
//                   className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1"
//                 >
//                   <div className="relative h-48 overflow-hidden">
//                     <img
//                       src={m.img_url || "/placeholder.svg"}
//                       alt={m.meal_slot}
//                       className="w-full h-full object-cover"
//                     />
//                     <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">
//                       {m.meal_slot}
//                     </div>
//                   </div>
//                   <div className="p-4">
//                     <div className="flex items-center mb-2">
//                       {getMealIcon(m.meal_slot)}
//                       <h3 className="ml-2 text-lg font-semibold text-gray-800">
//                         {m.meal_slot}
//                       </h3>
//                     </div>
//                     <p className="text-gray-600">{m.items}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full flex justify-center items-center h-64">
//                 <p className="text-gray-500">
//                   No menu items available for today.
//                 </p>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Notices Tab */}
//         {activeTab === "notices" && (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <Bell className="mr-2" />
//                 Notice Board
//               </h2>
//             </div>
//             {notices.length > 0 ? (
//               <ul className="divide-y divide-gray-200">
//                 {notices.map((n) => (
//                   <li
//                     key={n.id}
//                     className="p-4 hover:bg-blue-50 transition-colors"
//                   >
//                     <div className="flex items-start">
//                       <AlertCircle className="text-blue-600 h-5 w-5 mt-0.5 mr-3 flex-shrink-0" />
//                       <div>
//                         <p className="text-gray-700">{n.notice}</p>
//                         {n.date && (
//                           <p className="text-sm text-gray-500 mt-1">
//                             Posted on: {new Date(n.date).toLocaleDateString()}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <div className="p-8 text-center text-gray-500">
//                 No notices available at this time.
//               </div>
//             )}
//           </div>
//         )}

//         {/* Feedback Tab */}
//         {activeTab === "feedback" && (
//           <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//               <h2 className="text-xl font-bold text-white flex items-center">
//                 <ThumbsUp className="mr-2" />
//                 Submit Meal Feedback
//               </h2>
//             </div>

//             {feedbackSuccess && (
//               <div className="m-4 p-4 bg-green-100 text-green-700 rounded-md">
//                 Feedback submitted successfully! Thank you for your input.
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-gray-700 text-sm font-medium mb-2">
//                     Meal Type
//                   </label>
//                   <div className="relative">
//                     <select
//                       name="meal_type"
//                       className="w-full p-3 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       value={formData.meal_type}
//                       onChange={handleChange}
//                     >
//                       <option value="Breakfast">Breakfast</option>
//                       <option value="Lunch">Lunch</option>
//                       <option value="Snack">Snack</option>
//                       <option value="Dinner">Dinner</option>
//                     </select>
//                     <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
//                       <svg
//                         className="w-5 h-5 text-gray-400"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                         xmlns="http://www.w3.org/2000/svg"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M19 9l-7 7-7-7"
//                         ></path>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex items-center">
//                   <input
//                     type="checkbox"
//                     id="want_change"
//                     name="want_change"
//                     className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
//                     checked={formData.want_change}
//                     onChange={handleChange}
//                   />
//                   <label htmlFor="want_change" className="ml-2 text-gray-700">
//                     Do you want a change in this meal?
//                   </label>
//                 </div>
//               </div>

//               <div className="mt-6">
//                 <RatingInput
//                   name="taste"
//                   value={formData.taste}
//                   onChange={handleChange}
//                   label="Taste Rating"
//                 />

//                 <RatingInput
//                   name="hygiene"
//                   value={formData.hygiene}
//                   onChange={handleChange}
//                   label="Hygiene Rating"
//                 />

//                 <RatingInput
//                   name="quantity"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   label="Quantity Rating"
//                 />
//               </div>

//               <div className="mt-6">
//                 <label className="block text-gray-700 text-sm font-medium mb-2">
//                   Additional Comments
//                 </label>
//                 <textarea
//                   name="comments"
//                   placeholder="Share your thoughts about the meal..."
//                   rows="4"
//                   className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={formData.comments}
//                   onChange={handleChange}
//                 ></textarea>
//               </div>

//               <div className="mt-6">
//                 <button
//                   type="submit"
//                   className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
//                 >
//                   Submit Feedback
//                 </button>
//               </div>
//             </form>
//           </div>
//         )}

//         {/* Attendance Tab */}
//         {activeTab === "attendance" && (
//           <div>
//             {loading && (
//               <div className="flex justify-center items-center py-10">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//                 <span className="ml-3 text-lg text-gray-600">
//                   Loading student data...
//                 </span>
//               </div>
//             )}

//             {/* Student Details */}
//             {!loading && studentDetails && (
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
//                 <div className="bg-white rounded-lg shadow-md overflow-hidden md:col-span-3">
//                   <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
//                     <h2 className="text-xl font-bold text-white flex items-center">
//                       <User className="mr-2" />
//                       Student Details
//                     </h2>
//                   </div>
//                   <div className="p-6">
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-500">
//                           Name
//                         </h3>
//                         <p className="text-lg font-semibold text-gray-800">
//                           {studentDetails.name}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-500">
//                           Registration Number
//                         </h3>
//                         <p className="text-lg font-semibold text-gray-800">
//                           {studentDetails.reg_no}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-500">
//                           Email
//                         </h3>
//                         <p className="text-lg font-semibold text-gray-800">
//                           {studentDetails.email}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-500">
//                           Registered On
//                         </h3>
//                         <p className="text-lg font-semibold text-gray-800">
//                           {studentDetails.registered_on}
//                         </p>
//                       </div>
//                       <div className="bg-blue-50 p-4 rounded-lg">
//                         <h3 className="text-sm font-medium text-gray-500">
//                           Status
//                         </h3>
//                         <p
//                           className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                             studentDetails.status === "active"
//                               ? "bg-green-100 text-green-800"
//                               : "bg-red-100 text-red-800"
//                           }`}
//                         >
//                           {studentDetails.status}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Attendance Table */}
//             {!loading && attendanceData?.length > 0 && (
//               <div className="bg-white rounded-lg shadow-md overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
//                   <h2 className="text-xl font-bold text-white flex items-center">
//                     <Clipboard className="mr-2" />
//                     Attendance History
//                   </h2>
//                   <button
//                     onClick={downloadAttendanceCSV}
//                     className="bg-white text-blue-700 px-3 py-1 rounded-md hover:bg-blue-50 flex items-center text-sm"
//                   >
//                     <Download className="mr-1 h-4 w-4" />
//                     Export CSV
//                   </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="bg-gray-100 text-left text-gray-600 text-sm">
//                         <th className="py-3 px-4 font-semibold">Date</th>
//                         <th className="py-3 px-4 font-semibold">Breakfast</th>
//                         <th className="py-3 px-4 font-semibold">Lunch</th>
//                         <th className="py-3 px-4 font-semibold">Snack</th>
//                         <th className="py-3 px-4 font-semibold">Dinner</th>
//                         <th className="py-3 px-4 font-semibold text-right">
//                           Cost
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {attendanceData.map((row, index) => (
//                         <tr
//                           key={index}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="py-3 px-4 font-medium">
//                             {row.formatted_date}
//                           </td>
//                           <td className="py-3 px-4">
//                             {row.breakfast_time ? (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                 {row.breakfast_time}
//                               </span>
//                             ) : (
//                               <span className="text-gray-400">--</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4">
//                             {row.lunch_time ? (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
//                                 {row.lunch_time}
//                               </span>
//                             ) : (
//                               <span className="text-gray-400">--</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4">
//                             {row.snack_time ? (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                                 {row.snack_time}
//                               </span>
//                             ) : (
//                               <span className="text-gray-400">--</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4">
//                             {row.dinner_time ? (
//                               <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
//                                 {row.dinner_time}
//                               </span>
//                             ) : (
//                               <span className="text-gray-400">--</span>
//                             )}
//                           </td>
//                           <td className="py-3 px-4 text-right font-medium">
//                             ₹{row.total_cost}
//                           </td>
//                         </tr>
//                       ))}
//                       <tr className="bg-gray-50">
//                         <td
//                           colSpan="5"
//                           className="py-3 px-4 text-right font-bold"
//                         >
//                           Total Amount
//                         </td>
//                         <td className="py-3 px-4 text-right font-bold text-blue-700">
//                           ₹{totalAmount}
//                         </td>
//                       </tr>
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             )}

//             {/* No attendance data message */}
//             {!loading &&
//               !error &&
//               !attendanceData.length &&
//               !studentDetails && (
//                 <div className="bg-white rounded-lg shadow-md p-8 text-center">
//                   <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-lg font-medium text-gray-700 mb-2">
//                     No Student Data
//                   </h3>
//                   <button
//                     onClick={fetchAttendance}
//                     className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//                   >
//                     Fetch Student Data
//                   </button>
//                 </div>
//               )}

//             {error && (
//               <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
//                 {error}
//               </div>
//             )}
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-6">
//         <div className="container mx-auto px-4 text-center">
//           <p>© {new Date().getFullYear()} Student Mess Management System</p>
//           <p className="text-gray-400 text-sm mt-1">
//             Providing quality meals and service to students
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default StudentPublic;





// "use client"

// import { useContext, useEffect, useState, useCallback, lazy, Suspense, memo } from "react"
// import axios from "axios"
// import { Calendar, Bell, User, ThumbsUp, LogOut } from "lucide-react"
// import { StudentDataContext } from "../context/StudentContext"
// import { useNavigate } from "react-router-dom"
// import studentAxios from "../api/studentAxios"
// import {ErrorBoundary} from "react-error-boundary"
// import ErrorFallback from "../utils/ErrorBoundary.jsx"

// // Lazy load tab components
// const MenuTab = lazy(() => import("../components/tabs/MenuTab"))
// const NoticesTab = lazy(() => import("../components/tabs/NoticesTab"))
// const FeedbackTab = lazy(() => import("../components/tabs/FeedbackTab"))
// const AttendanceTab = lazy(() => import("../components/tabs/AttendanceTab"))

// axios.defaults.withCredentials = true

// // Loading fallback component
// const LoadingFallback = memo(() => (
//   <div className="flex justify-center items-center py-10">
//     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//     <span className="ml-3 text-lg text-gray-600">Loading...</span>
//   </div>
// ))

// function StudentPublic() {
//   const [activeTab, setActiveTab] = useState("menu")
//   const { student, setStudent } = useContext(StudentDataContext)
//   const navigate = useNavigate()

//   // Memoized logout handler
//   const handleLogout = useCallback(async () => {
//     try {
//       await studentAxios.get("/logout", {
//         withCredentials: true,
//       })

//       // Clear student context
//       setStudent(null)

//       // Remove any localStorage data related to student
//       localStorage.removeItem("student-data")

//       // Redirect to login/home
//       navigate("/")
//     } catch (error) {
//       console.error("Logout failed:", error.response?.data?.message || error.message)
//       alert("Logout failed. Please try again.")
//     }
//   }, [setStudent, navigate])

//   // Get student from storage if not in context
//   const getStudentFromStorage = useCallback(() => {
//     try {
//       const storedStudent = localStorage.getItem("student-data")
//       if (storedStudent) {
//         const parsedStudent = JSON.parse(storedStudent)
//         setStudent(parsedStudent)
//         return parsedStudent
//       }
//     } catch (error) {
//       console.error("Error getting student from storage:", error)
//     }
//     return null
//   }, [setStudent])

//   // Check for student data on initial load
//   useEffect(() => {
//     if (!student) {
//       getStudentFromStorage()
//     }
//   }, [student, getStudentFromStorage])

//   // Handle tab change
//   const handleTabChange = useCallback((tab) => {
//     setActiveTab(tab)
//   }, [])

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg relative">
//         <div className="container mx-auto px-4 py-6 flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold">Student Mess Portal</h1>
//             <p className="mt-1 text-blue-100">View menu, submit feedback, and check attendance</p>
//           </div>
//           <button
//             onClick={handleLogout}
//             className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
//           >
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </button>
//         </div>
//       </header>

//       {/* Navigation Tabs */}
//       <div className="bg-white shadow">
//         <div className="container mx-auto px-4">
//           <div className="flex overflow-x-auto">
//             <button
//               onClick={() => handleTabChange("menu")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "menu"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <Calendar className="mr-2 h-5 w-5" />
//               Today's Menu
//             </button>
//             <button
//               onClick={() => handleTabChange("notices")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "notices"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <Bell className="mr-2 h-5 w-5" />
//               Notice Board
//             </button>
//             <button
//               onClick={() => handleTabChange("feedback")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "feedback"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <ThumbsUp className="mr-2 h-5 w-5" />
//               Feedback
//             </button>
//             <button
//               onClick={() => handleTabChange("attendance")}
//               className={`flex items-center px-4 py-3 font-medium border-b-2 ${
//                 activeTab === "attendance"
//                   ? "border-blue-600 text-blue-600"
//                   : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
//               }`}
//             >
//               <User className="mr-2 h-5 w-5" />
//               Attendance
//             </button>
//           </div>
//         </div>
//       </div>


//       {/* Main Content */}
//       <main className="container mx-auto px-4 py-8 flex-grow">
//         <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
//           <Suspense fallback={<LoadingFallback />}>
//             {activeTab === "menu" && <MenuTab />}
//             {activeTab === "notices" && <NoticesTab />}
//             {activeTab === "feedback" && <FeedbackTab student={student} />}
//             {activeTab === "attendance" && (
//               <AttendanceTab student={student} getStudentFromStorage={getStudentFromStorage} />
//             )}
//           </Suspense>
//         </ErrorBoundary>

//       </main>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-6 mt-auto">
//         <div className="container mx-auto px-4 text-center">
//           <p>© {new Date().getFullYear()} Student Mess Management System</p>
//           <p className="text-gray-400 text-sm mt-1">Providing quality meals and service to students</p>
//         </div>
//       </footer>
//     </div>
//   )
// }

// export default StudentPublic

"use client"

import { useContext, useState, lazy, Suspense, memo } from "react"
import { Calendar, Bell, User, ThumbsUp, LogOut } from "lucide-react"
import { StudentDataContext } from "../context/StudentContext"
import { useNavigate } from "react-router-dom"
import studentAxios from "../api/studentAxios"
import { ErrorBoundary } from "react-error-boundary"
import ErrorFallback from "../utils/ErrorBoundary.jsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes default stale time
      retry: 1,
    },
  },
})

// Lazy load tab components
const MenuTab = lazy(() => import("../components/tabs/MenuTab"))
const NoticesTab = lazy(() => import("../components/tabs/NoticesTab"))
const FeedbackTab = lazy(() => import("../components/tabs/FeedbackTab"))
const AttendanceTab = lazy(() => import("../components/tabs/AttendanceTab"))

// Shimmer loading component (skeleton loader)
const ShimmerLoading = memo(() => (
  <div className="animate-pulse space-y-4">
    <div className="h-12 bg-gray-200 rounded-md w-3/4 mx-auto"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-gray-200 h-64 rounded-lg"></div>
      ))}
    </div>
  </div>
))

function StudentPublic() {
  const [activeTab, setActiveTab] = useState("menu")
  const { student, setStudent } = useContext(StudentDataContext)
  const navigate = useNavigate()

  // Logout handler
  const handleLogout = async () => {
    try {
      await studentAxios.get("/logout", {
        withCredentials: true,
      })

      // Clear student context
      setStudent(null)

      // Remove any localStorage data related to student
      localStorage.removeItem("student-data")

      // Redirect to login/home
      navigate("/")
    } catch (error) {
      console.error("Logout failed:", error.response?.data?.message || error.message)
      alert("Logout failed. Please try again.")
    }
  }

  // Get student from storage if not in context
  const getStudentFromStorage = () => {
    try {
      const storedStudent = localStorage.getItem("student-data")
      if (storedStudent) {
        const parsedStudent = JSON.parse(storedStudent)
        setStudent(parsedStudent)
        return parsedStudent
      }
    } catch (error) {
      console.error("Error getting student from storage:", error)
    }
    return null
  }

  // Check for student data on initial load
  useState(() => {
    if (!student) {
      getStudentFromStorage()
    }
  }, [])

  // Handle tab change
  const handleTabChange = (tab) => {
    // Prefetch data for the tab that's being activated
    if (tab === "menu") {
      queryClient.prefetchQuery({
        queryKey: ["menu"],
        queryFn: () => studentAxios.get("/display-menu").then((res) => res.data),
      })
    } else if (tab === "notices") {
      queryClient.prefetchQuery({
        queryKey: ["notices"],
        queryFn: () => studentAxios.get("/display-notices").then((res) => res.data),
      })
    } else if (tab === "attendance" && student) {
      queryClient.prefetchQuery({
        queryKey: ["attendance", student.reg_no, student.block_no],
        queryFn: () => studentAxios.get(`/student-stat/${student.reg_no}/${student.block_no}`).then((res) => res.data),
      })
    }

    setActiveTab(tab)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg relative">
          <div className="container mx-auto px-4 py-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Student Mess Portal</h1>
              <p className="mt-1 text-blue-100">View menu, submit feedback, and check attendance</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </button>
          </div>
        </header>

        {/* Navigation Tabs */}
        <div className="bg-white shadow">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              <button
                onClick={() => handleTabChange("menu")}
                className={`flex items-center px-4 py-3 font-medium border-b-2 ${
                  activeTab === "menu"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Today's Menu
              </button>
              <button
                onClick={() => handleTabChange("notices")}
                className={`flex items-center px-4 py-3 font-medium border-b-2 ${
                  activeTab === "notices"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Bell className="mr-2 h-5 w-5" />
                Notice Board
              </button>
              <button
                onClick={() => handleTabChange("feedback")}
                className={`flex items-center px-4 py-3 font-medium border-b-2 ${
                  activeTab === "feedback"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <ThumbsUp className="mr-2 h-5 w-5" />
                Feedback
              </button>
              <button
                onClick={() => handleTabChange("attendance")}
                className={`flex items-center px-4 py-3 font-medium border-b-2 ${
                  activeTab === "attendance"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <User className="mr-2 h-5 w-5" />
                Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 flex-grow">
          <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
            <Suspense fallback={<ShimmerLoading />}>
              {activeTab === "menu" && <MenuTab />}
              {activeTab === "notices" && <NoticesTab />}
              {activeTab === "feedback" && <FeedbackTab student={student} />}
              {activeTab === "attendance" && (
                <AttendanceTab getStudentFromStorage={getStudentFromStorage} />
              )}
            </Suspense>
          </ErrorBoundary>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p>© {new Date().getFullYear()} Student Mess Management System</p>
            <p className="text-gray-400 text-sm mt-1">Providing quality meals and service to students</p>
          </div>
        </footer>
      </div>
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default StudentPublic
