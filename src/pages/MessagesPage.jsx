import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Lock, Paperclip, Search, Send, Smile } from 'lucide-react'
import { getMemberAppointments } from '../lib/memberApi'
import { getMemberDisplayName, getMemberSession } from '../lib/session'

const THREAD_STORAGE_KEY = 'poshan_member_messages_v1'
const tintPalette = ['#eef3ef', '#f3e4d8', '#f1ede6', '#efe8d9', '#e8f0fb', '#eee6fa']

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function readThreads() {
  if (!canUseStorage()) return {}

  try {
    const value = window.localStorage.getItem(THREAD_STORAGE_KEY)
    return value ? JSON.parse(value) : {}
  } catch {
    return {}
  }
}

function writeThreads(value) {
  if (!canUseStorage()) return
  window.localStorage.setItem(THREAD_STORAGE_KEY, JSON.stringify(value))
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

function formatAppointmentTime(appointment) {
  if (!appointment?.scheduledAt) {
    return appointment?.dateLabel || 'Scheduled consultation'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(appointment.scheduledAt))
}

function buildConversation(appointment, index, thread) {
  const lastMessage = thread[thread.length - 1]
  const tint = tintPalette[index % tintPalette.length]

  return {
    id: String(appointment.nutritionistId),
    appointmentId: appointment.id,
    name: appointment.nutritionistName,
    specialty: appointment.mode?.replaceAll('_', ' ') || 'Consultation',
    message: lastMessage?.text || `Upcoming appointment on ${appointment.dateLabel} at ${appointment.timeLabel}.`,
    time: lastMessage?.time || formatAppointmentTime(appointment),
    unread: 0,
    initials: getInitials(appointment.nutritionistName || 'Nutritionist'),
    tint,
    active: appointment.status === 'UPCOMING',
    appointmentTime: `${appointment.dateLabel}, ${appointment.timeLabel}`,
  }
}

export default function MessagesPage() {
  const navigate = useNavigate()
  const endRef = useRef(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [appointments, setAppointments] = useState([])
  const [messagesByConversation, setMessagesByConversation] = useState(() => readThreads())
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    let cancelled = false
    const session = getMemberSession()

    if (!session.accessToken) {
      setLoading(false)
      setAppointments([])
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getMemberAppointments(session.accessToken)

        if (!cancelled) {
          const uniqueAppointments = Array.isArray(response)
            ? [...new Map(response.map((item) => [item.nutritionistId, item])).values()]
            : []
          setAppointments(uniqueAppointments)
          setSelected((current) => current || String(uniqueAppointments[0]?.nutritionistId || ''))
        }
      } catch (requestError) {
        if (!cancelled) {
          setAppointments([])
          setError(requestError.message || 'Unable to load your consultations right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    writeThreads(messagesByConversation)
  }, [messagesByConversation])

  const conversations = useMemo(() => (
    appointments.map((appointment, index) => {
      const key = String(appointment.nutritionistId)
      const thread = messagesByConversation[key] || [{
        id: `seed-${appointment.id}`,
        from: 'doctor',
        text: `Your appointment with ${appointment.nutritionistName} is scheduled for ${appointment.dateLabel} at ${appointment.timeLabel}.`,
        time: formatAppointmentTime(appointment),
      }]

      return buildConversation(appointment, index, thread)
    })
  ), [appointments, messagesByConversation])

  const filtered = conversations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
    || item.specialty.toLowerCase().includes(search.toLowerCase()),
  )

  const activeConversation = conversations.find((item) => item.id === selected) || filtered[0] || null
  const messages = activeConversation ? (
    messagesByConversation[activeConversation.id] || [{
      id: `seed-${activeConversation.appointmentId}`,
      from: 'doctor',
      text: `Your appointment with ${activeConversation.name} is scheduled for ${activeConversation.appointmentTime}.`,
      time: activeConversation.time,
    }]
  ) : []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!selected && filtered[0]) {
      setSelected(filtered[0].id)
    }
  }, [filtered, selected])

  const sendMessage = () => {
    if (!draft.trim() || !activeConversation?.active) return

    setMessagesByConversation((current) => ({
      ...current,
      [activeConversation.id]: [
        ...(current[activeConversation.id] || messages),
        {
          id: Date.now(),
          from: 'me',
          text: draft.trim(),
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }))
    setDraft('')
  }

  return (
    <div className="animate-fade messages-page">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Secure consultations</span>
          <span className="page-header-title">Messages</span>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body messages-layout" style={{ flex: 1 }}>
        <aside className="card messages-list-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="search-input-wrap" style={{ minHeight: 48 }}>
            <Search size={15} color="#7f8776" />
            <input placeholder="Search conversations" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div style={{ marginTop: 14, overflowY: 'auto', flex: 1 }}>
            {loading ? <div className="admin-note">Loading real conversations...</div> : null}
            {error ? <div className="admin-note">{error}</div> : null}
            {!loading && !error && !filtered.length ? (
              <div className="admin-note">
                Messages appear only after you book a real nutritionist appointment.
              </div>
            ) : null}

            {filtered.map((conversation) => {
              const isSelected = activeConversation?.id === conversation.id

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelected(conversation.id)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: 14,
                    borderRadius: 20,
                    background: isSelected ? 'rgba(115,149,95,0.1)' : 'transparent',
                    border: isSelected ? '1px solid rgba(92,120,74,0.18)' : '1px solid transparent',
                    marginBottom: 8,
                  }}
                >
                  <div className="dashboard-panel-heading" style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div className="queue-avatar" style={{ background: conversation.tint }}>{conversation.initials}</div>
                      <div>
                        <div className="queue-title">{conversation.name}</div>
                        <div className="queue-sub">{conversation.specialty}</div>
                      </div>
                    </div>
                    <div className="signal-meta">{conversation.time}</div>
                  </div>
                  <div style={{ color: '#7f8776', fontSize: 13, lineHeight: 1.5 }}>{conversation.message}</div>
                  <div className="pill-row" style={{ marginTop: 10 }}>
                    {conversation.active ? <span className="badge badge-green">Active consult</span> : <span className="badge badge-gray">Read only</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="card messages-thread-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div className="messages-thread-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(92,120,74,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="queue-avatar" style={{ background: activeConversation?.tint }}>{activeConversation?.initials || 'N'}</div>
            <div>
              <div className="queue-title">{activeConversation?.name || 'No conversation selected'}</div>
              <div className="queue-sub">
                {activeConversation ? `Consult window: ${activeConversation.appointmentTime}` : 'Book an appointment to start messaging'}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            {activeConversation?.active ? <span className="badge badge-green">Chat unlocked</span> : <span className="badge badge-gray">No active booking</span>}
            <button className="header-icon-btn" onClick={() => navigate('/app/activity')}><Calendar size={16} /></button>
          </div>

          <div className="messages-thread-body" style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: 'rgba(246,240,229,0.45)' }}>
            {!activeConversation ? (
              <div className="admin-note">No real nutritionist conversation is available yet.</div>
            ) : messages.map((message) => (
              <div key={message.id} style={{ display: 'flex', justifyContent: message.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div
                  className="messages-bubble"
                  style={{
                    padding: '12px 16px',
                    borderRadius: message.from === 'me' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                    background: message.from === 'me' ? 'linear-gradient(135deg, #73955f, #465c39)' : 'rgba(255,252,247,0.96)',
                    color: message.from === 'me' ? 'white' : '#1f241d',
                    boxShadow: '0 12px 24px rgba(57,44,23,0.06)',
                    lineHeight: 1.6,
                  }}
                >
                  <div>{message.text}</div>
                  <div style={{ marginTop: 6, fontSize: 11, opacity: 0.72 }}>{message.time}</div>
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>

          {activeConversation?.active ? (
            <div className="messages-composer" style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
              <button className="header-icon-btn"><Paperclip size={16} /></button>
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage()
                }}
                className="form-input"
                placeholder="Write a message for your nutritionist"
                style={{ minHeight: 48, flex: 1, paddingLeft: 16 }}
              />
              <button className="header-icon-btn"><Smile size={16} /></button>
              <button type="button" className="btn btn-primary" style={{ minWidth: 52, paddingInline: 0 }} onClick={sendMessage}>
                <Send size={16} />
              </button>
            </div>
          ) : (
            <div style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)' }}>
              <div className="auth-note">
                <Lock size={16} />
                <span>Chat opens only after you have a real upcoming appointment with a registered nutritionist.</span>
              </div>
              <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/app/search')}>
                Book appointment
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
