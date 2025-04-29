// import { useState, useEffect } from "react";
// import axios from "axios";
// import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
// axios.defaults.withCredentials = true;
// import managerAxios from '../api/managerAxios'


// const COLORS = ["#FF5733", "#FFC300", "#FF5733", "#33FF57", "#3380FF"];

// export default function FeedbackPie() {
//     const [feedbackData, setFeedbackData] = useState([]);

//     useEffect(() => {
//         managerAxios.get("/feedback-stats")
//             .then(response => {
//                 setFeedbackData(response.data);
//             })
//             .catch(error => {
//                 console.error("Error fetching feedback stats:", error);
//             });
//     }, []);

//     const renderPieChart = (mealType, ratingType, ratingKey) => {
//         const mealFeedback = feedbackData.find((data) => data.meal_type === mealType);
//         if (!mealFeedback) return null;

//         const totalFeedback = mealFeedback.feedback_count;

//         const pieData = [
//             { name: "1 Star", value: (mealFeedback[`count_${ratingKey}_1`] || 0), color: COLORS[0] },
//             { name: "2 Star", value: (mealFeedback[`count_${ratingKey}_2`] || 0), color: COLORS[1] },
//             { name: "3 Star", value: (mealFeedback[`count_${ratingKey}_3`] || 0), color: COLORS[2] },
//             { name: "4 Star", value: (mealFeedback[`count_${ratingKey}_4`] || 0), color: COLORS[3] },
//             { name: "5 Star", value: (mealFeedback[`count_${ratingKey}_5`] || 0), color: COLORS[4] },
//         ];

//         return (
//             <div className="w-full md:w-1/2 p-4">
//                 <h3 className="text-lg font-bold text-center mb-2">{mealType} - {ratingType}</h3>
//                 <div className="h-64">
//                     <ResponsiveContainer width="100%" height="100%">
//                         <PieChart>
//                             <Pie
//                                 data={pieData}
//                                 cx="50%"
//                                 cy="50%"
//                                 innerRadius={60}
//                                 outerRadius={80}
//                                 paddingAngle={5}
//                                 dataKey="value"
//                                 label={({ name, value }) => `${name}: ${value}`}
//                             >
//                                 {pieData.map((entry, index) => (
//                                     <Cell key={`cell-${index}`} fill={entry.color} />
//                                 ))}
//                             </Pie>
//                             <Tooltip />
//                             <Legend />
//                         </PieChart>
//                     </ResponsiveContainer>
//                 </div>
//             </div>
//         );
//     };

//     return (
//         <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
//             <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Feedback Statistics (Today)</h2>
//             <div className="flex flex-wrap">
//                 {["Breakfast", "Lunch", "Snack", "Dinner"].map((mealType) => (
//                     <div key={mealType} className="w-full md:w-1/2 p-4">
//                         {renderPieChart(mealType, "Taste Rating", "taste")}
//                         {renderPieChart(mealType, "Hygiene Rating", "hygiene")}
//                         {renderPieChart(mealType, "Quantity Rating", "quantity")}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }
