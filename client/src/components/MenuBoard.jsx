// export function MenuBoard({ menu }) {
//   return (
//       <div className="max-w-lg mx-auto p-4 mt-4 bg-white shadow-md rounded-lg">
//           <h2 className="text-xl font-bold mb-4">Today's Menu</h2>
//           <ul>
//               {menu?.map((m) => (
//                   <li key={m.id} className="flex flex-col items-center p-2 border-b">
//                       <img src={m.img_url} alt="Menu" className="w-32 h-32 object-cover rounded" />
//                       <p className="font-semibold mt-2">{m.items}</p>
//                       <span className="text-sm text-gray-500">{m.meal_slot}</span>
//                   </li>
//               ))}
//           </ul>
//       </div>
//   );
// }

"use client"

import { useState } from "react"

function MenuBoard({ menu }) {
  const [selectedMealSlot, setSelectedMealSlot] = useState("All")

  const mealSlots = ["All", "Breakfast", "Lunch", "Snack", "Dinner"]

  const filteredMenu = selectedMealSlot === "All" ? menu : menu.filter((item) => item.meal_slot === selectedMealSlot)

  // if(Math.random() > 0.5){
  //   return new Error("Testing error boundary")
  // }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Today's Menu</h2>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {mealSlots.map((slot) => (
            <button
              key={slot}
              onClick={() => setSelectedMealSlot(slot)}
              className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                selectedMealSlot === slot
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {filteredMenu.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {selectedMealSlot === "All"
            ? "No menu items available yet."
            : `No ${selectedMealSlot.toLowerCase()} items available.`}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {filteredMenu.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={item.img_url || "/placeholder.svg"}
                  alt={item.items}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-1">
                      {item.items.split(",").map((i, index) => (
                        <span key={index}>
                          {index > 0 && <span className="text-gray-400 mx-1">•</span>}
                          {i.trim()}
                        </span>
                      ))}
                    </h3>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.meal_slot === "Breakfast"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.meal_slot === "Lunch"
                          ? "bg-green-100 text-green-800"
                          : item.meal_slot === "Snack"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {item.meal_slot}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MenuBoard