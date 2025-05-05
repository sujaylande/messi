import { Link } from "react-router-dom"
import { ScanLine, UserPlus } from "lucide-react"

const ActionButtons = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
      <Link
        to="/scan"
        className="py-6 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg shadow-md transition-all duration-200"
      >
        <ScanLine className="mr-2 h-5 w-5" />
        Scan a Student
      </Link>

      <Link
        to="/register"
        className="py-6 text-lg flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg shadow-md transition-all duration-200"
      >
        <UserPlus className="mr-2 h-5 w-5" />
        Register a Student
      </Link>
    </div>
  )
}

export default ActionButtons
