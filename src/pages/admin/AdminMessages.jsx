import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, Search, Send, Sparkles, UserRound } from 'lucide-react'
import {
  getNutritionistConversations,
  getNutritionistMessageThread,
  sendNutritionistMessage,
} from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

const tintPalette = ['#eef3ef', '#f3e4d8', '#f1ede6', '#efe8d9', '#e8f0fb', '#eee6fa']

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'M'
}

function formatDateTime(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

function formatClock(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value))
}

function buildConversation(item, index) {
  return {
    ...item,
    id: String(item.counterpartId),
    initials: getInitials(item.counterpartName || 'Member'),
    tint: tintPalette[index % tintPalette.length],
    time: formatDateTime(item.lastMessageAt || item.appointmentScheduledAt),
    appointmentLabel: [item.appointmentDateLabel, item.appointmentTimeLabel].filter(Boolean).join(', '),
  }
}

export default function AdminMessages() {
  const session = getNutritionistSession()
  const endRef = useRef(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState([])
  const [thread, setThread] = useState(null)
  const displayName = session.username || session.name || 'Nutritionist'
  const initial = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setConversations([])
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getNutritionistConversations(session.accessToken)

        if (!cancelled) {
          const items = Array.isArray(response) ? response.map(buildConversation) : []
          setConversations(items)
          setSelected((current) => current || items[0]?.id || '')
        }
      } catch (requestError) {
        if (!cancelled) {
          setConversations([])
          setError(requestError.message || 'Unable to load messages right now.')
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
  }, [session.accessToken])

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken || !selected) {
      setThread(null)
      return undefined
    }

    ;(async () => {
      try {
        setThreadLoading(true)
        const response = await getNutritionistMessageThread(session.accessToken, selected)

        if (!cancelled) {
          setThread({
            ...response,
            id: String(response.counterpartId),
            initials: getInitials(response.counterpartName || 'Member'),
            appointmentLabel: [response.appointmentDateLabel, response.appointmentTimeLabel].filter(Boolean).join(', '),
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setThread(null)
          setError(requestError.message || 'Unable to open this member thread right now.')
        }
      } finally {
        if (!cancelled) {
          setThreadLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [selected, session.accessToken])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  const filtered = useMemo(() => (
    conversations.filter((item) => {
      const haystack = `${item.counterpartName} ${item.counterpartSubtitle || ''} ${item.lastMessage || ''}`.toLowerCase()
      return haystack.includes(search.toLowerCase())
    })
  ), [conversations, search])

  const activeConversation = filtered.find((item) => item.id === selected)
    || conversations.find((item) => item.id === selected)
    || filtered[0]
    || null

  useEffect(() => {
    if (!selected && filtered[0]) {
      setSelected(filtered[0].id)
    }
  }, [filtered, selected])

  const sendMessage = async () => {
    if (!draft.trim() || !thread?.active || !session.accessToken) return

    try {
      const sent = await sendNutritionistMessage(session.accessToken, thread.counterpartId, { text: draft.trim() })
      setThread((current) => current ? { ...current, messages: [...current.messages, sent] } : current)
      setConversations((current) => current.map((item) => (
        item.id === String(thread.counterpartId)
          ? {
              ...item,
              lastMessage: sent.text,
              lastMessageAt: sent.sentAt,
              time: formatDateTime(sent.sentAt),
            }
          : item
      )))
      setDraft('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to send the nutritionist reply right now.')
    }
  }

  const activeChats = conversations.filter((item) => item.active).length
  const totalMessages = thread?.messages?.length || 0

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Member communication</div>
          <h1>Messages</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">{activeChats} active threads</span>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 16 }}>
        <section
          className="card"
          style={{
            padding: 22,
            background: 'linear-gradient(135deg, rgba(255,252,247,0.98), rgba(231,239,224,0.92))',
            border: '1px solid rgba(92,120,74,0.1)',
          }}
        >
          <div className="dashboard-panel-heading" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow">Practice inbox</div>
              <h3 style={{ marginTop: 8 }}>Manage member conversations in one dedicated inbox.</h3>
              <p style={{ color: '#6f7867', marginTop: 8, maxWidth: 760 }}>
                Review appointment discussions, send follow-ups, and keep each member conversation in a single thread.
              </p>
            </div>
            <div className="pill-row">
              <span className="badge badge-green">{conversations.length} member threads</span>
              <span className="badge badge-amber">{totalMessages} messages in current thread</span>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {[
            { label: 'Live threads', value: conversations.length, foot: 'Booked relationships available for chat', tone: '#e7efe0', accent: '#73955f' },
            { label: 'Active consults', value: activeChats, foot: 'Upcoming appointment threads still open', tone: '#e8f0fb', accent: '#4d82b7' },
            { label: 'Current thread', value: totalMessages, foot: activeConversation?.counterpartName || 'No member selected', tone: '#f8eccc', accent: '#c9953b' },
          ].map((item) => (
            <article key={item.label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: item.tone }}>
                  <UserRound size={18} color={item.accent} />
                </div>
                <span style={{ color: item.accent, fontWeight: 800, fontSize: '0.78rem' }}>Inbox</span>
              </div>
              <div className="metric-card-value">{item.value}</div>
              <div className="metric-card-label">{item.label}</div>
              <div className="metric-card-foot" style={{ color: item.accent }}>{item.foot}</div>
            </article>
          ))}
        </section>

        <div className="messages-layout" style={{ flex: 1 }}>
          <aside className="card messages-list-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="search-input-wrap" style={{ minHeight: 48 }}>
              <Search size={15} color="#7f8776" />
              <input placeholder="Search members" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>

            <div style={{ marginTop: 14, overflowY: 'auto', flex: 1 }}>
              {loading ? <div className="admin-note">Loading member threads...</div> : null}
              {error ? <div className="admin-note">{error}</div> : null}
              {!loading && !error && !filtered.length ? (
                <div className="admin-note">Messages become available after a member books an appointment.</div>
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
                          <div className="queue-title">{conversation.counterpartName}</div>
                          <div className="queue-sub">{conversation.counterpartSubtitle || 'Member'}</div>
                        </div>
                      </div>
                      <div className="signal-meta">{conversation.time}</div>
                    </div>
                    <div style={{ color: '#7f8776', fontSize: 13, lineHeight: 1.5 }}>{conversation.lastMessage}</div>
                    <div className="pill-row" style={{ marginTop: 10 }}>
                      {conversation.active ? <span className="badge badge-green">Live consult</span> : <span className="badge badge-gray">Archive only</span>}
                      {conversation.appointmentLabel ? <span className="badge badge-amber">{conversation.appointmentLabel}</span> : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="card messages-thread-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <div className="messages-thread-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(92,120,74,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="queue-avatar" style={{ background: activeConversation?.tint || '#eef3ef' }}>{thread?.initials || activeConversation?.initials || 'M'}</div>
              <div>
                <div className="queue-title">{thread?.counterpartName || activeConversation?.counterpartName || 'No member selected'}</div>
                <div className="queue-sub">
                  {thread?.appointmentLabel
                    ? `Booked for ${thread.appointmentLabel}`
                    : 'Select a booked member thread'}
                </div>
              </div>
              <div style={{ flex: 1 }} />
              {thread?.active ? <span className="badge badge-green">Responding live</span> : <span className="badge badge-gray">No active booking</span>}
            </div>

            <div className="messages-thread-body" style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: 'rgba(246,240,229,0.45)' }}>
              {threadLoading ? <div className="admin-note">Loading thread...</div> : null}
              {!threadLoading && !thread ? <div className="admin-note">No member thread is selected yet.</div> : null}

              {!threadLoading && thread && !thread.messages.length ? (
                <div
                  style={{
                    maxWidth: 460,
                    padding: 18,
                    borderRadius: 22,
                    background: 'rgba(255,252,247,0.96)',
                    border: '1px solid rgba(92,120,74,0.1)',
                    boxShadow: '0 10px 24px rgba(57,44,23,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Sparkles size={16} color="#73955f" />
                    <strong style={{ color: '#2d3827' }}>Thread opened</strong>
                  </div>
                  <div style={{ color: '#5f6958', lineHeight: 1.6 }}>
                    {thread.counterpartName} has a booked appointment. Send the first message to begin the conversation.
                  </div>
                </div>
              ) : null}

              {!threadLoading && thread ? thread.messages.map((message) => (
                <div key={message.id} style={{ display: 'flex', justifyContent: message.senderRole === 'NUTRITIONIST' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div
                    className="messages-bubble"
                    style={{
                      maxWidth: 'min(78%, 560px)',
                      padding: '12px 16px',
                      borderRadius: message.senderRole === 'NUTRITIONIST' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                      background: message.senderRole === 'NUTRITIONIST' ? 'linear-gradient(135deg, #73955f, #465c39)' : 'rgba(255,252,247,0.96)',
                      color: message.senderRole === 'NUTRITIONIST' ? 'white' : '#1f241d',
                      boxShadow: '0 12px 24px rgba(57,44,23,0.06)',
                      lineHeight: 1.6,
                    }}
                  >
                    <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 4 }}>{message.senderName}</div>
                    <div>{message.text}</div>
                    <div style={{ marginTop: 6, fontSize: 11, opacity: 0.72 }}>{formatClock(message.sentAt)}</div>
                  </div>
                </div>
              )) : null}
              <div ref={endRef} />
            </div>

            {thread?.active ? (
              <div className="messages-composer" style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault()
                      sendMessage()
                    }
                  }}
                  className="form-input"
                  placeholder="Write a reply for this member"
                  style={{ minHeight: 48, flex: 1, paddingLeft: 16 }}
                />
                <button type="button" className="btn btn-primary" style={{ minWidth: 52, paddingInline: 0 }} onClick={sendMessage}>
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <div style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)' }}>
                <div className="auth-note">
                  <span>This thread becomes interactive when there is an upcoming appointment.</span>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
