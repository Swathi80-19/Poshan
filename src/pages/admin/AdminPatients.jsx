import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Plus, Filter, MoreHorizontal, Bell, TrendingUp } from 'lucide-react'

const patients = [
    { id: 1, name: 'Rekha Sharma', age: 28, goal: 'Weight Loss', sessions: 8, lastSeen: '2 days ago', status: 'active', progress: 72, bmi: 26.4, initials: 'RS', color: '#FEF9C3', tags: ['PCOS', 'Vegetarian'] },
    { id: 2, name: 'Krishna Murthy', age: 34, goal: 'Muscle Gain', sessions: 5, lastSeen: 'Yesterday', status: 'active', progress: 45, bmi: 23.1, initials: 'KM', color: '#DBEAFE', tags: ['Diabetic', 'Sports'] },
    { id: 3, name: 'Priya Verma', age: 22, goal: 'PCOS Management', sessions: 12, lastSeen: 'Today', status: 'completed', progress: 91, bmi: 24.8, initials: 'PV', color: '#EDE9FE', tags: ['PCOS'] },
    { id: 4, name: 'Arjun Reddy', age: 45, goal: 'Diabetes Control', sessions: 3, lastSeen: '1 week ago', status: 'new', progress: 20, bmi: 28.7, initials: 'AR', color: '#FEE2E2', tags: ['Type 2', 'Hypertension'] },
    { id: 5, name: 'Sunita Patel', age: 38, goal: 'Heart Health', sessions: 6, lastSeen: '3 days ago', status: 'active', progress: 58, bmi: 25.2, initials: 'SP', color: '#ECFDF5', tags: ['Cholesterol'] },
    { id: 6, name: 'Rahul Singh', age: 29, goal: 'Weight Loss', sessions: 10, lastSeen: 'Today', status: 'active', progress: 65, bmi: 30.1, initials: 'RS2', color: '#FFF7ED', tags: ['Keto', 'High BP'] },
]

const statusColors = { active: 'badge-green', completed: 'badge-emerald', new: 'badge-sky', paused: 'badge-amber' }

export default function AdminPatients() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('All')

    const filtered = patients.filter(p =>
        (filter === 'All' || p.status === filter.toLowerCase()) &&
        (p.name.toLowerCase().includes(query.toLowerCase()) || p.goal.toLowerCase().includes(query.toLowerCase()))
    )

    return (
        <div className="anim-fade">
            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Manage your practice</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A' }}>Patients</div>
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
                        <Plus size={14} /> Add Patient
                    </button>
                </div>
            </div>

            <div className="page-body">
                {/* Summary cards */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Total Patients', val: patients.length, color: '#E8F5E2', tc: '#4D7A3E' },
                        { label: 'Active', val: patients.filter(p => p.status === 'active').length, color: '#DBEAFE', tc: '#1D4ED8' },
                        { label: 'Completed', val: patients.filter(p => p.status === 'completed').length, color: '#ECFDF5', tc: '#065F46' },
                        { label: 'New This Week', val: patients.filter(p => p.status === 'new').length, color: '#FFF7ED', tc: '#9A3412' },
                    ].map(({ label, val, color, tc }) => (
                        <div key={label} className="stat-widget" style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 32, fontWeight: 800, color: tc, letterSpacing: '-1px' }}>{val}</div>
                            <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4 }}>{label}</div>
                        </div>
                    ))}
                </div>

                {/* Filters + Search */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '16px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                        <div className="search-wrap" style={{ flex: 1, maxWidth: 360 }}>
                            <Search size={15} color="#9CA3AF" />
                            <input placeholder="Search patients..." value={query} onChange={e => setQuery(e.target.value)} />
                        </div>
                        <div className="filter-tabs">
                            {['All', 'Active', 'New', 'Completed'].map(f => (
                                <button key={f} className={`filter-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
                            ))}
                        </div>
                        <button className="icon-btn"><Filter size={16} /></button>
                    </div>

                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Patient</th>
                                <th>Health Goal</th>
                                <th>BMI</th>
                                <th>Sessions</th>
                                <th>Progress</th>
                                <th>Last Seen</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(p => (
                                <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => navigate('/admin/appointments')}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 38, height: 38, borderRadius: 12,
                                                background: p.color, display: 'flex',
                                                alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: 13, color: '#374151', flexShrink: 0
                                            }}>{p.initials[0] + p.initials[1]}</div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#111827', fontSize: 14 }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: '#9CA3AF' }}>Age {p.age}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{p.goal}</div>
                                            <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
                                                {p.tags.map(t => <span key={t} style={{ fontSize: 10, background: '#F3F4F6', color: '#6B7280', padding: '1px 7px', borderRadius: 20, fontWeight: 500 }}>{t}</span>)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            fontSize: 13, fontWeight: 600,
                                            color: p.bmi > 27 ? '#EF4444' : p.bmi < 18.5 ? '#F59E0B' : '#22C55E'
                                        }}>{p.bmi}</span>
                                    </td>
                                    <td><span style={{ fontWeight: 700, color: '#111827', fontSize: 15 }}>{p.sessions}</span></td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 100 }}>
                                            <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', width: `${p.progress}%`, background: 'linear-gradient(90deg, #7FA870, #4D7A3E)', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: 12, fontWeight: 600, color: '#4D7A3E', minWidth: 32 }}>{p.progress}%</span>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 13, color: '#9CA3AF' }}>{p.lastSeen}</span></td>
                                    <td><span className={`badge ${statusColors[p.status] || 'badge-gray'}`}>{p.status}</span></td>
                                    <td>
                                        <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}>
                                            <MoreHorizontal size={16} />
                                        </button>
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
