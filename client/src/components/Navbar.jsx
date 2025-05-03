"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, User, LogOut, Settings, ChevronDown, Bell, Home, BarChart2, Users } from "lucide-react"

const Navbar = ({ manager, onLogout }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleProfile = () => setIsProfileOpen(!isProfileOpen)
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Mess Name */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-900">{manager?.mess_name || "Mess Management"}</h1>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              Dashboard
            </Link>
            <Link
              to="/mess-stat"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              Mess Statistics
            </Link>
            <Link
              to="/students"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <Users className="h-4 w-4 mr-1" />
              Students
            </Link>

            {/* Notification Bell */}
            <button className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md">
              <Bell className="h-5 w-5" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative ml-3">
              <button
                onClick={toggleProfile}
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                  <User className="h-5 w-5" />
                </div>
                <span className="ml-2">{manager?.name || "Manager"}</span>
                <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{manager?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{manager?.email}</p>
                  </div>
                  <div className="py-1">
                    <p className="px-4 py-2 text-sm text-gray-700">Block: {manager?.block_no}</p>
                    <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={onLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Dashboard
            </Link>
            <Link
              to="/mess-stat"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Mess Statistics
            </Link>
            <Link
              to="/students"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Students
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{manager?.name}</div>
                <div className="text-sm font-medium text-gray-500">Block: {manager?.block_no}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                to="/profile"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                Profile Settings
              </Link>
              <button
                onClick={onLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
