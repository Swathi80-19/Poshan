import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Lock, MoreVertical, Paperclip, Search, Send, Smile } from 'lucide-react'

const conversations = [
  { id: 1, name: 'Dr. Bipasha', specialty: 'Dietitian', message: 'Sounds good, see you at 3 PM.', time: 'Now', unread: 0, initials: 'BP', tint: '#eef3ef', online: true, active: true, appointmentTime: 'Today, 3:00 PM' },
  { id: 2, name: 'Dr. Sara Ali Khan', specialty: 'Nutritionist', message: 'Great progress. Keep it up.', time: '4 days ago', unread: 0, initials: 'SK', tint: '#f3e4d8', online: true, active: false },
  { id: 3, name: 'Dr. Aishwarya', specialty: 'Nutritionist', message: 'Your meal plan is ready.', time: '2 weeks ago', unread: 1, initials: 'AI', tint: '#f1ede6', online: false, active: false },
]

const initialMessages = {
  1: [
    { id: 1, from: 'doctor', text: 'Hello Krishna. Ready for our session today at 3 PM?', time: '10:00 AM' },
    { id: 2, from: 'me', text: 'Yes, I have the meal notes ready and want to review lunch timing.', time: '10:05 AM' },
    { id: 3, from: 'doctor', text: 'Perfect. We will tighten protein timing and talk through recovery.', time: '10:07 AM' },
  ],
  2: [
    { id: 1, from: 'doctor', text: 'The 1500 kcal plan looks steady. Keep following the same structure this week.', time: '4 days ago' },
  ],
  3: [
    { id: 1, from: 'doctor', text: 'I uploaded the updated meal plan. Review it before your next booking.', time: '2 weeks ago' },
  ],
}

export default function MessagesPage() {
  const navigate = useNavigate()
  const endRef = useRef(null)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(1)
  const [draft, setDraft] = useState('')
  const [messagesByConversation, setMessagesByConversation] = useState(initialMessages)

  const filtered = conversations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.specialty.toLowerCase().includes(search.toLowerCase()),
  )

  const activeConversation = conversations.find((item) => item.id === selected)
  const messages = messagesByConversation[selected] || []

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!draft.trim() || !activeConversation?.active) return

    setMessagesByConversation((current) => ({
      ...current,
      [selected]: [
        ...(current[selected] || []),
        {
          id: Date.now(),
          from: 'me',
          text: draft,
          time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ],
    }))
    setDraft('')
  }

  return (
    <div className="animate-fade" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Secure consultations</span>
          <span className="page-header-title">Messages</span>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">K</div>
        </div>
      </div>

      <div className="page-body" style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px minmax(0, 1fr)', gap: 16, minHeight: 0 }}>
        <aside className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div className="search-input-wrap" style={{ minHeight: 48 }}>
            <Search size={15} color="#7f8776" />
            <input placeholder="Search conversations" value={search} onChange={(event) => setSearch(event.target.value)} />
          </div>

          <div style={{ marginTop: 14, overflowY: 'auto', flex: 1 }}>
            {filtered.map((conversation) => {
              const isSelected = selected === conversation.id
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
                    {conversation.active ? <span className="badge badge-green">Active consult</span> : null}
                    {conversation.unread ? <span className="badge badge-amber">{conversation.unread} new</span> : null}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="card" style={{ display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(92,120,74,0.08)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div className="queue-avatar" style={{ background: activeConversation?.tint }}>{activeConversation?.initials}</div>
            <div>
              <div className="queue-title">{activeConversation?.name}</div>
              <div className="queue-sub">
                {activeConversation?.active ? `Consult window: ${activeConversation.appointmentTime}` : activeConversation?.specialty}
              </div>
            </div>
            <div style={{ flex: 1 }} />
            {activeConversation?.active ? <span className="badge badge-green">Chat unlocked</span> : <span className="badge badge-gray">No active booking</span>}
            <button className="header-icon-btn" onClick={() => navigate('/app/activity')}><Calendar size={16} /></button>
            <button className="header-icon-btn"><MoreVertical size={16} /></button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '22px 24px', background: 'rgba(246,240,229,0.45)' }}>
            {messages.map((message) => (
              <div key={message.id} style={{ display: 'flex', justifyContent: message.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                <div
                  style={{
                    maxWidth: '68%',
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
            <div style={{ padding: 18, borderTop: '1px solid rgba(92,120,74,0.08)', display: 'flex', gap: 10, alignItems: 'center' }}>
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
                <span>Chat opens only during an active appointment window. Book a session to continue this conversation.</span>
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
