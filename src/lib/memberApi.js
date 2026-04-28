const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

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

function isLikelyDevProxyFailure(response, payload) {
  if (API_BASE_URL || response.status < 500 || response.status > 504) {
    return false
  }

  const contentType = response.headers.get('content-type') || ''

  if (typeof payload === 'string') {
    const normalized = payload.toLowerCase()

    if (
      normalized.includes('econnrefused')
      || normalized.includes('proxy error')
      || normalized.includes('unable to proxy')
      || normalized.includes('connection refused')
      || normalized.includes('<html')
    ) {
      return true
    }
  }

  return !contentType.includes('application/json')
}

async function request(path, { method = 'GET', body, token } = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    const serviceTarget = API_BASE_URL || 'the Poshan service'
    throw new Error(`Unable to connect to ${serviceTarget}. Please try again in a moment.`)
  }

  const payload = await parseResponse(response)

  if (!response.ok) {
    if (isLikelyDevProxyFailure(response, payload)) {
      throw new Error('Unable to connect to Poshan at http://localhost:8080. Start the service and try again.')
    }

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

export function verifyEmailToken(payload) {
  return request('/api/auth/verify-email', {
    method: 'POST',
    body: payload,
  })
}

export function resendVerificationEmail(payload) {
  return request('/api/auth/resend-verification', {
    method: 'POST',
    body: payload,
  })
}

export function getVerificationStatus({ email, role }) {
  const query = new URLSearchParams({
    email,
    role,
  })

  return request(`/api/auth/verification-status?${query.toString()}`)
}

export function loginNutritionist(payload) {
  return request('/api/auth/nutritionists/login', {
    method: 'POST',
    body: payload,
  })
}

export function isEmailVerificationRequiredError(error) {
  const message = typeof error?.message === 'string' ? error.message.toLowerCase() : ''
  return error?.status === 403 && message.includes('verify your email')
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

export function getNutritionistProfile(token) {
  return request('/api/nutritionists/me/profile', { token })
}

export function updateNutritionistProfile(token, payload) {
  return request('/api/nutritionists/me/profile', {
    method: 'PUT',
    token,
    body: payload,
  })
}

export function getMemberConversations(token) {
  return request('/api/messages/member', { token })
}

export function getMemberMessageThread(token, nutritionistId) {
  return request(`/api/messages/member/${nutritionistId}`, { token })
}

export function sendMemberMessage(token, nutritionistId, payload) {
  return request(`/api/messages/member/${nutritionistId}`, {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getNutritionistConversations(token) {
  return request('/api/messages/nutritionist', { token })
}

export function getNutritionistMessageThread(token, memberId) {
  return request(`/api/messages/nutritionist/${memberId}`, { token })
}

export function sendNutritionistMessage(token, memberId, payload) {
  return request(`/api/messages/nutritionist/${memberId}`, {
    method: 'POST',
    token,
    body: payload,
  })
}

export function updateNutritionistChatAccess(token, memberId, payload) {
  return request(`/api/messages/nutritionist/${memberId}/chat-access`, {
    method: 'PUT',
    token,
    body: payload,
  })
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

export function createPayment(token, payload) {
  return request('/api/payments', {
    method: 'POST',
    token,
    body: payload,
  })
}

export function getNutritionistPayments(token) {
  return request('/api/payments/nutritionist', { token })
}

export function getNutritionistReports(token) {
  return request('/api/reports/nutritionist', { token })
}

export function createNutritionistReport(token, payload) {
  return request('/api/reports', {
    method: 'POST',
    token,
    body: payload,
  })
}

export async function downloadNutritionistReportAttachment(token, reportId) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}/api/reports/${reportId}/attachment`, {
      method: 'GET',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    })
  } catch {
    const serviceTarget = API_BASE_URL || 'the Poshan service'
    throw new Error(`Unable to connect to ${serviceTarget}. Please try again in a moment.`)
  }

  if (!response.ok) {
    const payload = await parseResponse(response)
    const error = new Error(toErrorMessage(payload, `Request failed with status ${response.status}`))
    error.status = response.status
    error.payload = payload
    throw error
  }

  const blob = await response.blob()
  const disposition = response.headers.get('content-disposition') || ''
  const match = disposition.match(/filename=\"?([^"]+)\"?/)
  const fileName = match?.[1] || 'report-file'

  return { blob, fileName }
}
