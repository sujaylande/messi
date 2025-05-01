// A utility to manage cache expiration times for different data types
const cacheManager = {
    // Cache expiration times in milliseconds
    expirationTimes: {
      menu: 1000 * 60 * 60 * 6, // 6 hours (updates ~4 times/day)
      notices: 1000 * 60 * 1, // 1 minute (can update anytime)
      attendance: 1000 * 60 * 60 * 6, // 6 hours (updates ~4 times/day)
      feedback: Number.POSITIVE_INFINITY, // Never expires (submitted once)
    },
  
    // Get the appropriate stale time for a data type
    getStaleTime(dataType) {
      return this.expirationTimes[dataType] || 0
    },
  
    // Check if cached data is still valid
    isDataValid(dataType, timestamp) {
      if (!timestamp) return false
  
      const expirationTime = this.expirationTimes[dataType]
      if (expirationTime === Number.POSITIVE_INFINITY) return true
  
      const now = Date.now()
      return now - timestamp < expirationTime
    },
  }
  
  export default cacheManager
  