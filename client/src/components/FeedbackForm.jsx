import { useState } from "react";
import axios from "axios";

const FeedbackForm = () => {
    const [formData, setFormData] = useState({
        reg_no: "",
        meal_type: "Breakfast",
        taste: 3,
        hygiene: 3,
        quantity: 3,
        want_change: false,
        comments: "",
    });



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/manager/feedback-form", formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("manager-token")}`,
                },
            });
            alert(response.data.message);

            setFormData({
                reg_no: "",
                meal_type: "Breakfast",
                taste: 3,
                hygiene: 3,
                quantity: 3,
                want_change: false,
                comments: "",
            });
            
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Failed to submit feedback.");
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-4 p-4 bg-white shadow-lg rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Submit Meal Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="number"
                    name="reg_no"
                    placeholder="Student ID"
                    className="w-full p-2 border rounded"
                    value={formData.reg_no}
                    onChange={handleChange}
                    required
                />
                <label className="block">
                    <span className="text-gray-700">Meal Type:</span>
                    <select
                        name="meal_type"
                        className="w-full p-2 border rounded"
                        value={formData.meal_type}
                        onChange={handleChange}
                    >
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Snack</option>
                        <option value="Dinner">Dinner</option>
                    </select>
                </label>

                <label className="block">
                    <span className="text-gray-700">Taste (1-5):</span>
                    <input
                        type="number"
                        name="taste"
                        min="1"
                        max="5"
                        className="w-full p-2 border rounded"
                        value={formData.taste}
                        onChange={handleChange}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Hygiene (1-5):</span>
                    <input
                        type="number"
                        name="hygiene"
                        min="1"
                        max="5"
                        className="w-full p-2 border rounded"
                        value={formData.hygiene}
                        onChange={handleChange}
                    />
                </label>

                <label className="block">
                    <span className="text-gray-700">Quantity (1-5):</span>
                    <input
                        type="number"
                        name="quantity"
                        min="1"
                        max="5"
                        className="w-full p-2 border rounded"
                        value={formData.quantity}
                        onChange={handleChange}
                    />
                </label>

                <label className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        name="want_change"
                        className="h-5 w-5"
                        checked={formData.want_change}
                        onChange={handleChange}
                    />
                    <span>Do you want a change in this meal?</span>
                </label>

                <textarea
                    name="comments"
                    placeholder="Additional comments (optional)"
                    className="w-full p-2 border rounded"
                    value={formData.comments}
                    onChange={handleChange}
                ></textarea>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                >
                    Submit Feedback
                </button>
            </form>
        </div>
    );
};

export default FeedbackForm;
