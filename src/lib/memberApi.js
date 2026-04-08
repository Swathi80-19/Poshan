const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function parseResponse(response) {
  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function toErrorMessage(payload, fallback) {
  if (!payload) {
    return fallback
  }

  if (typeof payload === 'string') {
    return payload
  }

  if (typeof payload.detail === 'string' && payload.detail.trim()) {
    return payload.detail
  }

  if (typeof payload.message === 'string' && payload.message.trim()) {
    return payload.message
  }

  if (typeof payload.error === 'string' && payload.error.trim()) {
    return payload.error
  }

  return fallback
}

async function request(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  const payload = await parseResponse(response)

  if (!response.ok) {
    const error = new Error(toErrorMessage(payload, `Request failed with status ${response.status}`))
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export function registerMember(payload) {
  return request('/api/auth/members/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginMember(payload) {
  return request('/api/auth/members/login', {
    method: 'POST',
    body: payload,
  })
}

export function registerNutritionist(payload) {
  return request('/api/auth/nutritionists/register', {
    method: 'POST',
    body: payload,
  })
}

export function loginNutritionist(payload) {
  return request('/api/auth/nutritionists/login', {
    method: 'POST',
    body: payload,
  })
}

export function logoutMember(token) {
  return request('/api/auth/logout', {
    method: 'POST',
    token,
  })
}

export function getNutritionists() {
  return request('/api/nutritionists')
}

export function createAppointment(token, payload) {
  return request('/api/appointments', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getMemberAppointments(token) {
  return request('/api/appointments/member', { token })
}

export function getNutritionistAppointments(token, status) {
  const query = status ? `?status=${encodeURIComponent(status)}` : ''
  return request(`/api/appointments/nutritionist${query}`, { token })
}

export function getNutritionistPatients(token) {
  return request('/api/nutritionists/me/patients', { token })
}

export function getNutritionistDashboard(token) {
  return request('/api/nutritionists/me/dashboard', { token })
}

export function getMemberProfile(token) {
  return request('/api/member/profile', { token })
}

export function updateMemberProfile(token, payload) {
  return request('/api/member/profile', {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function getFoodLogs(token) {
  return request('/api/member/food-logs', { token })
}

export function addFoodLog(token, payload) {
  return request('/api/member/food-logs', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getActivityLogs(token) {
  return request('/api/member/activity-logs', { token })
}

export function addActivityLog(token, payload) {
  return request('/api/member/activity-logs', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function deleteMemberAccount(token) {
  return request('/api/member/account', {
    method: 'DELETE',
    token,
  })
}
