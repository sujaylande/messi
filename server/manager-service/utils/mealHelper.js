// Meal slots
const MEAL_SLOTS = {
    breakfast: { start: "08:00", end: "11:59", cost: 50 },
    lunch:     { start: "12:00", end: "14:30", cost: 100 },
    snack:     { start: "14:31", end: "18:00", cost: 50 },
    dinner:    { start: "19:30", end: "23:00", cost: 100 },
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