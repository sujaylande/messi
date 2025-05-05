import { TrendingUp, Coffee, Utensils, Cookie, Moon } from "lucide-react"

const ForecastTable = ({ forecast, isLoading }) => {
  console.log("Forecast data:", forecast)
  // Helper function to get next 7 days
  const getNext7Days = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const todayIndex = new Date().getDay()

    return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)].slice(0, 7)
  }

  // Get meal icon
  const getMealIcon = (meal) => {
    switch (meal) {
      case "breakfast":
      case "Breakfast":
        return <Coffee className="inline h-4 w-4 mr-1" />
      case "lunch":
      case "Lunch":
        return <Utensils className="inline h-4 w-4 mr-1" />
      case "snack":
      case "Snack":
        return <Cookie className="inline h-4 w-4 mr-1" />
      case "dinner":
      case "Dinner":
        return <Moon className="inline h-4 w-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600">
        <h2 className="text-xl font-bold text-white flex items-center">
          <TrendingUp className="mr-2 h-5 w-5" />
          Predicted Attendance
        </h2>
      </div>
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : forecast && Object.keys(forecast).length > 0 ? (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm leading-normal">
                <th className="py-3 px-6 text-left">Meal</th>
                {getNext7Days().map((day, index) => (
                  <th key={index} className="py-3 px-6 text-center">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm">
              {Object.entries(forecast).map(([meal, values], index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 text-left font-medium flex items-center">
                    {getMealIcon(meal)} {meal}
                  </td>
                  {values.slice(0, 7).map((value, idx) => (
                    <td key={idx} className="py-3 px-6 text-center">
                      <span
                        className={`py-1 px-3 rounded-full text-xs ${
                          meal === "Breakfast"
                            ? "bg-blue-100 text-blue-800"
                            : meal === "Lunch"
                              ? "bg-green-100 text-green-800"
                              : meal === "Snack"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {Math.round(value) > 0 ? Math.round(value) : 0}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-4 text-center text-gray-500">No forecast data available</div>
        )}
      </div>
    </div>
  )
}

export default ForecastTable
