// import { useEffect, useState } from "react";
// import axios from "axios";
// import { MenuForm } from "../components/MenuForm";
// import { MenuBoard } from "../components/MenuBoard";
// axios.defaults.withCredentials = true;


// function Menu() {
//     const [menu, setMenu] = useState([]);

//     useEffect(() => {
//         fetchMenu();
//     }, []);

//     const fetchMenu = async () => {
//         const res = await axios.get("http://localhost:5000/api/manager/display-menu");
//         setMenu(res.data);
//     };

//     return (
//         <>
//             <MenuForm fetchMenu={fetchMenu} />
//             <MenuBoard menu={menu} />
//         </>
//     );
// }

// export default Menu;


"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { MenuForm } from "../components/MenuForm"
import { MenuBoard } from "../components/MenuBoard"

axios.defaults.withCredentials = true

function Menu() {
  const [menu, setMenu] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMenu()
  }, [])

  const fetchMenu = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get("http://localhost:5000/api/manager/display-menu")
      setMenu(res.data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch menu:", err)
      setError("Failed to load menu. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Meal Management System</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <MenuForm fetchMenu={fetchMenu} />

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>
          ) : (
            <MenuBoard menu={menu} />
          )}
        </div>
      </div>
    </div>
  )
}

export default Menu
