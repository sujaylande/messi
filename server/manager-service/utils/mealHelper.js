// Meal slots
const MEAL_SLOTS = {
    breakfast: { start: "09:10", end: "15:11", cost: 50 },
    lunch:     { start: "15:12", end: "15:30", cost: 100 },
    snack:     { start: "14:31", end: "15:00", cost: 50 },
    dinner:    { start: "15:09", end: "23:09", cost: 100 },
  };
  
  // Helper: Get current meal slot
  module.exports.getCurrentMeal = () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM
  
    for (const [slot, { start, end, cost }] of Object.entries(MEAL_SLOTS)) {
      if (start <= currentTime && currentTime <= end) {
        return { slot, cost };
      }
    }
  
    return { slot: null, cost: 0 };
  }