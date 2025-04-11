import { useState, useEffect } from "react";
import axios from "axios";
axios.defaults.withCredentials = true;


export default function FeedbackInsights() {
    const [negativeComments, setNegativeComments] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/manager/negative-feedback")
            .then(response => {
                setNegativeComments(response.data);
            })
            .catch(error => {
                console.error("Error fetching feedback:", error);
            });
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Top Negative Comments from today's feedback form</h2>
            <ul className="space-y-4">
                {negativeComments.length > 0 ? (
                    negativeComments.map((comment, index) => (
                        <li key={index} className="p-4 bg-red-100 rounded-lg">
                            <p className="text-gray-700">{comment.comment}</p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-600">No negative feedback found.</p>
                )}
            </ul>
        </div>
    );
}
