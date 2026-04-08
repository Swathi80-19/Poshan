import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  addActivityLog as addActivityLogRequest,
  addFoodLog as addFoodLogRequest,
  getActivityLogs,
  getFoodLogs,
  getMemberProfile,
  updateMemberProfile as updateMemberProfileRequest,
} from '../lib/memberApi'
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
import {
  getMemberSession,
  getMemberTrackingStorageKey,
  MEMBER_SESSION_EVENT,
} from '../lib/session'

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

function toProfileState(profile = {}) {
  return {
    ...defaultProfile,
    age: profile.age ?? defaultProfile.age,
    gender: profile.gender ?? defaultProfile.gender,
    heightCm: profile.heightCm ?? defaultProfile.heightCm,
    currentWeightKg: profile.currentWeightKg ?? defaultProfile.currentWeightKg,
    targetWeightKg: profile.targetWeightKg ?? defaultProfile.targetWeightKg,
    activityLevel: profile.activityLevel ?? defaultProfile.activityLevel,
    goalFocus: profile.goalFocus ?? defaultProfile.goalFocus,
    calorieGoal: profile.calorieGoal ?? defaultProfile.calorieGoal,
    proteinGoal: profile.proteinGoal ?? defaultProfile.proteinGoal,
    carbsGoal: profile.carbsGoal ?? defaultProfile.carbsGoal,
    fatsGoal: profile.fatsGoal ?? defaultProfile.fatsGoal,
    fiberGoal: profile.fiberGoal ?? defaultProfile.fiberGoal,
    waterGoal: profile.waterGoal ?? defaultProfile.waterGoal,
    stepGoal: profile.stepGoal ?? defaultProfile.stepGoal,
    activeMinutesGoal: profile.activeMinutesGoal ?? defaultProfile.activeMinutesGoal,
    sleepGoal: profile.sleepGoal ?? defaultProfile.sleepGoal,
  }
}

function hasMeaningfulProfile(profile) {
  return Object.entries(defaultProfile).some(([key, defaultValue]) => profile[key] !== defaultValue)
}

function hasMeaningfulTrackingState(state) {
  return hasMeaningfulProfile(state.profile) || state.foodEntries.length > 0 || state.activityEntries.length > 0
}

function mapProfileResponse(profile) {
  return toProfileState(profile)
}

function mapFoodEntry(entry) {
  return {
    id: entry.id ? `food-${entry.id}` : createId('food'),
    day: entry.dayLabel,
    mealType: entry.mealType,
    foodName: entry.foodName,
    calories: toNumber(entry.calories),
    protein: toNumber(entry.protein),
    carbs: toNumber(entry.carbs),
    fats: toNumber(entry.fats),
    fiber: toNumber(entry.fiber),
    loggedAt: entry.loggedAt || new Date().toISOString(),
  }
}

function mapActivityEntry(entry) {
  return {
    id: entry.id ? `activity-${entry.id}` : createId('activity'),
    day: entry.dayLabel,
    steps: toNumber(entry.steps),
    activeMinutes: toNumber(entry.activeMinutes),
    water: toNumber(entry.water),
    sleepHours: toNumber(entry.sleepHours),
    sleepQuality: toNumber(entry.sleepQuality),
    weight: toNumber(entry.weight),
    mood: entry.mood || '',
    notes: entry.notes || '',
    loggedAt: entry.loggedAt || new Date().toISOString(),
  }
}

function toMergedRemoteState(localState, results) {
  const [profileResult, foodResult, activityResult] = results

  return {
    profile: profileResult.status === 'fulfilled'
      ? mapProfileResponse(profileResult.value)
      : localState.profile,
    foodEntries: foodResult.status === 'fulfilled'
      ? (Array.isArray(foodResult.value) ? foodResult.value.map(mapFoodEntry) : [])
      : localState.foodEntries,
    activityEntries: activityResult.status === 'fulfilled'
      ? (Array.isArray(activityResult.value) ? activityResult.value.map(mapActivityEntry) : [])
      : localState.activityEntries,
  }
}

function toProfilePayload(profile) {
  return {
    age: toNumber(profile.age),
    gender: profile.gender,
    heightCm: toNumber(profile.heightCm),
    currentWeightKg: toNumber(profile.currentWeightKg),
    targetWeightKg: toNumber(profile.targetWeightKg),
    activityLevel: profile.activityLevel,
    goalFocus: profile.goalFocus,
    calorieGoal: toNumber(profile.calorieGoal),
    proteinGoal: toNumber(profile.proteinGoal),
    carbsGoal: toNumber(profile.carbsGoal),
    fatsGoal: toNumber(profile.fatsGoal),
    fiberGoal: toNumber(profile.fiberGoal),
    waterGoal: toNumber(profile.waterGoal),
    stepGoal: toNumber(profile.stepGoal),
    activeMinutesGoal: toNumber(profile.activeMinutesGoal),
    sleepGoal: toNumber(profile.sleepGoal),
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
    const localState = loadInitialState(storageKey)
    const session = getMemberSession()
    let cancelled = false

    setTrackingState(localState)

    if (!session.accessToken) {
      return () => {
        cancelled = true
      }
    }

    ;(async () => {
      try {
        const results = await Promise.allSettled([
          getMemberProfile(session.accessToken),
          getFoodLogs(session.accessToken),
          getActivityLogs(session.accessToken),
        ])

        const hasSuccessfulFetch = results.some((result) => result.status === 'fulfilled')
        const remoteState = hasSuccessfulFetch
          ? toMergedRemoteState(localState, results)
          : localState
        const shouldUseRemote = hasSuccessfulFetch && (
          hasMeaningfulTrackingState(remoteState) || !hasMeaningfulTrackingState(localState)
        )

        if (!cancelled && shouldUseRemote) {
          setTrackingState(remoteState)
        }
      } catch {
        if (!cancelled) {
          setTrackingState(localState)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [storageKey])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(trackingState))
  }, [storageKey, trackingState])

  const updateProfile = (updates) => {
    const session = getMemberSession()

    setTrackingState((currentState) => {
      const nextProfile = {
        ...currentState.profile,
        ...Object.fromEntries(
          Object.entries(updates).map(([key, value]) => [
            key,
            PROFILE_NUMERIC_FIELDS.has(key) ? toNumber(value) : value,
          ]),
        ),
      }

      if (session.accessToken) {
        void updateMemberProfileRequest(session.accessToken, toProfilePayload(nextProfile))
          .then((response) => {
            setTrackingState((latestState) => ({
              ...latestState,
              profile: mapProfileResponse(response),
            }))
          })
          .catch(() => {})
      }

      return {
        ...currentState,
        profile: nextProfile,
      }
    })
  }

  const addFoodEntry = (entry) => {
    const normalizedEntry = applyEstimatedNutrition(entry)
    const session = getMemberSession()

    setTrackingState((currentState) => {
      const nextEntry = {
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
      }

      if (session.accessToken) {
        void addFoodLogRequest(session.accessToken, {
          dayLabel: nextEntry.day,
          mealType: nextEntry.mealType,
          foodName: nextEntry.foodName,
          calories: nextEntry.calories,
          protein: nextEntry.protein,
          carbs: nextEntry.carbs,
          fats: nextEntry.fats,
          fiber: nextEntry.fiber,
          loggedAt: nextEntry.loggedAt,
        })
          .then((response) => {
            setTrackingState((latestState) => ({
              ...latestState,
              foodEntries: latestState.foodEntries.map((item) => (
                item.id === nextEntry.id ? mapFoodEntry(response) : item
              )),
            }))
          })
          .catch(() => {})
      }

      return {
        ...currentState,
        foodEntries: [nextEntry, ...currentState.foodEntries],
      }
    })
  }

  const addActivityEntry = (entry) => {
    const session = getMemberSession()

    setTrackingState((currentState) => {
      const nextEntry = {
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
      }

      if (session.accessToken) {
        void addActivityLogRequest(session.accessToken, {
          dayLabel: nextEntry.day,
          steps: nextEntry.steps,
          activeMinutes: nextEntry.activeMinutes,
          water: nextEntry.water,
          sleepHours: nextEntry.sleepHours,
          sleepQuality: nextEntry.sleepQuality,
          weight: nextEntry.weight,
          mood: nextEntry.mood,
          notes: nextEntry.notes,
          loggedAt: nextEntry.loggedAt,
        })
          .then((response) => {
            setTrackingState((latestState) => ({
              ...latestState,
              activityEntries: latestState.activityEntries.map((item) => (
                item.id === nextEntry.id ? mapActivityEntry(response) : item
              )),
            }))
          })
          .catch(() => {})
      }

      return {
        ...currentState,
        activityEntries: [nextEntry, ...currentState.activityEntries],
      }
    })
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
