import { Coffee, Utensils, Cookie, Moon } from "lucide-react"

const ForecastTable = ({ forecast, isLoading }) => {
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

  // Get next 7 days
  const getNext7Days = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const todayIndex = new Date().getDay()

    return [...daysOfWeek.slice(todayIndex), ...daysOfWeek.slice(0, todayIndex)].slice(0, 7)
  }

  return (
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
        {isLoading ? (
          <tr>
            <td colSpan={8} className="py-4 text-center">
              Loading...
            </td>
          </tr>
        ) : Object.keys(forecast).length > 0 ? (
          Object.entries(forecast).map(([meal, values], index) => (
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
          ))
        ) : (
          <tr>
            <td colSpan={8} className="py-4 text-center">
              No forecast data available
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default ForecastTable
