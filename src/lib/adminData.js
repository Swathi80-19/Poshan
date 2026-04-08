import {
  buildDailyData,
  createDefaultTrackingState,
  defaultProfile,
  getTrackingSummary,
  round,
} from './tracking'
import {
  getMemberRegistry,
  getMemberSession,
  toIdentitySlug,
} from './session'

const APPOINTMENTS_STORAGE_KEY = 'poshan_nutritionist_appointments_v1'
const REPORTS_STORAGE_KEY = 'poshan_nutritionist_reports_v1'
const TRACKING_PREFIX = 'poshan_tracking_v2_'

const patientColors = ['#f8eccc', '#e8f0fb', '#eee6fa', '#fde8e2', '#e7efe0', '#fff2df']

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readJson(key, fallback) {
  if (!canUseStorage()) return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function toDisplayName(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ') || 'Member'
}

function getTrackingEntries() {
  if (!canUseStorage()) return []

  const entries = []

  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index)

    if (!key?.startsWith(TRACKING_PREFIX)) {
      continue
    }

    const value = readJson(key, createDefaultTrackingState())
    entries.push({
      memberId: key.slice(TRACKING_PREFIX.length),
      state: {
        profile: { ...defaultProfile, ...value.profile },
        foodEntries: Array.isArray(value.foodEntries) ? value.foodEntries : [],
        activityEntries: Array.isArray(value.activityEntries) ? value.activityEntries : [],
      },
    })
  }

  return entries
}

function hasProfileData(profile) {
  return Boolean(
    profile.age
      || profile.gender
      || profile.heightCm
      || profile.currentWeightKg
      || profile.targetWeightKg
      || profile.activityLevel
      || profile.goalFocus,
  )
}

function getLatestTimestamp(state, appointments) {
  const timestamps = [
    ...state.foodEntries.map((entry) => entry.loggedAt).filter(Boolean),
    ...state.activityEntries.map((entry) => entry.loggedAt).filter(Boolean),
    ...appointments.map((appointment) => appointment.createdAt).filter(Boolean),
  ]

  if (!timestamps.length) return null

  return timestamps.sort((left, right) => new Date(right) - new Date(left))[0]
}

function formatRelativeDate(value) {
  if (!value) return 'No recent activity'

  const date = new Date(value)
  const now = new Date()
  const diffMs = now - date
  const dayMs = 1000 * 60 * 60 * 24
  const diffDays = Math.floor(diffMs / dayMs)

  if (diffDays <= 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function getStatus(state, appointments) {
  if (appointments.some((appointment) => appointment.status === 'upcoming')) {
    return 'scheduled'
  }

  if (state.foodEntries.length || state.activityEntries.length) {
    return 'active'
  }

  return 'new'
}

function derivePatientColor(memberId) {
  const hash = [...memberId].reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return patientColors[hash % patientColors.length]
}

export function getNutritionistAppointments() {
  const appointments = readJson(APPOINTMENTS_STORAGE_KEY, [])

  return appointments
    .map((appointment) => {
      const scheduledAt = appointment.scheduledAt ? new Date(appointment.scheduledAt) : null
      const computedStatus = scheduledAt && scheduledAt < new Date() ? 'completed' : 'upcoming'

      return {
        ...appointment,
        status: appointment.status || computedStatus,
      }
    })
    .sort((left, right) => new Date(left.scheduledAt) - new Date(right.scheduledAt))
}

export function saveNutritionistAppointment(appointment) {
  const session = getMemberSession()
  const memberName = session.name || session.username || 'Member'
  const memberId = toIdentitySlug(session.username || session.email || session.name)
  const current = getNutritionistAppointments()

  const record = {
    id: appointment.id || `appointment-${Date.now()}`,
    memberId,
    memberName,
    memberEmail: session.email || '',
    doctorName: appointment.doctorName || 'Poshan nutritionist',
    mode: appointment.mode || 'Video consultation',
    timeLabel: appointment.timeLabel,
    dateLabel: appointment.dateLabel,
    scheduledAt: appointment.scheduledAt,
    createdAt: new Date().toISOString(),
    status: 'upcoming',
  }

  writeJson(APPOINTMENTS_STORAGE_KEY, [record, ...current])
  return record
}

export function getNutritionistPatients() {
  const registry = getMemberRegistry()
  const currentSession = getMemberSession()
  const trackingEntries = getTrackingEntries()
  const appointments = getNutritionistAppointments()
  const appointmentsByMember = appointments.reduce((map, appointment) => {
    const list = map.get(appointment.memberId) || []
    list.push(appointment)
    map.set(appointment.memberId, list)
    return map
  }, new Map())
  const trackingByMember = new Map(trackingEntries.map((entry) => [entry.memberId, entry.state]))

  const knownIds = new Set([
    ...registry.map((entry) => entry.id),
    ...trackingEntries.map((entry) => entry.memberId),
    ...appointments.map((entry) => entry.memberId),
  ])

  if (currentSession.username || currentSession.name || currentSession.email) {
    knownIds.add(toIdentitySlug(currentSession.username || currentSession.email || currentSession.name))
  }

  return [...knownIds]
    .map((memberId) => {
      const registryEntry = registry.find((entry) => entry.id === memberId)
      const state = trackingByMember.get(memberId) || createDefaultTrackingState()
      const memberAppointments = appointmentsByMember.get(memberId) || []
      const profile = { ...defaultProfile, ...state.profile }
      const dailyData = buildDailyData(state.foodEntries, state.activityEntries, profile)
      const summary = getTrackingSummary(dailyData)
      const latestTimestamp = getLatestTimestamp(state, memberAppointments)
      const currentWeight = profile.currentWeightKg || summary.latestWeight
      const bmi = profile.heightCm && currentWeight
        ? round(currentWeight / ((profile.heightCm / 100) ** 2), 1)
        : null
      const isRealPatient = hasProfileData(profile)
        || state.foodEntries.length > 0
        || state.activityEntries.length > 0
        || memberAppointments.length > 0

      if (!isRealPatient) {
        return null
      }

      return {
        id: memberId,
        name: registryEntry?.name || registryEntry?.username || toDisplayName(memberId),
        age: profile.age || null,
        goal: profile.goalFocus || 'Goal not set',
        sessions: memberAppointments.length,
        lastSeen: formatRelativeDate(latestTimestamp),
        status: getStatus(state, memberAppointments),
        progress: Math.round(summary.averageAdherence || 0),
        bmi,
        color: derivePatientColor(memberId),
        tags: [profile.gender, profile.activityLevel].filter(Boolean),
        mealsLogged: state.foodEntries.length,
        checkIns: state.activityEntries.length,
      }
    })
    .filter(Boolean)
    .sort((left, right) => right.sessions - left.sessions || right.progress - left.progress)
}

export function getNutritionistReports() {
  return readJson(REPORTS_STORAGE_KEY, []).sort((left, right) => new Date(right.date) - new Date(left.date))
}

export function saveNutritionistReport(report) {
  const current = getNutritionistReports()
  const record = {
    ...report,
    id: report.id || `report-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }

  writeJson(REPORTS_STORAGE_KEY, [record, ...current.filter((item) => item.id !== record.id)])
  return record
}
