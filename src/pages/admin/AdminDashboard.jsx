import { useNavigate } from 'react-router-dom'
import { Bell, TrendingUp, TrendingDown, Users, Calendar, DollarSign, Star, ArrowRight, ArrowUpRight } from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'

const earningsData = [
    { month: 'Aug', earnings: 32000, patients: 28 },
    { month: 'Sep', earnings: 41000, patients: 35 },
    { month: 'Oct', earnings: 38000, patients: 31 },
    { month: 'Nov', earnings: 52000, patients: 44 },
    { month: 'Dec', earnings: 47000, patients: 39 },
    { month: 'Jan', earnings: 63000, patients: 52 },
    { month: 'Feb', earnings: 58000, patients: 48 },
]

const recentPatients = [
    { name: 'Rekha S.', goal: 'Weight Loss', sessions: 8, status: 'active', progress: 72, initials: 'RS', color: '#FEF9C3' },
    { name: 'Krishna M.', goal: 'Muscle Gain', sessions: 5, status: 'active', progress: 45, initials: 'KM', color: '#DBEAFE' },
    { name: 'Priya V.', goal: 'PCOS Management', sessions: 12, status: 'completed', progress: 91, initials: 'PV', color: '#EDE9FE' },
    { name: 'Arjun R.', goal: 'Diabetes Diet', sessions: 3, status: 'new', progress: 20, initials: 'AR', color: '#FEE2E2' },
]

const todayAppointments = [
    { time: '9:00 AM', name: 'Rekha S.', type: 'Follow-up', status: 'done' },
    { time: '11:30 AM', name: 'Krishna M.', type: 'Initial Consult', status: 'done' },
    { time: '2:00 PM', name: 'Priya V.', type: 'Diet Review', status: 'upcoming' },
    { time: '4:30 PM', name: 'Arjun R.', type: 'Follow-up', status: 'upcoming' },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
        <div style={{ background: '#0D1B0A', color: 'white', padding: '10px 14px', borderRadius: 12, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', border: '1px solid rgba(127,168,112,0.2)' }}>
            <p style={{ color: '#9BBF8A', marginBottom: 4, fontWeight: 500 }}>{label}</p>
            <p style={{ fontWeight: 700 }}>₹{payload[0]?.value?.toLocaleString()}</p>
        </div>
    )
    return null
}

export default function AdminDashboard() {
    const navigate = useNavigate()

    return (
        <div className="anim-fade">
            {/* Header */}
            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Good Morning 🌿</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A', letterSpacing: '-0.3px' }}>Dr. Bipasha's Dashboard</div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <button style={{
                        padding: '9px 18px', borderRadius: 50,
                        background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 4px 16px rgba(127,168,112,0.3)',
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                    }} onClick={() => navigate('/admin/appointments')}>
                        <Calendar size={14} /> Today's Schedule
                    </button>
                    <button className="icon-btn" style={{ position: 'relative' }}>
                        <Bell size={17} />
                        <span className="notification-dot" />
                    </button>
                    <div className="admin-user-pill">
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #7FA870, #4D7A3E)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>B</div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Dr. Bipasha</span>
                    </div>
                </div>
            </div>

            <div className="page-body">
                {/* Stats Row */}
                <div className="grid-4 anim-fade-up" style={{ marginBottom: 24 }}>
                    {[
                        { icon: DollarSign, label: 'Monthly Revenue', value: '₹58,000', change: '+12%', up: true, color: '#E8F5E2', iconBg: '#7FA870' },
                        { icon: Users, label: 'Total Patients', value: '48', change: '+6', up: true, color: '#DBEAFE', iconBg: '#3B82F6' },
                        { icon: Calendar, label: 'Sessions Today', value: '4', change: '2 done', up: true, color: '#FEF9C3', iconBg: '#F59E0B' },
                        { icon: Star, label: 'Avg. Rating', value: '4.9', change: '+0.1', up: true, color: '#EDE9FE', iconBg: '#8B5CF6' },
                    ].map(({ icon: Icon, label, value, change, up, color, iconBg }, i) => (
                        <div key={label} className="stat-widget anim-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                            <div className="stat-widget-icon" style={{ background: color }}>
                                <Icon size={20} color={iconBg} />
                            </div>
                            <div className="stat-widget-value">{value}</div>
                            <div className="stat-widget-label">{label}</div>
                            <div className={`stat-widget-trend ${up ? 'trend-up' : 'trend-down'}`} style={{ marginTop: 8 }}>
                                {up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                                {change}
                                <span style={{ color: '#9CA3AF', fontWeight: 400, fontSize: 11 }}>vs last month</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24, marginBottom: 24 }}>
                    {/* Earnings chart */}
                    <div className="card" style={{ padding: 28 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                            <div>
                                <div className="section-title">Revenue Overview</div>
                                <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Monthly earnings trend</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 26, fontWeight: 700, color: '#0D1B0A', letterSpacing: '-0.5px' }}>₹3.31L</div>
                                <div style={{ fontSize: 12, color: '#22C55E', display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginTop: 2 }}>
                                    <TrendingUp size={12} /> +18% this quarter
                                </div>
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={earningsData}>
                                <defs>
                                    <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#7FA870" stopOpacity={0.20} />
                                        <stop offset="95%" stopColor="#7FA870" stopOpacity={0.00} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#7FA870', strokeWidth: 1, strokeDasharray: '4 4' }} />
                                <Area type="monotone" dataKey="earnings" stroke="#7FA870" strokeWidth={2.5}
                                    fill="url(#earningsGrad)" dot={{ fill: '#7FA870', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#4D7A3E', stroke: 'white', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Today's appointments */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <div className="section-title">Today's Schedule</div>
                            <span onClick={() => navigate('/admin/appointments')} style={{ fontSize: 12, color: '#7FA870', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                View all <ArrowRight size={12} />
                            </span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {todayAppointments.map(({ time, name, type, status }) => (
                                <div key={`${name}-${time}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '11px 14px',
                                    borderRadius: 12,
                                    background: status === 'upcoming' ? '#F4FAF1' : '#F9FAFB',
                                    border: `1px solid ${status === 'upcoming' ? '#C8E8BA' : '#F3F4F6'}`,
                                    transition: 'all 0.2s', cursor: 'pointer'
                                }}>
                                    <div style={{ textAlign: 'center', minWidth: 52 }}>
                                        <div style={{ fontSize: 11, fontWeight: 700, color: status === 'upcoming' ? '#4D7A3E' : '#9CA3AF' }}>{time}</div>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{name}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{type}</div>
                                    </div>
                                    <div style={{
                                        fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
                                        background: status === 'done' ? '#ECFDF5' : '#E8F5E2',
                                        color: status === 'done' ? '#065F46' : '#2C5220'
                                    }}>
                                        {status === 'done' ? '✓ Done' : 'Upcoming'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Patients table */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '22px 24px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div className="section-title">Recent Patients</div>
                            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Your active patient roster</div>
                        </div>
                        <button onClick={() => navigate('/admin/patients')} style={{
                            padding: '8px 18px', borderRadius: 50, background: '#F4FAF1',
                            color: '#4D7A3E', border: '1px solid #C8E8BA', cursor: 'pointer',
                            fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                            fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                        }}>
                            View all <ArrowUpRight size={13} />
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Goal</th>
                                <th>Sessions</th>
                                <th>Progress</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentPatients.map(p => (
                                <tr key={p.name} style={{ cursor: 'pointer' }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 12,
                                                background: p.color, display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#374151'
                                            }}>{p.initials}</div>
                                            <span style={{ fontWeight: 600, color: '#111827' }}>{p.name}</span>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 13, color: '#6B7280' }}>{p.goal}</span></td>
                                    <td><span style={{ fontWeight: 600, color: '#111827' }}>{p.sessions}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden', maxWidth: 80 }}>
                                                <div style={{ height: '100%', width: `${p.progress}%`, background: 'linear-gradient(90deg, #7FA870, #4D7A3E)', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#4D7A3E', minWidth: 30 }}>{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge badge-${p.status === 'active' ? 'green' : p.status === 'new' ? 'sky' : 'emerald'}`}>
                                            {p.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
