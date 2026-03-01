import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, Bell, Calendar, Clock, CheckCircle2, XCircle, Star, MessageSquare, RotateCcw } from 'lucide-react'

const upcoming = [
    {
        id: 1, name: 'Dr. Bipasha', specialty: 'M.Sc in Nutrition & Dietetics',
        date: 'Today, 3:00 PM', status: 'Active', statusColor: '#22C55E',
        initials: 'BP', color: 'linear-gradient(135deg, #D8EDD0, #8BAF7C)', rating: 4.9,
    },
]

const completed = [
    {
        id: 2, name: 'Dr. Sara Ali Khan', specialty: 'B.Sc in Nutritional Science',
        date: '4 days ago, 11:00 AM', status: 'Completed', statusColor: '#3B82F6',
        initials: 'SK', color: '#DBEAFE', rating: 4.8,
    },
    {
        id: 3, name: 'Dr. Aishwarya', specialty: 'M.Sc in Clinical Nutrition',
        date: '2 weeks ago, 10:30 AM', status: 'Completed', statusColor: '#3B82F6',
        initials: 'AI', color: '#E8F1E4', rating: 4.7,
    },
]

const cancelled = [
    {
        id: 4, name: 'Dr. Athlone', specialty: 'B.Sc in Food Science',
        date: '3 weeks ago', status: 'Cancelled', statusColor: '#EF4444',
        initials: 'AT', color: '#FEF9C3', rating: null,
    },
]

function StarRating({ rating }) {
    if (!rating) return null
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star key={i} size={10} fill={i <= Math.round(rating) ? '#EAB308' : 'none'} color={i <= Math.round(rating) ? '#EAB308' : '#D1D5DB'} />
            ))}
            <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 2 }}>{rating}</span>
        </div>
    )
}

function AppointmentCard({ appt, navigate, showRebook }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px', background: 'white', borderRadius: 18,
            border: '1px solid #F3F4F6', transition: 'all 0.2s', cursor: 'pointer', marginBottom: 10,
        }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            onClick={() => navigate(`/app/doctor/${appt.id}`)}
        >
            <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: appt.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15, color: '#374151', flexShrink: 0,
                border: appt.status === 'Active' ? '2.5px solid #8BAF7C' : 'none',
            }}>
                {appt.initials}
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 1 }}>{appt.name}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 3 }}>{appt.specialty}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6B7280' }}>
                    <Clock size={11} /><span>{appt.date}</span>
                </div>
                <StarRating rating={appt.rating} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 5,
                    fontSize: 11, fontWeight: 600,
                    background: appt.statusColor + '18', color: appt.statusColor,
                    padding: '4px 10px', borderRadius: 20
                }}>
                    {appt.status === 'Completed' ? <CheckCircle2 size={10} /> : appt.status === 'Cancelled' ? <XCircle size={10} /> : <div style={{ width: 6, height: 6, borderRadius: '50%', background: appt.statusColor }} />}
                    {appt.status}
                </span>
                {showRebook && appt.status !== 'Active' && (
                    <button
                        className="btn btn-secondary"
                        style={{ padding: '5px 10px', fontSize: 11 }}
                        onClick={e => { e.stopPropagation(); navigate('/app/search') }}
                    >
                        <RotateCcw size={10} /> Rebook
                    </button>
                )}
                {appt.status === 'Active' && (
                    <button
                        className="btn btn-primary"
                        style={{ padding: '5px 10px', fontSize: 11 }}
                        onClick={e => { e.stopPropagation(); navigate('/app/messages') }}
                    >
                        <MessageSquare size={10} /> Message
                    </button>
                )}
            </div>
        </div>
    )
}

export default function ActivityPage() {
    const navigate = useNavigate()
    const [searchQ, setSearchQ] = useState('')
    const total = upcoming.length + completed.length + cancelled.length

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Your health records</span>
                    <span className="page-header-title">Activity</span>
                </div>
                <div className="page-header-right">
                    <div className="search-input-wrap" style={{ width: 220 }}>
                        <Search size={15} color="#9CA3AF" />
                        <input
                            placeholder="Search appointments..."
                            value={searchQ}
                            onChange={e => setSearchQ(e.target.value)}
                        />
                    </div>
                    <button className="header-icon-btn"><SlidersHorizontal size={18} /></button>
                    <button className="header-icon-btn"><Bell size={18} /></button>
                    <div className="header-avatar">K</div>
                </div>
            </div>

            <div className="page-body">
                {/* KPI strip */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                    {[
                        { label: 'Total Sessions', val: total, color: '#E8F1E4', tc: '#4D7A3E', icon: '📅' },
                        { label: 'Completed', val: completed.length, color: '#DBEAFE', tc: '#3B82F6', icon: '✅' },
                        { label: 'Upcoming', val: upcoming.length, color: '#E8F1E4', tc: '#22C55E', icon: '⏰' },
                        { label: 'Cancelled', val: cancelled.length, color: '#FEE2E2', tc: '#EF4444', icon: '❌' },
                    ].map(({ label, val, color, tc, icon }) => (
                        <div key={label} style={{ background: color, borderRadius: 18, padding: '18px 20px' }}>
                            <span style={{ fontSize: 22 }}>{icon}</span>
                            <div style={{ fontSize: 28, fontWeight: 800, color: tc, margin: '8px 0 2px' }}>{val}</div>
                            <div style={{ fontSize: 12, color: tc + 'CC', fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
                    {/* Upcoming */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <span className="section-title" style={{ marginBottom: 0 }}>Upcoming Appointments</span>
                            <span style={{ background: '#E8F1E4', color: '#5A8A4A', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                                {upcoming.length} active
                            </span>
                        </div>

                        {upcoming.length > 0 ? upcoming.map(appt => (
                            <AppointmentCard key={appt.id} appt={appt} navigate={navigate} showRebook={false} />
                        )) : (
                            <div style={{ textAlign: 'center', padding: 40, background: 'white', borderRadius: 18, border: '1px dashed #E5E7EB', color: '#9CA3AF', fontSize: 14 }}>
                                No upcoming appointments
                            </div>
                        )}

                        {/* Upcoming appointment detail card */}
                        {upcoming[0] && (
                            <div style={{
                                background: 'linear-gradient(135deg, #8BAF7C 0%, #4D7A3E 100%)',
                                borderRadius: 22, padding: 24, color: 'white', marginTop: 8,
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                                <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>Next session with</div>
                                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{upcoming[0].name}</div>
                                <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 14 }}>{upcoming[0].specialty}</div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button
                                        style={{ background: 'white', color: '#4D7A3E', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                                        onClick={() => navigate('/app/messages')}
                                    >
                                        💬 Message
                                    </button>
                                    <button
                                        style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 20, padding: '8px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                                    >
                                        📅 Reschedule
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Completed + Cancelled */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <span className="section-title" style={{ marginBottom: 0 }}>Completed Appointments</span>
                            <span style={{ background: '#DBEAFE', color: '#3B82F6', fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
                                {completed.length} done
                            </span>
                        </div>

                        {completed.map(appt => (
                            <AppointmentCard key={appt.id} appt={appt} navigate={navigate} showRebook={true} />
                        ))}

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '20px 0 14px' }}>
                            <span className="section-title" style={{ marginBottom: 0 }}>Cancelled</span>
                        </div>

                        {cancelled.map(appt => (
                            <AppointmentCard key={appt.id} appt={appt} navigate={navigate} showRebook={true} />
                        ))}

                        <button
                            className="btn btn-primary"
                            style={{ width: '100%', marginTop: 14, padding: 14, fontSize: 14 }}
                            onClick={() => navigate('/app/search')}
                        >
                            <Calendar size={16} /> Book New Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
