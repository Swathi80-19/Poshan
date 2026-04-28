import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Lock, Search, Send, Sparkles } from 'lucide-react'
import { getMemberConversations, getMemberMessageThread, sendMemberMessage } from '../lib/memberApi'
import { getMemberDisplayName, getMemberSession } from '../lib/session'

const tintPalette = ['#eef3ef', '#f3e4d8', '#f1ede6', '#efe8d9', '#e8f0fb', '#eee6fa']

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
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
    initials: getInitials(item.counterpartName || 'Nutritionist'),
    tint: tintPalette[index % tintPalette.length],
    time: formatDateTime(item.lastMessageAt || item.appointmentScheduledAt),
    appointmentLabel: [item.appointmentDateLabel, item.appointmentTimeLabel].filter(Boolean).join(', '),
  }
}

export default function MessagesPage() {
  const navigate = useNavigate()
  const endRef = useRef(null)
  const session = getMemberSession()
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(true)
  const [threadLoading, setThreadLoading] = useState(false)
  const [error, setError] = useState('')
  const [conversations, setConversations] = useState([])
  const [thread, setThread] = useState(null)

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
        const response = await getMemberConversations(session.accessToken)

        if (!cancelled) {
          const items = Array.isArray(response) ? response.map(buildConversation) : []
          setConversations(items)
          setSelected((current) => current || items[0]?.id || '')
        }
      } catch (requestError) {
        if (!cancelled) {
          setConversations([])
          setError(requestError.message || 'Unable to load your conversations right now.')
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
        const response = await getMemberMessageThread(session.accessToken, selected)

        if (!cancelled) {
          setThread({
            ...response,
            id: String(response.counterpartId),
            initials: getInitials(response.counterpartName || 'Nutritionist'),
            appointmentLabel: [response.appointmentDateLabel, response.appointmentTimeLabel].filter(Boolean).join(', '),
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setThread(null)
          setError(requestError.message || 'Unable to open this chat right now.')
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
    if (!draft.trim() || !thread?.chatUnlocked || !session.accessToken) return

    try {
      const sent = await sendMemberMessage(session.accessToken, thread.counterpartId, { text: draft.trim() })
      const nextMessage = {
        ...sent,
        id: sent.id,
      }

      setThread((current) => current ? { ...current, messages: [...current.messages, nextMessage] } : current)
      setConversations((current) => current.map((item) => (
        item.id === String(thread.counterpartId)
          ? {
              ...item,
              lastMessage: nextMessage.text,
              lastMessageAt: nextMessage.sentAt,
              time: formatDateTime(nextMessage.sentAt),
            }
          : item
      )))
      setDraft('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to send your message right now.')
    }
  }

  const unlockedChats = conversations.filter((item) => item.chatUnlocked).length

  return (
    <div className="animate-fade messages-page">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Secure consultations</span>
          <span className="page-header-title">Messages</span>
        </div>
        <div className="page-header-right">
          <span className="badge badge-green">{unlockedChats} unlocked chats</span>
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body" style={{ display: 'grid', gap: 16 }}>
        <section
          className="card"
          style={{
            padding: 20,
            background: 'linear-gradient(135deg, rgba(255,252,247,0.98), rgba(232,241,228,0.94))',
            border: '1px solid rgba(92,120,74,0.1)',
          }}
        >
          <div className="dashboard-panel-heading" style={{ alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow">Care conversations</div>
              <h3 style={{ marginTop: 8 }}>Stay connected with your nutritionist before and after each session.</h3>
              <p style={{ color: '#6f7867', marginTop: 8, maxWidth: 720 }}>
                Use this space to ask questions, share updates, and keep your consultation history in one place.
              </p>
            </div>
            <div className="pill-row">
              <span className="badge badge-green">{conversations.length} total chats</span>
              <span className="badge badge-gray">{unlockedChats} unlocked by nutritionists</span>
            </div>
          </div>
        </section>

        <div className="messages-layout" style={{ flex: 1 }}>
          <aside className="card messages-list-card" style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div className="search-input-wrap" style={{ minHeight: 48 }}>
              <Search size={15} color="#7f8776" />
              <input placeholder="Search conversations" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>

            <div style={{ marginTop: 14, overflowY: 'auto', flex: 1 }}>
              {loading ? <div className="admin-note">Loading conversations...</div> : null}
              {error ? <div className="admin-note">{error}</div> : null}
              {!loading && !error && !filtered.length ? (
                <div className="admin-note">
                  Messages appear after you book an appointment.
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
                          <div className="queue-title">{conversation.counterpartName}</div>
                          <div className="queue-sub">{conversation.counterpartSubtitle || 'Nutritionist'}</div>
                        </div>
                      </div>
                      <div className="signal-meta">{conversation.time}</div>
                    </div>
                    <div style={{ color: '#7f8776', fontSize: 13, lineHeight: 1.5 }}>{conversation.lastMessage}</div>
                    <div className="pill-row" style={{ marginTop: 10 }}>
                      {conversation.chatUnlocked ? <span className="badge badge-green">Chat unlocked</span> : <span className="badge badge-gray">Locked by nutritionist</span>}
                      {conversation.bookingActive ? <span className="badge badge-amber">Upcoming consult</span> : <span className="badge badge-gray">Past consult</span>}
                      {conversation.appointmentLabel ? <span className="badge badge-amber">{conversation.appointmentLabel}</span> : null}
                    </div>
                  </button>
                )
              })}
            </div>
          </aside>

          <section className="card messages-thread-card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
            <div className="messages-thread-header" style={{ padding: '16px 20px', borderBottom: '1px solid rgba(92,120,74,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="queue-avatar" style={{ background: activeConversation?.tint || '#eef3ef' }}>{thread?.initials || activeConversation?.initials || 'N'}</div>
              <div>
                <div className="queue-title">{thread?.counterpartName || activeConversation?.counterpartName || 'No conversation selected'}</div>
                <div className="queue-sub">
                  {thread?.appointmentLabel
                    ? `Consultation: ${thread.appointmentLabel}`
                    : 'Book an appointment to start messaging'}
                </div>
              </div>
              <div style={{ flex: 1 }} />
              {thread?.chatUnlocked ? <span className="badge badge-green">Chat unlocked</span> : <span className="badge badge-gray">Waiting for unlock</span>}
              <button className="header-icon-btn" onClick={() => navigate('/app/activity')}><Calendar size={16} /></button>
            </div>

            <div className="messages-thread-body" style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: 'rgba(246,240,229,0.45)' }}>
              {threadLoading ? <div className="admin-note">Loading chat...</div> : null}
              {!threadLoading && !thread ? (
                <div className="admin-note">No conversation is available yet.</div>
              ) : null}

              {!threadLoading && thread && !thread.messages.length ? (
                <div
                  style={{
                    maxWidth: 420,
                    padding: 18,
                    borderRadius: 22,
                    background: 'rgba(255,252,247,0.96)',
                    border: '1px solid rgba(92,120,74,0.1)',
                    boxShadow: '0 10px 24px rgba(57,44,23,0.05)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Sparkles size={16} color="#73955f" />
                    <strong style={{ color: '#2d3827' }}>Chat ready</strong>
                  </div>
                  <div style={{ color: '#5f6958', lineHeight: 1.6 }}>
                    {thread.chatUnlocked
                      ? `Your booking with ${thread.counterpartName} is confirmed. Send the first message to begin your care conversation.`
                      : `${thread.counterpartName} has not unlocked chat yet. You can open this chat here once messaging is enabled.`}
                  </div>
                </div>
              ) : null}

              {!threadLoading && thread ? thread.messages.map((message) => (
                <div key={message.id} style={{ display: 'flex', justifyContent: message.senderRole === 'MEMBER' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                  <div
                    className="messages-bubble"
                    style={{
                      maxWidth: 'min(78%, 560px)',
                      padding: '12px 16px',
                      borderRadius: message.senderRole === 'MEMBER' ? '20px 20px 8px 20px' : '20px 20px 20px 8px',
                      background: message.senderRole === 'MEMBER' ? 'linear-gradient(135deg, #73955f, #465c39)' : 'rgba(255,252,247,0.96)',
                      color: message.senderRole === 'MEMBER' ? 'white' : '#1f241d',
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

            {thread?.chatUnlocked ? (
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
                  placeholder="Write a message for your nutritionist"
                  style={{ minHeight: 48, flex: 1, paddingLeft: 16 }}
                />
                <button type="button" className="btn btn-primary" style={{ minWidth: 52, paddingInline: 0 }} onClick={sendMessage}>
                  <Send size={16} />
                </button>
              </div>
            ) : (
              <div style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)' }}>
                <div className="auth-note">
                  <Lock size={16} />
                  <span>The nutritionist must unlock this chat manually before you can send messages.</span>
                </div>
                {!conversations.length ? (
                  <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={() => navigate('/app/search')}>
                    Book appointment
                  </button>
                ) : null}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
