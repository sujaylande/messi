import { Users } from "lucide-react"

const StudentStats = ({ studentStats, isLoading }) => {
  const totalStudents = studentStats.active + studentStats.inactive

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-800">
        <h3 className="text-lg font-medium text-white flex items-center">
          <Users className="mr-2 h-5 w-5" />
          Student Statistics
        </h3>
      </div>

      <div className="px-4 py-5 sm:p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="mt-2 grid grid-cols-2 gap-4 text-center">
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Active</p>
                <p className="text-2xl font-bold text-green-600">{studentStats.active}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-2xl font-bold text-red-600">{studentStats.inactive}</p>
              </div>
              <div className="col-span-2 bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Total Students</p>
                <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default StudentStats
