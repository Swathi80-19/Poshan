import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Clock, CheckCircle2, XCircle, Bell, Video, User } from 'lucide-react'

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']

const appointments = [
    { id: 1, time: '9:00 AM', name: 'Rekha Sharma', type: 'Follow-up', duration: 45, col: 1, row: 0, status: 'done', initials: 'RS', color: '#E8F5E2' },
    { id: 2, time: '11:30 AM', name: 'Krishna Murthy', type: 'Diet Review', duration: 60, col: 1, row: 2.5, status: 'done', initials: 'KM', color: '#DBEAFE' },
    { id: 3, time: '2:00 PM', name: 'Priya Verma', type: 'Initial Consult', duration: 60, col: 1, row: 5.5, status: 'upcoming', initials: 'PV', color: '#EDE9FE' },
    { id: 4, time: '4:30 PM', name: 'Arjun Reddy', type: 'Follow-up', duration: 30, col: 1, row: 7.5, status: 'upcoming', initials: 'AR', color: '#FEF9C3' },
]

const upcomingList = [
    { name: 'Priya Verma', time: 'Today, 2:00 PM', type: 'Initial Consult', initials: 'PV', color: '#EDE9FE', video: true },
    { name: 'Arjun Reddy', time: 'Today, 4:30 PM', type: 'Follow-up', initials: 'AR', color: '#FEF9C3', video: false },
    { name: 'Sunita Patel', time: 'Tomorrow, 10:00 AM', type: 'Diet Review', initials: 'SP', color: '#ECFDF5', video: true },
    { name: 'Rahul Singh', time: 'Tomorrow, 3:00 PM', type: 'Progress Check', initials: 'RS', color: '#FFF7ED', video: false },
]

const weekDays = [
    { d: 'Mon', n: 24, appts: 4 },
    { d: 'Tue', n: 25, appts: 2 },
    { d: 'Wed', n: 26, appts: 5 },
    { d: 'Thu', n: 27, appts: 3 },
    { d: 'Fri', n: 28, appts: 4 },
    { d: 'Sat', n: 29, appts: 1 },
]

export default function AdminAppointments() {
    const [activeDay, setActiveDay] = useState(4)
    const navigate = useNavigate()

    return (
        <div className="anim-fade">
            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Manage your schedule</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A' }}>Appointments</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="icon-btn"><Bell size={17} /></button>
                    <button style={{
                        padding: '9px 18px', borderRadius: 50,
                        background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                        boxShadow: '0 4px 16px rgba(127,168,112,0.30)'
                    }}>
                        <Plus size={14} /> New Appointment
                    </button>
                </div>
            </div>

            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
                    {/* Calendar timeline */}
                    <div className="card" style={{ overflow: 'hidden' }}>
                        {/* Week selector */}
                        <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <button className="week-nav-btn"><ChevronLeft size={14} /></button>
                                <span style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>Feb 2026</span>
                                <button className="week-nav-btn"><ChevronRight size={14} /></button>
                            </div>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {['Day', 'Week', 'Month'].map(v => (
                                    <button key={v} style={{
                                        padding: '5px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                                        background: v === 'Day' ? '#F4FAF1' : 'transparent',
                                        border: v === 'Day' ? '1px solid #C8E8BA' : '1px solid transparent',
                                        color: v === 'Day' ? '#4D7A3E' : '#9CA3AF', cursor: 'pointer',
                                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                                    }}>{v}</button>
                                ))}
                            </div>
                        </div>

                        {/* Day tabs */}
                        <div style={{ padding: '14px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', gap: 8 }}>
                            {weekDays.map(({ d, n, appts }, i) => (
                                <div
                                    key={n}
                                    onClick={() => setActiveDay(i)}
                                    style={{
                                        flex: 1, textAlign: 'center', padding: '10px 6px',
                                        borderRadius: 14, cursor: 'pointer',
                                        background: activeDay === i ? 'linear-gradient(135deg, #7FA870, #4D7A3E)' : 'transparent',
                                        transition: 'all 0.2s',
                                        border: activeDay === i ? 'none' : '1px solid #F3F4F6'
                                    }}
                                >
                                    <div style={{ fontSize: 10, fontWeight: 600, color: activeDay === i ? 'rgba(255,255,255,0.7)' : '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{d}</div>
                                    <div style={{ fontSize: 18, fontWeight: 700, color: activeDay === i ? 'white' : '#111827', margin: '4px 0' }}>{n}</div>
                                    {appts > 0 && (
                                        <div style={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                            {Array.from({ length: Math.min(appts, 3) }).map((_, j) => (
                                                <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: activeDay === i ? 'rgba(255,255,255,0.6)' : '#7FA870' }} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Time grid */}
                        <div style={{ padding: '16px 22px', maxHeight: 460, overflowY: 'auto' }}>
                            <div style={{ position: 'relative' }}>
                                {hours.map((h, i) => (
                                    <div key={h} style={{ display: 'flex', gap: 14, marginBottom: 0 }}>
                                        <div style={{ width: 52, flexShrink: 0, fontSize: 11, color: '#9CA3AF', fontWeight: 500, paddingTop: 2, textAlign: 'right' }}>{h}</div>
                                        <div style={{ flex: 1, height: 56, borderTop: '1px solid #F8F9FA', position: 'relative' }}>
                                            {appointments.filter(a => Math.floor(a.row) === i).map(appt => (
                                                <div key={appt.id} style={{
                                                    position: 'absolute', left: 0, right: 0,
                                                    top: `${(appt.row % 1) * 56}px`,
                                                    height: `${(appt.duration / 60) * 56}px`,
                                                    background: appt.status === 'done' ? '#F9FAFB' : appt.color,
                                                    border: `1.5px solid ${appt.status === 'done' ? '#E5E7EB' : '#C8E8BA'}`,
                                                    borderRadius: 10, padding: '8px 12px',
                                                    display: 'flex', alignItems: 'center', gap: 8,
                                                    cursor: 'pointer', zIndex: 1,
                                                    boxShadow: appt.status === 'upcoming' ? '0 4px 12px rgba(127,168,112,0.15)' : 'none'
                                                }}>
                                                    <div style={{
                                                        width: 28, height: 28, borderRadius: 8,
                                                        background: 'white', display: 'flex', alignItems: 'center',
                                                        justifyContent: 'center', fontWeight: 700, fontSize: 11, color: '#374151',
                                                        flexShrink: 0, boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
                                                    }}>{appt.initials}</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: 12, fontWeight: 700, color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{appt.name}</div>
                                                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>{appt.type} · {appt.duration}min</div>
                                                    </div>
                                                    {appt.status === 'done'
                                                        ? <CheckCircle2 size={14} color="#22C55E" />
                                                        : <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7FA870', flexShrink: 0 }} />
                                                    }
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Upcoming list */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Stats */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="section-title" style={{ marginBottom: 14 }}>Today's Stats</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                {[
                                    { label: 'Scheduled', val: 4, color: '#E8F5E2', tc: '#4D7A3E' },
                                    { label: 'Completed', val: 2, color: '#ECFDF5', tc: '#065F46' },
                                    { label: 'Upcoming', val: 2, color: '#DBEAFE', tc: '#1D4ED8' },
                                    { label: 'Cancelled', val: 0, color: '#FEF9C3', tc: '#92400E' },
                                ].map(({ label, val, color, tc }) => (
                                    <div key={label} style={{
                                        background: color, borderRadius: 12, padding: '12px 14px', textAlign: 'center'
                                    }}>
                                        <div style={{ fontSize: 24, fontWeight: 800, color: tc }}>{val}</div>
                                        <div style={{ fontSize: 11, color: tc + 'AA', fontWeight: 500 }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming */}
                        <div className="card" style={{ padding: 22, flex: 1 }}>
                            <div className="section-title" style={{ marginBottom: 16 }}>Upcoming Sessions</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {upcomingList.map(appt => (
                                    <div key={appt.name} style={{
                                        padding: '13px 14px', borderRadius: 14,
                                        background: '#F9FAFB', border: '1px solid #F3F4F6',
                                        display: 'flex', alignItems: 'center', gap: 10,
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F4FAF1'}
                                        onMouseLeave={e => e.currentTarget.style.background = '#F9FAFB'}
                                    >
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 12,
                                            background: appt.color, display: 'flex', alignItems: 'center',
                                            justifyContent: 'center', fontWeight: 700, color: '#374151', fontSize: 13, flexShrink: 0
                                        }}>{appt.initials}</div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{appt.name}</div>
                                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{appt.type}</div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 3, fontSize: 11, color: '#6B7280' }}>
                                                <Clock size={10} /> {appt.time}
                                            </div>
                                        </div>
                                        {appt.video && (
                                            <div style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                background: '#E8F5E2', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Video size={13} color="#4D7A3E" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
