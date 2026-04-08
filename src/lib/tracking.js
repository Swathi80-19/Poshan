export const DAY_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
export const MEAL_OPTIONS = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
export const STORAGE_KEY = 'poshan_tracking_v2_guest'

export const defaultProfile = {
  age: 0,
  gender: '',
  heightCm: 0,
  currentWeightKg: 0,
  targetWeightKg: 0,
  activityLevel: '',
  goalFocus: '',
  calorieGoal: 1500,
  proteinGoal: 92,
  carbsGoal: 220,
  fatsGoal: 60,
  fiberGoal: 28,
  waterGoal: 2000,
  stepGoal: 8000,
  activeMinutesGoal: 45,
  sleepGoal: 8,
}

export const PROFILE_NUMERIC_FIELDS = new Set([
  'age',
  'heightCm',
  'currentWeightKg',
  'targetWeightKg',
  'calorieGoal',
  'proteinGoal',
  'carbsGoal',
  'fatsGoal',
  'fiberGoal',
  'waterGoal',
  'stepGoal',
  'activeMinutesGoal',
  'sleepGoal',
])

export function toNumber(value) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export function round(value, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

export function average(values) {
  const validValues = values.filter((value) => Number.isFinite(value))
  if (!validValues.length) return 0
  return validValues.reduce((sum, value) => sum + value, 0) / validValues.length
}

export function createDefaultTrackingState() {
  return {
    profile: defaultProfile,
    foodEntries: [],
    activityEntries: [],
  }
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function getTodayLabel() {
  const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(new Date())
  return DAY_ORDER.includes(dayName) ? dayName : 'Sun'
}

function lastValue(values) {
  for (let index = values.length - 1; index >= 0; index -= 1) {
    if (values[index] !== null && values[index] !== undefined) {
      return values[index]
    }
  }
  return null
}

function ratio(value, goal) {
  if (!goal) return 1
  return Math.max(0, Math.min(value / goal, 1))
}

function calorieAccuracy(value, goal) {
  if (!goal) return 1
  const difference = Math.abs(goal - value)
  return Math.max(0, 1 - difference / goal)
}

function buildDailyNutrition(foodEntries) {
  return DAY_ORDER.map((day) => {
    const items = foodEntries.filter((entry) => entry.day === day)
    return {
      day,
      meals: items.length,
      calories: items.reduce((sum, entry) => sum + toNumber(entry.calories), 0),
      protein: items.reduce((sum, entry) => sum + toNumber(entry.protein), 0),
      carbs: items.reduce((sum, entry) => sum + toNumber(entry.carbs), 0),
      fats: items.reduce((sum, entry) => sum + toNumber(entry.fats), 0),
      fiber: items.reduce((sum, entry) => sum + toNumber(entry.fiber), 0),
    }
  })
}

function buildDailyActivity(activityEntries) {
  return DAY_ORDER.map((day) => {
    const items = activityEntries.filter((entry) => entry.day === day)
    return {
      day,
      checkIns: items.length,
      steps: items.reduce((sum, entry) => sum + toNumber(entry.steps), 0),
      activeMinutes: items.reduce((sum, entry) => sum + toNumber(entry.activeMinutes), 0),
      water: items.reduce((sum, entry) => sum + toNumber(entry.water), 0),
      sleepHours: round(average(items.map((entry) => (toNumber(entry.sleepHours) > 0 ? toNumber(entry.sleepHours) : NaN))), 1),
      sleepQuality: round(average(items.map((entry) => (toNumber(entry.sleepQuality) > 0 ? toNumber(entry.sleepQuality) : NaN)))),
      weight: lastValue(items.map((entry) => (toNumber(entry.weight) > 0 ? toNumber(entry.weight) : null))),
    }
  })
}

export function buildDailyData(foodEntries = [], activityEntries = [], profile = defaultProfile) {
  const nutrition = buildDailyNutrition(foodEntries)
  const activity = buildDailyActivity(activityEntries)

  return DAY_ORDER.map((day, index) => {
    const dayNutrition = nutrition[index]
    const dayActivity = activity[index]
    const adherenceScore = average([
      calorieAccuracy(dayNutrition.calories, profile.calorieGoal),
      ratio(dayNutrition.protein, profile.proteinGoal),
      ratio(dayNutrition.fiber, profile.fiberGoal),
      ratio(dayActivity.water, profile.waterGoal),
      average([
        ratio(dayActivity.activeMinutes, profile.activeMinutesGoal),
        ratio(dayActivity.steps, profile.stepGoal),
      ]),
      average([
        ratio(dayActivity.sleepHours, profile.sleepGoal),
        ratio(dayActivity.sleepQuality, 100),
      ]),
    ])

    return {
      day,
      ...dayNutrition,
      ...dayActivity,
      goal: profile.calorieGoal,
      deficit: profile.calorieGoal - dayNutrition.calories,
      adherence: round(adherenceScore * 100),
    }
  })
}

export function getLatestLoggedDay(dailyData) {
  for (let index = dailyData.length - 1; index >= 0; index -= 1) {
    const day = dailyData[index]
    if (day.meals || day.checkIns) {
      return day.day
    }
  }
  return getTodayLabel()
}

export function getDaySnapshot(dailyData, dayLabel) {
  return dailyData.find((item) => item.day === dayLabel) ?? dailyData[dailyData.length - 1]
}

export function getMacroTotals(foodEntries) {
  return {
    protein: foodEntries.reduce((sum, entry) => sum + toNumber(entry.protein), 0),
    carbs: foodEntries.reduce((sum, entry) => sum + toNumber(entry.carbs), 0),
    fats: foodEntries.reduce((sum, entry) => sum + toNumber(entry.fats), 0),
    fiber: foodEntries.reduce((sum, entry) => sum + toNumber(entry.fiber), 0),
  }
}

export function getTrackingSummary(dailyData) {
  const activeDays = dailyData.filter((day) => day.activeMinutes > 0 || day.steps > 0).length
  const daysWithCalories = dailyData.filter((day) => day.calories > 0)
  const daysWithWeight = dailyData.filter((day) => day.weight !== null)
  const latestWeight = daysWithWeight.length ? daysWithWeight[daysWithWeight.length - 1].weight : 0

  return {
    averageCalories: round(average(daysWithCalories.map((day) => day.calories))),
    averageHydration: round(average(dailyData.map((day) => day.water))),
    averageSteps: round(average(dailyData.map((day) => day.steps))),
    averageSleep: round(average(dailyData.map((day) => day.sleepHours)), 1),
    averageAdherence: round(average(dailyData.map((day) => day.adherence))),
    activeDays,
    latestWeight,
  }
}

export function getWeightTrend(dailyData) {
  let previousWeight = null

  return dailyData.map((day, index) => {
    if (day.weight !== null) {
      previousWeight = day.weight
    }

    return {
      week: `W${index + 1}`,
      day: day.day,
      kg: previousWeight,
    }
  })
}

export function formatDateTime(value) {
  const date = new Date(value)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}
