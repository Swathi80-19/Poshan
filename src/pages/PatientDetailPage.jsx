import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, ChevronLeft, ChevronRight, CheckCircle2, Calendar } from 'lucide-react'

const weekDays = [
    { label: 'Su', num: 1 },
    { label: 'Mo', num: 2 },
    { label: 'Tu', num: 3 },
    { label: 'We', num: 4 },
    { label: 'Th', num: 5 },
    { label: 'Fr', num: 6 },
    { label: 'Sa', num: 7 },
]

const patientTabs = ['Today', 'Upcoming', 'Not visited', 'Visited']

const patients = [
    {
        id: 1,
        name: 'Rekha',
        gender: 'Female',
        age: 19,
        status: 'visited',
        pct: 20,
        initials: 'RK',
        color: '#FEF9C3',
        time: '10:00 AM',
    },
    {
        id: 2,
        name: 'Krishna',
        gender: 'Male',
        age: 30,
        status: 'not-visited',
        pct: null,
        initials: 'KR',
        color: '#DBEAFE',
        time: '2:00 PM',
    },
    {
        id: 3,
        name: 'Priya',
        gender: 'Female',
        age: 25,
        status: 'upcoming',
        pct: null,
        initials: 'PR',
        color: '#E8F1E4',
        time: '4:30 PM',
    },
    {
        id: 4,
        name: 'Arjun',
        gender: 'Male',
        age: 35,
        status: 'visited',
        pct: 75,
        initials: 'AR',
        color: '#EDE9FE',
        time: '9:00 AM',
    },
]

export default function PatientDetailPage() {
    const navigate = useNavigate()
    const [activeDay, setActiveDay] = useState(4)
    const [activeTab, setActiveTab] = useState('Today')

    const filtered = patients.filter(p => {
        if (activeTab === 'Today') return true
        if (activeTab === 'Upcoming') return p.status === 'upcoming'
        if (activeTab === 'Not visited') return p.status === 'not-visited'
        if (activeTab === 'Visited') return p.status === 'visited'
        return true
    })

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: 'linear-gradient(135deg, #C8DAB8, #8BAF7C)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 14
                        }}>B</div>
                    </div>
                    <div>
                        <div className="page-header-greeting">Good Morning!</div>
                        <div className="page-header-title">Dr. Bipasha</div>
                    </div>
                </div>
                <div className="page-header-right">
                    <button className="header-icon-btn">
                        <Calendar size={18} />
                    </button>
                    <button className="header-icon-btn">
                        <Bell size={18} />
                    </button>
                </div>
            </div>

            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                    {/* Left - calendar + visit stats */}
                    <div>
                        {/* Week selector */}
                        <div className="card" style={{ padding: '16px 20px', marginBottom: 20 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                                <button style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '6px 9px', cursor: 'pointer', color: '#6B7280' }}>
                                    <ChevronLeft size={15} />
                                </button>
                                <span style={{ fontSize: 14, fontWeight: 600, color: '#374151' }}>Sep &nbsp; 2025</span>
                                <button style={{ background: '#F3F4F6', border: 'none', borderRadius: 8, padding: '6px 9px', cursor: 'pointer', color: '#6B7280' }}>
                                    <ChevronRight size={15} />
                                </button>
                            </div>
                            <div className="day-tabs">
                                {weekDays.map(({ label, num }) => (
                                    <div
                                        key={num}
                                        className={`day-tab ${activeDay === num ? 'active' : ''}`}
                                        onClick={() => setActiveDay(num)}
                                    >
                                        <span className="day-tab-label">{label}</span>
                                        <span className="day-tab-num">{num}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Visit stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #8BAF7C, #5A8A4A)',
                                borderRadius: 16, padding: 20, color: 'white',
                                display: 'flex', flexDirection: 'column', gap: 10
                            }}>
                                <div style={{ fontSize: 13, opacity: 0.85 }}>Visited</div>
                                <div style={{ fontSize: 28, fontWeight: 800 }}>Not Visit 6</div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontSize: 12, opacity: 0.8 }}>20% completed</span>
                                    <div style={{ position: 'relative', width: 48, height: 48 }}>
                                        <svg viewBox="0 0 48 48" style={{ transform: 'rotate(-90deg)' }}>
                                            <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="5" />
                                            <circle cx="24" cy="24" r="20" fill="none" stroke="white" strokeWidth="5"
                                                strokeDasharray="125.6" strokeDashoffset="100.5" strokeLinecap="round" />
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>20%</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {[
                                    { label: 'Today\'s Patients', val: patients.length, color: '#E8F1E4', tc: '#5A8A4A' },
                                    { label: 'Not Visited', val: patients.filter(p => p.status === 'not-visited').length, color: '#FEE2E2', tc: '#EF4444' },
                                ].map(({ label, val, color, tc }) => (
                                    <div key={label} style={{
                                        background: color, borderRadius: 14, padding: '14px 16px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                                    }}>
                                        <span style={{ fontSize: 13, color: tc, fontWeight: 500 }}>{label}</span>
                                        <span style={{ fontSize: 22, fontWeight: 800, color: tc }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick actions */}
                        <div className="card" style={{ padding: 20 }}>
                            <div className="section-title">Quick Actions</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[
                                    { label: 'Add Patient', emoji: '➕' },
                                    { label: 'View Reports', emoji: '📊' },
                                    { label: 'Send Plan', emoji: '📤' },
                                ].map(({ label, emoji }) => (
                                    <div key={label} style={{
                                        flex: 1, background: '#F9FAFB', borderRadius: 12,
                                        padding: '12px 8px', textAlign: 'center',
                                        cursor: 'pointer', border: '1.5px solid #F3F4F6',
                                        transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => { e.currentTarget.style.background = '#E8F1E4'; e.currentTarget.style.borderColor = '#8BAF7C' }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.borderColor = '#F3F4F6' }}
                                    >
                                        <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
                                        <div style={{ fontSize: 11, fontWeight: 500, color: '#374151' }}>{label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right - patient list */}
                    <div>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
                                {patientTabs.map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        style={{
                                            padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500,
                                            cursor: 'pointer', border: 'none',
                                            background: activeTab === tab ? '#8BAF7C' : '#F3F4F6',
                                            color: activeTab === tab ? 'white' : '#6B7280',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {filtered.map(patient => (
                                    <div key={patient.id} style={{
                                        display: 'flex', alignItems: 'center', gap: 14,
                                        padding: '14px 18px', background: 'white',
                                        borderRadius: 16, border: '1px solid #F3F4F6',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
                                        onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                                    >
                                        <div style={{
                                            width: 50, height: 50, borderRadius: '50%',
                                            background: patient.color, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 700, fontSize: 16, color: '#374151', flexShrink: 0
                                        }}>
                                            {patient.initials}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>{patient.name}</div>
                                            <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
                                                {patient.gender} · Age {patient.age} · {patient.time}
                                            </div>
                                        </div>
                                        <div>
                                            {patient.status === 'visited' && (
                                                <CheckCircle2 size={20} color="#22C55E" />
                                            )}
                                            {patient.status === 'not-visited' && (
                                                <span style={{ fontSize: 11, color: '#EF4444', fontWeight: 600 }}>Not visited</span>
                                            )}
                                            {patient.status === 'upcoming' && (
                                                <span className="pill pill-blue" style={{ fontSize: 11 }}>Upcoming</span>
                                            )}
                                        </div>
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
