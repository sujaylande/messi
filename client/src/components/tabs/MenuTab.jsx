"use client"

import { useState, useEffect, memo } from "react"
import axios from "axios"
import { Coffee, Utensils, Clock, Moon } from "lucide-react"
import studentAxios from "../../api/studentAxios"

// Memoized menu item component for better performance
const MenuItem = memo(({ item }) => {
  // Get meal icon based on meal type
  const getMealIcon = (mealType) => {
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return <Coffee className="h-5 w-5" />
      case "lunch":
        return <Utensils className="h-5 w-5" />
      case "snack":
        return <Clock className="h-5 w-5" />
      case "dinner":
        return <Moon className="h-5 w-5" />
      default:
        return <Utensils className="h-5 w-5" />
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-56 overflow-hidden">
        <img src={item.img_url || "/placeholder.svg"} alt={item.meal_slot} className="w-full h-full object-cover" />
        <div className="absolute top-0 right-0 bg-blue-600 text-white px-3 py-1 rounded-bl-lg">{item.meal_slot}</div>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          {getMealIcon(item.meal_slot)}
          <h3 className="ml-2 text-lg font-semibold text-gray-800">{item.meal_slot}</h3>
        </div>
        <p className="text-gray-600">{item.items}</p>
      </div>
    </div>
  )
})

function MenuTab() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true)
        const res = await studentAxios.get("/display-menu")
        setMenu(res.data)
      } catch (error) {
        console.error("Error fetching menu:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenu()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {menu.length > 0 ? (
        menu.map((item) => <MenuItem key={item.id} item={item} />)
      ) : (
        <div className="col-span-full flex justify-center items-center h-64">
          <p className="text-gray-500">No menu items available for today.</p>
        </div>
      )}
    </div>
  )
}

export default MenuTab
