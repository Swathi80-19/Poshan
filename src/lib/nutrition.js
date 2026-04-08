const FOOD_LIBRARY = [
  { keywords: ['oats'], calories: 150, protein: 5, carbs: 27, fats: 3, fiber: 4 },
  { keywords: ['banana'], calories: 105, protein: 1, carbs: 27, fats: 0, fiber: 3 },
  { keywords: ['paneer'], calories: 265, protein: 18, carbs: 6, fats: 20, fiber: 0 },
  { keywords: ['roti', 'chapati'], calories: 120, protein: 4, carbs: 24, fats: 1, fiber: 3 },
  { keywords: ['dal'], calories: 180, protein: 9, carbs: 24, fats: 4, fiber: 7 },
  { keywords: ['rice', 'brown rice'], calories: 205, protein: 4, carbs: 45, fats: 1, fiber: 1 },
  { keywords: ['idli'], calories: 75, protein: 2, carbs: 15, fats: 0, fiber: 1 },
  { keywords: ['sambar'], calories: 95, protein: 4, carbs: 13, fats: 2, fiber: 3 },
  { keywords: ['dosa'], calories: 168, protein: 4, carbs: 28, fats: 4, fiber: 1 },
  { keywords: ['poha'], calories: 250, protein: 5, carbs: 45, fats: 5, fiber: 3 },
  { keywords: ['upma'], calories: 220, protein: 6, carbs: 34, fats: 7, fiber: 3 },
  { keywords: ['egg'], calories: 78, protein: 6, carbs: 1, fats: 5, fiber: 0 },
  { keywords: ['chicken'], calories: 165, protein: 31, carbs: 0, fats: 4, fiber: 0 },
  { keywords: ['fish'], calories: 180, protein: 24, carbs: 0, fats: 8, fiber: 0 },
  { keywords: ['curd', 'yogurt'], calories: 98, protein: 5, carbs: 7, fats: 4, fiber: 0 },
  { keywords: ['greek yogurt'], calories: 120, protein: 10, carbs: 4, fats: 5, fiber: 0 },
  { keywords: ['milk'], calories: 122, protein: 8, carbs: 12, fats: 5, fiber: 0 },
  { keywords: ['apple'], calories: 95, protein: 0, carbs: 25, fats: 0, fiber: 4 },
  { keywords: ['nuts'], calories: 172, protein: 6, carbs: 6, fats: 15, fiber: 3 },
  { keywords: ['fruit'], calories: 85, protein: 1, carbs: 21, fats: 0, fiber: 3 },
  { keywords: ['salad'], calories: 60, protein: 2, carbs: 10, fats: 1, fiber: 3 },
  { keywords: ['vegetable', 'vegetables', 'veggies', 'greens'], calories: 80, protein: 3, carbs: 14, fats: 2, fiber: 4 },
  { keywords: ['chana'], calories: 130, protein: 6, carbs: 18, fats: 3, fiber: 5 },
  { keywords: ['khichdi'], calories: 220, protein: 8, carbs: 35, fats: 5, fiber: 4 },
  { keywords: ['millet'], calories: 180, protein: 5, carbs: 36, fats: 2, fiber: 3 },
  { keywords: ['pulao'], calories: 320, protein: 6, carbs: 52, fats: 9, fiber: 3 },
  { keywords: ['wrap'], calories: 180, protein: 6, carbs: 28, fats: 5, fiber: 2 },
  { keywords: ['sandwich'], calories: 240, protein: 10, carbs: 28, fats: 9, fiber: 3 },
  { keywords: ['smoothie'], calories: 210, protein: 8, carbs: 32, fats: 5, fiber: 4 },
  { keywords: ['tofu'], calories: 140, protein: 15, carbs: 3, fats: 8, fiber: 2 },
]

const MEAL_FALLBACKS = {
  Breakfast: { calories: 280, protein: 9, carbs: 38, fats: 9, fiber: 4 },
  Lunch: { calories: 420, protein: 18, carbs: 48, fats: 14, fiber: 7 },
  Dinner: { calories: 460, protein: 20, carbs: 42, fats: 16, fiber: 6 },
  Snack: { calories: 180, protein: 6, carbs: 20, fats: 7, fiber: 3 },
}

function round(value, digits = 0) {
  const factor = 10 ** digits
  return Math.round(value * factor) / factor
}

function tokenizeFoodName(foodName) {
  return foodName
    .toLowerCase()
    .replace(/[^a-z0-9\s,]/g, ' ')
    .split(/(?:,|and|\s+)/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function matchFoodProfile(foodName) {
  const lowered = foodName.toLowerCase()
  const tokens = tokenizeFoodName(foodName)

  return FOOD_LIBRARY.filter((item) =>
    item.keywords.some((keyword) => lowered.includes(keyword) || tokens.includes(keyword)),
  )
}

export function estimateNutritionFromFoodName(foodName, mealType = 'Lunch') {
  const cleanedName = foodName.trim()

  if (!cleanedName) {
    return {
      calories: 0,
      protein: 0,
      carbs: 0,
      fats: 0,
      fiber: 0,
      confidence: 'empty',
      note: 'Enter a food name to generate an estimate.',
    }
  }

  const matches = matchFoodProfile(cleanedName)
  const base = matches.length
    ? matches.reduce(
        (sum, item) => ({
          calories: sum.calories + item.calories,
          protein: sum.protein + item.protein,
          carbs: sum.carbs + item.carbs,
          fats: sum.fats + item.fats,
          fiber: sum.fiber + item.fiber,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0 },
      )
    : MEAL_FALLBACKS[mealType] || MEAL_FALLBACKS.Lunch

  return {
    calories: round(base.calories),
    protein: round(base.protein),
    carbs: round(base.carbs),
    fats: round(base.fats),
    fiber: round(base.fiber),
    confidence: matches.length ? 'matched' : 'fallback',
    note: matches.length
      ? `Estimated from common servings for ${matches.map((item) => item.keywords[0]).join(', ')}.`
      : `Estimated from a typical ${mealType.toLowerCase()} serving.`,
  }
}

export function applyEstimatedNutrition(entry) {
  const estimate = estimateNutritionFromFoodName(entry.foodName || '', entry.mealType)

  return {
    ...entry,
    calories: Number(entry.calories) > 0 ? entry.calories : estimate.calories,
    protein: Number(entry.protein) > 0 ? entry.protein : estimate.protein,
    carbs: Number(entry.carbs) > 0 ? entry.carbs : estimate.carbs,
    fats: Number(entry.fats) > 0 ? entry.fats : estimate.fats,
    fiber: Number(entry.fiber) > 0 ? entry.fiber : estimate.fiber,
  }
}
