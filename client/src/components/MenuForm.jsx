// import React, { useState, useRef } from "react";
// import axios from "axios";
// axios.defaults.withCredentials = true;


// export function MenuForm({ fetchMenu }) {
//   const [items, setItems] = useState("");
//   const [mealSlot, setMealSlot] = useState("Breakfast");
//   const [image, setImage] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef(null); // Reference for file input

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!items || !image || isSubmitting) return;

//     setIsSubmitting(true); // Disable button

//     const formData = new FormData();
//     formData.append("items", items);
//     formData.append("meal_slot", mealSlot);
//     formData.append("image", image);

//     try {
//       const response = await axios.post("http://localhost:5000/api/manager/add-menu", formData);

//       if (response.data.message) {
//         // alert(response.data.message);
//       } else if (response.data.error) {
//         alert(response.data.error);
//       }

//       // Reset form fields
//       setItems("");
//       setMealSlot("Breakfast");
//       setImage(null);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = ""; // Reset file input
//       }

//       // Fetch updated menu after successfully adding a new item
//       fetchMenu();
//     } catch (error) {
//       console.error("Error adding menu:", error);
//       alert("Failed to add menu.");
//     } finally {
//       setIsSubmitting(false); // Enable button
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Add Menu</h2>
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Enter menu items (comma-separated)"
//           value={items}
//           onChange={(e) => setItems(e.target.value)}
//           className="border rounded p-2"
//         />
//         <select
//           value={mealSlot}
//           onChange={(e) => setMealSlot(e.target.value)}
//           className="border rounded p-2"
//         >
//           <option value="Breakfast">Breakfast</option>
//           <option value="Lunch">Lunch</option>
//           <option value="Snack">Snack</option>
//           <option value="Dinner">Dinner</option>
//         </select>
//         <input
//           type="file"
//           ref={fileInputRef} // Attach ref to input
//           onChange={(e) => setImage(e.target.files[0])}
//           className="border rounded p-2"
//         />
//         <button
//           type="submit"
//           disabled={isSubmitting} // Disable when submitting
//           className={`bg-green-500 text-white px-4 py-2 rounded 
//           ${isSubmitting ? "bg-gray-400 cursor-not-allowed" : "hover:bg-green-600 active:bg-green-700 active:shadow-inner"} 
//           transition-colors duration-200`}
//         >
//           {isSubmitting ? "Adding..." : "Add Menu"}
//         </button>
//       </form>
//     </div>
//   );
// }


"use client"

import { useState, useRef, useCallback } from "react"
import axios from "axios"

axios.defaults.withCredentials = true

export function MenuForm({ fetchMenu }) {
  const [items, setItems] = useState("")
  const [mealSlot, setMealSlot] = useState("Breakfast")
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState("")

  const fileInputRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!items) {
      setError("Please enter menu items")
      return
    }

    if (!image) {
      setError("Please select an image")
      return
    }

    if (isSubmitting) return

    setIsSubmitting(true)
    setError("")

    const formData = new FormData()
    formData.append("items", items)
    formData.append("meal_slot", mealSlot)
    formData.append("image", image)

    try {
      const response = await axios.post("http://localhost:5000/api/manager/add-menu", formData)

      if (response.data.message) {
        // Success
      } else if (response.data.error) {
        setError(response.data.error)
      }

      // Reset form fields
      setItems("")
      setMealSlot("Breakfast")
      setImage(null)
      setImagePreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      // Fetch updated menu
      fetchMenu()
    } catch (error) {
      console.error("Error adding menu:", error)
      setError("Failed to add menu. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files[0])
    }
  }, [])

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files[0])
    }
  }

  const handleFiles = (file) => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"]

    if (!validTypes.includes(file.type)) {
      setError("Please upload only JPG, JPEG or PNG images")
      return
    }

    setError("")
    setImage(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const onButtonClick = () => {
    fileInputRef.current.click()
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Menu Item</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="items" className="block text-sm font-medium text-gray-700 mb-1">
            Menu Items (comma-separated)
          </label>
          <input
            id="items"
            type="text"
            placeholder="E.g. Rice, Beans, Chicken"
            value={items}
            onChange={(e) => setItems(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div>
          <label htmlFor="mealSlot" className="block text-sm font-medium text-gray-700 mb-1">
            Meal Slot
          </label>
          <select
            id="mealSlot"
            value={mealSlot}
            onChange={(e) => setMealSlot(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snack">Snack</option>
            <option value="Dinner">Dinner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Menu Image</label>

          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              dragActive ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-green-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={onButtonClick}
          >
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleChange} className="hidden" />

            {imagePreview ? (
              <div className="space-y-3">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="mx-auto h-48 object-contain rounded-md"
                />
                <p className="text-sm text-gray-500">Click or drag to change image</p>
              </div>
            ) : (
              <div className="space-y-2">
                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-gray-500">Drag and drop an image here, or click to select</p>
                <p className="text-xs text-gray-400">JPG, JPEG, PNG only</p>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors ${
            isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:bg-green-800"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
              Adding...
            </span>
          ) : (
            "Add Menu Item"
          )}
        </button>
      </form>
    </div>
  )
}
