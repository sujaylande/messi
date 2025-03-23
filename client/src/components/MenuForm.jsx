import React, { useState, useRef } from "react";
import axios from "axios";

export function MenuForm({ fetchMenu }) {
  const [items, setItems] = useState("");
  const [mealSlot, setMealSlot] = useState("Breakfast");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null); // Reference for file input

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!items || !image || isSubmitting) return;

    setIsSubmitting(true); // Disable button

    const formData = new FormData();
    formData.append("items", items);
    formData.append("meal_slot", mealSlot);
    formData.append("image", image);

    try {
      const response = await axios.post("http://localhost:5000/api/manager/add-menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.message) {
        // alert(response.data.message);
      } else if (response.data.error) {
        alert(response.data.error);
      }

      // Reset form fields
      setItems("");
      setMealSlot("Breakfast");
      setImage(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
      }

      // Fetch updated menu after successfully adding a new item
      fetchMenu();
    } catch (error) {
      console.error("Error adding menu:", error);
      alert("Failed to add menu.");
    } finally {
      setIsSubmitting(false); // Enable button
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Menu</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Enter menu items (comma-separated)"
          value={items}
          onChange={(e) => setItems(e.target.value)}
          className="border rounded p-2"
        />
        <select
          value={mealSlot}
          onChange={(e) => setMealSlot(e.target.value)}
          className="border rounded p-2"
        >
          <option value="Breakfast">Breakfast</option>
          <option value="Lunch">Lunch</option>
          <option value="Snack">Snack</option>
          <option value="Dinner">Dinner</option>
        </select>
        <input
          type="file"
          ref={fileInputRef} // Attach ref to input
          onChange={(e) => setImage(e.target.files[0])}
          className="border rounded p-2"
        />
        <button
          type="submit"
          disabled={isSubmitting} // Disable when submitting
          className={`bg-green-500 text-white px-4 py-2 rounded 
          ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-green-600 active:bg-green-700 active:shadow-inner"} 
          transition-colors duration-200`}
        >
          {isSubmitting ? "Adding..." : "Add Menu"}
        </button>
      </form>
    </div>
  );
}
