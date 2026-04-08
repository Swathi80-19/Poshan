import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  buildDailyData,
  createDefaultTrackingState,
  createId,
  defaultProfile,
  getLatestLoggedDay,
  PROFILE_NUMERIC_FIELDS,
  getTrackingSummary,
  toNumber,
} from '../lib/tracking'
import { applyEstimatedNutrition } from '../lib/nutrition'
import { getMemberTrackingStorageKey, MEMBER_SESSION_EVENT } from '../lib/session'

const TrackingContext = createContext(null)

function loadInitialState(storageKey) {
  if (typeof window === 'undefined') {
    return createDefaultTrackingState()
  }

  try {
    const savedValue = window.localStorage.getItem(storageKey)
    if (!savedValue) {
      return createDefaultTrackingState()
    }

    const parsedValue = JSON.parse(savedValue)
    const fallback = createDefaultTrackingState()

    return {
      profile: { ...defaultProfile, ...parsedValue.profile },
      foodEntries: Array.isArray(parsedValue.foodEntries) ? parsedValue.foodEntries : fallback.foodEntries,
      activityEntries: Array.isArray(parsedValue.activityEntries) ? parsedValue.activityEntries : fallback.activityEntries,
    }
  } catch {
    return createDefaultTrackingState()
  }
}

export function TrackingProvider({ children }) {
  const [storageKey, setStorageKey] = useState(() => getMemberTrackingStorageKey())
  const [trackingState, setTrackingState] = useState(() => loadInitialState(getMemberTrackingStorageKey()))

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const handleSessionChange = () => {
      setStorageKey(getMemberTrackingStorageKey())
    }

    window.addEventListener(MEMBER_SESSION_EVENT, handleSessionChange)
    return () => window.removeEventListener(MEMBER_SESSION_EVENT, handleSessionChange)
  }, [])

  useEffect(() => {
    setTrackingState(loadInitialState(storageKey))
  }, [storageKey])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(trackingState))
  }, [storageKey, trackingState])

  const updateProfile = (updates) => {
    setTrackingState((currentState) => ({
      ...currentState,
      profile: {
        ...currentState.profile,
        ...Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [
            key,
            PROFILE_NUMERIC_FIELDS.has(key) ? toNumber(value) : value,
          ]),
        ),
      },
    }))
  }

  const addFoodEntry = (entry) => {
    const normalizedEntry = applyEstimatedNutrition(entry)

    setTrackingState((currentState) => ({
      ...currentState,
      foodEntries: [
        {
          id: createId('food'),
          day: normalizedEntry.day,
          mealType: normalizedEntry.mealType,
          foodName: normalizedEntry.foodName.trim(),
          calories: toNumber(normalizedEntry.calories),
          protein: toNumber(normalizedEntry.protein),
          carbs: toNumber(normalizedEntry.carbs),
          fats: toNumber(normalizedEntry.fats),
          fiber: toNumber(normalizedEntry.fiber),
          loggedAt: new Date().toISOString(),
        },
        ...currentState.foodEntries,
      ],
    }))
  }

  const addActivityEntry = (entry) => {
    setTrackingState((currentState) => ({
      ...currentState,
      activityEntries: [
        {
          id: createId('activity'),
          day: entry.day,
          steps: toNumber(entry.steps),
          activeMinutes: toNumber(entry.activeMinutes),
          water: toNumber(entry.water),
          sleepHours: toNumber(entry.sleepHours),
          sleepQuality: toNumber(entry.sleepQuality),
          weight: toNumber(entry.weight),
          mood: entry.mood.trim(),
          notes: entry.notes.trim(),
          loggedAt: new Date().toISOString(),
        },
        ...currentState.activityEntries,
      ],
    }))
  }

  const derivedValue = useMemo(() => {
    const dailyData = buildDailyData(
      trackingState.foodEntries,
      trackingState.activityEntries,
      trackingState.profile,
    )

    return {
      ...trackingState,
      dailyData,
      latestDay: getLatestLoggedDay(dailyData),
      summary: getTrackingSummary(dailyData),
      updateProfile,
      addFoodEntry,
      addActivityEntry,
    }
  }, [trackingState])

  return <TrackingContext.Provider value={derivedValue}>{children}</TrackingContext.Provider>
}

export function useTracking() {
  const context = useContext(TrackingContext)

  if (!context) {
    throw new Error('useTracking must be used inside TrackingProvider')
  }

  return context
}
