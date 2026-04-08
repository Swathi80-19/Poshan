const MEMBER_SESSION_KEY = 'poshan_member_session_v1'
const MEMBER_LOGIN_COUNT_KEY = 'poshan_member_login_counts_v1'
const MEMBER_REGISTRY_KEY = 'poshan_member_registry_v1'
const NUTRITIONIST_SESSION_KEY = 'poshan_nutritionist_session_v1'
const PAYMENT_STATUS_PREFIX = 'poshan_payment_status_v1'

export const MEMBER_SESSION_EVENT = 'poshan:member-session-changed'
export const NUTRITIONIST_SESSION_EVENT = 'poshan:nutritionist-session-changed'

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function safeReadJSON(key, fallback) {
  if (!canUseStorage()) return fallback

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function safeWriteJSON(key, value) {
  if (!canUseStorage()) return
  window.localStorage.setItem(key, JSON.stringify(value))
}

function safeRemove(key) {
  if (!canUseStorage()) return
  window.localStorage.removeItem(key)
}

function emitSessionEvent(eventName, detail) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(eventName, { detail }))
}

function slugifyIdentity(value) {
  return (value || 'guest')
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'guest'
}

export function toIdentitySlug(value) {
  return slugifyIdentity(value)
}

function getLoginCounts() {
  return safeReadJSON(MEMBER_LOGIN_COUNT_KEY, {})
}

function setLoginCounts(counts) {
  safeWriteJSON(MEMBER_LOGIN_COUNT_KEY, counts)
}

export function getMemberRegistry() {
  return safeReadJSON(MEMBER_REGISTRY_KEY, [])
}

function saveMemberRegistry(registry) {
  safeWriteJSON(MEMBER_REGISTRY_KEY, registry)
}

function upsertMemberRegistryEntry(session) {
  const identity = slugifyIdentity(session.username || session.email || session.name)
  const registry = getMemberRegistry()
  const nextEntry = {
    id: identity,
    name: session.name || session.username || 'Member',
    username: session.username || session.name || '',
    email: session.email || '',
    phone: session.phone || '',
    lastLoginAt: session.lastLoginAt,
  }

  const existingIndex = registry.findIndex((entry) => entry.id === identity)

  if (existingIndex === -1) {
    saveMemberRegistry([nextEntry, ...registry])
    return
  }

  const nextRegistry = [...registry]
  nextRegistry[existingIndex] = {
    ...nextRegistry[existingIndex],
    ...nextEntry,
  }
  saveMemberRegistry(nextRegistry)
}

export function getMemberSession() {
  return safeReadJSON(MEMBER_SESSION_KEY, {
    id: null,
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'MEMBER',
    loginCount: 0,
    lastLoginAt: null,
    accessToken: '',
  })
}

export function saveMemberSession({
  id = null,
  name = '',
  username = '',
  email = '',
  phone = '',
  role = 'MEMBER',
  loginCount,
  lastLoginAt,
  accessToken = '',
}) {
  const normalizedUsername = username || name || email.split('@')[0] || 'member'
  const counts = getLoginCounts()
  const identityKey = slugifyIdentity(normalizedUsername)
  const nextCount = Number.isFinite(loginCount) ? loginCount : (counts[identityKey] || 0) + 1

  counts[identityKey] = nextCount
  setLoginCounts(counts)

  const session = {
    id,
    name: name || normalizedUsername,
    username: normalizedUsername,
    email,
    phone,
    role,
    loginCount: nextCount,
    lastLoginAt: lastLoginAt || new Date().toISOString(),
    accessToken,
  }

  if (canUseStorage()) {
    window.localStorage.setItem('poshan_username', session.username)
    window.localStorage.setItem('poshan_name', session.name)
  }

  upsertMemberRegistryEntry(session)
  safeWriteJSON(MEMBER_SESSION_KEY, session)
  emitSessionEvent(MEMBER_SESSION_EVENT, session)
  return session
}

export function clearMemberSession() {
  safeRemove(MEMBER_SESSION_KEY)

  if (canUseStorage()) {
    window.localStorage.removeItem('poshan_username')
    window.localStorage.removeItem('poshan_name')
  }

  emitSessionEvent(MEMBER_SESSION_EVENT, getMemberSession())
}

export function deleteCurrentMemberLocalData() {
  const session = getMemberSession()
  const identity = slugifyIdentity(session.username || session.email || session.name)
  const registry = getMemberRegistry().filter((entry) => entry.id !== identity)
  const counts = getLoginCounts()

  delete counts[identity]
  setLoginCounts(counts)
  saveMemberRegistry(registry)
  safeRemove(`poshan_tracking_v2_${identity}`)
  safeRemove(`${PAYMENT_STATUS_PREFIX}_${identity}`)
  clearMemberSession()
}

export function getMemberDisplayName() {
  const session = getMemberSession()
  return session.username || session.name || 'Member'
}

export function getMemberTrackingStorageKey() {
  const session = getMemberSession()
  return `poshan_tracking_v2_${slugifyIdentity(session.username || session.email || session.name)}`
}

export function getNutritionistSession() {
  return safeReadJSON(NUTRITIONIST_SESSION_KEY, {
    name: '',
    username: '',
    email: '',
    specialization: '',
    loginCount: 0,
    lastLoginAt: null,
  })
}

export function saveNutritionistSession({
  name = '',
  username = '',
  email = '',
  specialization = '',
}) {
  const current = getNutritionistSession()
  const normalizedUsername = username || name || email.split('@')[0] || 'nutritionist'

  const session = {
    name: name || normalizedUsername,
    username: normalizedUsername,
    email,
    specialization,
    loginCount: current.username === normalizedUsername ? current.loginCount + 1 : 1,
    lastLoginAt: new Date().toISOString(),
  }

  if (canUseStorage()) {
    window.localStorage.setItem('poshan_nutri_username', session.username)
    window.localStorage.setItem('poshan_nutri_name', session.name)
  }

  safeWriteJSON(NUTRITIONIST_SESSION_KEY, session)
  emitSessionEvent(NUTRITIONIST_SESSION_EVENT, session)
  return session
}

function getPaymentStorageKey() {
  const session = getMemberSession()
  return `${PAYMENT_STATUS_PREFIX}_${slugifyIdentity(session.username || session.email || session.name)}`
}

export function getPaymentStatus() {
  return safeReadJSON(getPaymentStorageKey(), null)
}

export function savePaymentStatus({ planId, planLabel, total, amount }) {
  const paymentStatus = {
    status: 'paid',
    planId,
    planLabel,
    total,
    amount,
    paidAt: new Date().toISOString(),
    transactionId: `TXN${Math.floor(Math.random() * 9000000 + 1000000)}`,
    acknowledged: false,
  }

  safeWriteJSON(getPaymentStorageKey(), paymentStatus)
  return paymentStatus
}

export function acknowledgePaymentStatus() {
  const current = getPaymentStatus()
  if (!current) return null

  const next = { ...current, acknowledged: true }
  safeWriteJSON(getPaymentStorageKey(), next)
  return next
}
