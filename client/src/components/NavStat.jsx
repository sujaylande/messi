
import { Menu, X, Home, Calendar, Users, Bell, BarChart2 } from "lucide-react"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { ManagerDataContext } from '../context/ManagerContext'


const NavStat = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
      const { manager, setManager } = React.useContext(ManagerDataContext)
    
    return (
        <nav className="bg-white shadow-md border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              {/* <Home className="h-8 w-8 text-blue-600" /> */}
              {/* <h1 className="ml-2 text-xl font-bold text-gray-900">{manager?.mess_name}</h1> */}
              <Link
              to="/homepage"
              className="ml-2 text-xl font-bold text-gray-900 hover:bg-blue-50"
            >
              {manager?.mess_name}
            </Link>
            </div>
    
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/mess-stat"
              className="text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Mess Statistics
            </Link>
              <Link
                to="/student-stat"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Home className="mr-1 h-4 w-4" />
                Student Statistics
              </Link>
              <Link
                to="/menu"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Calendar className="mr-1 h-4 w-4" />
                Menu
              </Link>
              <Link
                to="/feedback"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Users className="mr-1 h-4 w-4" />
                Feedback
              </Link>
              <Link
                to="/notice-board"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <Bell className="mr-1 h-4 w-4" />
                Notice Board
              </Link>
            </div>
    
            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-500 hover:bg-blue-50 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
    
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/student-stat"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Home className="mr-2 h-5 w-5" />
                Student Statistics
              </Link>
              <Link
                to="/menu"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Menu
              </Link>
              <Link
                to="/feedback"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Users className="mr-2 h-5 w-5" />
                Feedback
              </Link>
              <Link
                to="/notice-board"
                className="flex items-center text-gray-700 hover:bg-blue-50 hover:text-blue-700 block px-3 py-2 rounded-md text-base font-medium"
              >
                <Bell className="mr-2 h-5 w-5" />
                Notice Board
              </Link>
            </div>
          </div>
        )}
      </nav>
    )
}


export default NavStat