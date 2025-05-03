import ShimmerEffect from "./ShimmerEffect"

const TableShimmer = ({ rows = 5, columns = 5 }) => {
  return (
    <div className="w-full">
      {/* Header shimmer */}
      <div className="flex w-full py-3 bg-gray-100">
        {Array(columns)
          .fill(0)
          .map((_, i) => (
            <div key={`header-${i}`} className="px-6 flex-1">
              <ShimmerEffect className="h-5 w-3/4" />
            </div>
          ))}
      </div>

      {/* Rows shimmer */}
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="flex w-full py-4 border-b border-gray-200">
            {Array(columns)
              .fill(0)
              .map((_, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="px-6 flex-1">
                  {colIndex === 0 ? (
                    <ShimmerEffect className="h-4 w-3/4" />
                  ) : (
                    <div className="flex justify-center">
                      <ShimmerEffect className="h-6 w-16 rounded-full" />
                    </div>
                  )}
                </div>
              ))}
          </div>
        ))}
    </div>
  )
}

export default TableShimmer
