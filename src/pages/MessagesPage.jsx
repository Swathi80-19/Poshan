import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Calendar, Send, Lock, Search, MoreVertical, Paperclip, Smile, Clock } from 'lucide-react'

const conversations = [
    {
        id: 1,
        name: 'Dr. Bipasha',
        specialty: 'Dietitian',
        message: 'Sounds good, see you at 3 PM!',
        time: 'Now',
        unread: 0,
        initials: 'BP',
        color: '#EDE9FE',
        online: true,
        hasActiveAppointment: true,
        appointmentTime: 'Today, 3:00 PM',
        appointmentStatus: 'active',
    },
    {
        id: 2,
        name: 'Dr. Sara Ali Khan',
        specialty: 'Nutritionist',
        message: 'Great progress! Keep it up 🎉',
        time: '4 days ago',
        unread: 0,
        initials: 'SK',
        color: '#DBEAFE',
        online: true,
        hasActiveAppointment: false,
        appointmentStatus: 'completed',
    },
    {
        id: 3,
        name: 'Dr. Aishwarya',
        specialty: 'Nutritionist',
        message: 'Your meal plan is ready.',
        time: '2 weeks ago',
        unread: 1,
        initials: 'AI',
        color: '#E8F1E4',
        online: false,
        hasActiveAppointment: false,
        appointmentStatus: 'completed',
    },
    {
        id: 4,
        name: 'Dr. Athlone',
        specialty: 'Food Scientist',
        message: '(session cancelled)',
        time: '3 weeks ago',
        unread: 0,
        initials: 'AT',
        color: '#FEF9C3',
        online: false,
        hasActiveAppointment: false,
        appointmentStatus: 'cancelled',
    },
]

const chatData = {
    1: [
        { id: 1, from: 'doctor', text: 'Hello Krishna! Ready for our session today at 3 PM?', time: '10:00 AM' },
        { id: 2, from: 'me', text: 'Yes! I\'ve been following the meal plan closely this week.', time: '10:05 AM' },
        { id: 3, from: 'doctor', text: 'Excellent! Have you been tracking your protein and fiber intake?', time: '10:07 AM' },
        { id: 4, from: 'me', text: 'Yes, protein is around 74g today. Fiber I\'m still working on.', time: '10:10 AM' },
        { id: 5, from: 'doctor', text: 'Good effort! Add some flaxseeds or chia to your smoothie — easy fiber boost 💪', time: '10:12 AM' },
        { id: 6, from: 'me', text: 'Sounds good, see you at 3 PM!', time: '10:14 AM' },
    ],
    2: [
        { id: 1, from: 'doctor', text: 'Hi! Quick check-in — how\'s the 1500 kcal plan going?', time: '4 days ago' },
        { id: 2, from: 'me', text: 'Really well! Lost 2kg this month.', time: '4 days ago' },
        { id: 3, from: 'doctor', text: 'Great progress! Keep it up 🎉', time: '4 days ago' },
    ],
    3: [
        { id: 1, from: 'doctor', text: 'Your updated meal plan is ready. Check the attachments.', time: '2 weeks ago' },
    ],
    4: [],
}

function DateDivider({ label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
            <span style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
            <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
        </div>
    )
}

export default function MessagesPage() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState(1)
    const [newMsg, setNewMsg] = useState('')
    const [allMessages, setAllMessages] = useState(chatData)
    const [searchQ, setSearchQ] = useState('')
    const endRef = useRef(null)

    const conv = conversations.find(c => c.id === selected)
    const messages = allMessages[selected] || []
    const canChat = conv?.hasActiveAppointment

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = () => {
        if (!newMsg.trim() || !canChat) return
        setAllMessages(prev => ({
            ...prev,
            [selected]: [...(prev[selected] || []), { id: Date.now(), from: 'me', text: newMsg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]
        }))
        setNewMsg('')
    }

    const filteredConvs = conversations.filter(c =>
        c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
        c.specialty.toLowerCase().includes(searchQ.toLowerCase())
    )

    return (
        <div className="animate-fade" style={{ height: 'calc(100vh - 0px)', display: 'flex', flexDirection: 'column' }}>
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Your conversations</span>
                    <span className="page-header-title">Messages</span>
                </div>
                <div className="page-header-right">
                    <button className="header-icon-btn"><Bell size={18} /></button>
                    <div className="header-avatar">K</div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden' }}>
                {/* ── Conversation List ── */}
                <div style={{ borderRight: '1px solid #F3F4F6', overflowY: 'auto', background: 'white', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '14px 16px 10px', borderBottom: '1px solid #F3F4F6', flexShrink: 0 }}>
                        <div className="search-input-wrap">
                            <Search size={14} color="#9CA3AF" />
                            <input placeholder="Search conversations..." value={searchQ} onChange={e => setSearchQ(e.target.value)} />
                        </div>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                        {filteredConvs.map(conv => (
                            <button
                                key={conv.id}
                                onClick={() => setSelected(conv.id)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '12px 16px', width: '100%', textAlign: 'left',
                                    background: selected === conv.id ? '#F0F8EC' : 'transparent',
                                    borderLeft: `3px solid ${selected === conv.id ? '#8BAF7C' : 'transparent'}`,
                                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                                    transition: 'all 0.15s'
                                }}
                            >
                                {/* Avatar */}
                                <div style={{ position: 'relative', flexShrink: 0 }}>
                                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: conv.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: '#374151' }}>
                                        {conv.initials}
                                    </div>
                                    {conv.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid white' }} />}
                                    {conv.hasActiveAppointment && (
                                        <div style={{ position: 'absolute', top: -2, right: -2, width: 14, height: 14, borderRadius: '50%', background: '#8BAF7C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: 8, color: 'white' }}>✓</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                        <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</span>
                                        <span style={{ fontSize: 10, color: '#9CA3AF', flexShrink: 0, marginLeft: 6 }}>{conv.time}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 12, color: '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{conv.message}</span>
                                        {conv.unread > 0 && selected !== conv.id && (
                                            <div style={{ minWidth: 18, height: 18, borderRadius: '50%', background: '#8BAF7C', color: 'white', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 6, padding: '0 4px' }}>{conv.unread}</div>
                                        )}
                                    </div>
                                    {conv.hasActiveAppointment && (
                                        <div style={{ marginTop: 3, fontSize: 10, fontWeight: 600, color: '#8BAF7C' }}>🟢 Active · {conv.appointmentTime}</div>
                                    )}
                                    {conv.appointmentStatus === 'completed' && (
                                        <div style={{ marginTop: 3, fontSize: 10, color: '#9CA3AF' }}>✓ Session completed</div>
                                    )}
                                    {conv.appointmentStatus === 'cancelled' && (
                                        <div style={{ marginTop: 3, fontSize: 10, color: '#EF4444' }}>✕ Session cancelled</div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Chat Area ── */}
                <div style={{ display: 'flex', flexDirection: 'column', background: '#F9FAFB', overflow: 'hidden' }}>

                    {/* Chat header */}
                    <div style={{ padding: '14px 22px', background: 'white', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: 44, height: 44, borderRadius: '50%', background: conv?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#374151' }}>{conv?.initials}</div>
                            {conv?.online && <div style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#22C55E', border: '2px solid white' }} />}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{conv?.name}</div>
                            <div style={{ fontSize: 12, color: conv?.online ? '#22C55E' : '#9CA3AF', fontWeight: 500 }}>
                                {conv?.online ? '● Online' : '⊘ Offline'} · {conv?.specialty}
                            </div>
                        </div>
                        <div style={{ flex: 1 }} />

                        {/* Appointment badge in header */}
                        {conv?.hasActiveAppointment && (
                            <div style={{ background: '#E8F1E4', border: '1px solid #D4E0C8', borderRadius: 20, padding: '5px 12px', fontSize: 11, fontWeight: 600, color: '#4D7A3E', display: 'flex', alignItems: 'center', gap: 5 }}>
                                🟢 Session active · {conv.appointmentTime}
                            </div>
                        )}

                        <button className="header-icon-btn" onClick={() => navigate('/app/activity')} title="Book Appointment">
                            <Calendar size={16} />
                        </button>
                        <button className="header-icon-btn"><MoreVertical size={16} /></button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {messages.length === 0 && !canChat && (
                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ textAlign: 'center', color: '#9CA3AF' }}>
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>💬</div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 6 }}>No messages yet</div>
                                    <div style={{ fontSize: 13 }}>Book an appointment to start chatting</div>
                                    <button className="btn btn-primary" style={{ marginTop: 16, padding: '10px 20px', fontSize: 13 }} onClick={() => navigate(`/app/doctor/1`)}>Book Appointment</button>
                                </div>
                            </div>
                        )}

                        {messages.length > 0 && <DateDivider label="Chat History" />}

                        {messages.map((msg, idx) => (
                            <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'me' ? 'flex-end' : 'flex-start', marginBottom: 4 }}>
                                {msg.from === 'doctor' && (
                                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: conv?.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#374151', marginRight: 8, flexShrink: 0, alignSelf: 'flex-end' }}>
                                        {conv?.initials?.[0]}
                                    </div>
                                )}
                                <div style={{ maxWidth: '65%' }}>
                                    <div style={{
                                        padding: '11px 16px',
                                        borderRadius: msg.from === 'me' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                        background: msg.from === 'me' ? 'linear-gradient(135deg, #8BAF7C, #5A8A4A)' : 'white',
                                        color: msg.from === 'me' ? 'white' : '#374151',
                                        fontSize: 14, lineHeight: 1.5,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                                    }}>
                                        {msg.text}
                                    </div>
                                    <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 3, textAlign: msg.from === 'me' ? 'right' : 'left', paddingLeft: msg.from === 'doctor' ? 4 : 0 }}>
                                        {msg.time}
                                        {msg.from === 'me' && ' ✓✓'}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={endRef} />
                    </div>

                    {/* Input area */}
                    {canChat ? (
                        <div style={{ padding: '14px 22px', background: 'white', borderTop: '1px solid #F3F4F6', display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                            <button style={{ width: 38, height: 38, borderRadius: 12, background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', flexShrink: 0 }}>
                                <Paperclip size={16} />
                            </button>
                            <input
                                value={newMsg}
                                onChange={e => setNewMsg(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                                placeholder="Type a message..."
                                style={{ flex: 1, padding: '11px 18px', border: '1.5px solid #E5E7EB', borderRadius: 22, fontSize: 14, outline: 'none', background: '#F9FAFB', color: '#374151', fontFamily: 'inherit' }}
                                onFocus={e => e.target.style.borderColor = '#8BAF7C'}
                                onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                            />
                            <button style={{ width: 38, height: 38, borderRadius: 12, background: '#F3F4F6', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', flexShrink: 0 }}>
                                <Smile size={16} />
                            </button>
                            <button onClick={sendMessage} className="btn btn-primary" style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, flexShrink: 0 }}>
                                <Send size={16} />
                            </button>
                        </div>
                    ) : (
                        /* Locked state — chat only active at appointment time */
                        <div style={{ padding: '18px 22px', background: 'white', borderTop: '1px solid #F3F4F6', flexShrink: 0 }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '16px 18px', background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)', border: '1.5px solid #FDE68A', borderRadius: 18 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{ width: 36, height: 36, borderRadius: 12, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Lock size={18} color="#D97706" />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#92400E' }}>Chat is locked</div>
                                        <div style={{ fontSize: 12, color: '#B45309' }}>Chat is only available during your booked appointment window</div>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '8px 14px', fontSize: 12, flexShrink: 0 }} onClick={() => navigate(`/app/doctor/${conv?.id}`)}>
                                        <Calendar size={13} /> Book
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'white', borderRadius: 12, border: '1px solid #FDE68A' }}>
                                    <Clock size={13} color="#D97706" />
                                    <span style={{ fontSize: 12, color: '#B45309', fontWeight: 500 }}>
                                        {conv?.appointmentStatus === 'completed'
                                            ? `Session with ${conv?.name} was completed. Book a new appointment to chat again.`
                                            : conv?.appointmentStatus === 'cancelled'
                                                ? `Session with ${conv?.name} was cancelled.`
                                                : `Book an appointment with ${conv?.name} to unlock chat access.`
                                        }
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
