import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Download, TrendingUp, Users, Star, BarChart2, FileText, Plus, X, Check, Edit3, Save } from 'lucide-react'
import {
    RadarChart, Radar, PolarGrid, PolarAngleAxis,
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line
} from 'recharts'

const outcomeData = [
    { category: 'Weight Loss', success: 88 },
    { category: 'Diabetes Mgmt', success: 92 },
    { category: 'PCOS', success: 85 },
    { category: 'Muscle Gain', success: 78 },
    { category: 'Heart Health', success: 94 },
    { category: 'Gut Health', success: 80 },
]

const radarData = [
    { metric: 'Adherence', A: 85 },
    { metric: 'Progress', A: 78 },
    { metric: 'Retention', A: 92 },
    { metric: 'Rating', A: 98 },
    { metric: 'Response', A: 88 },
    { metric: 'Goals Met', A: 80 },
]

const patientGrowth = [
    { month: 'Aug', patients: 28 },
    { month: 'Sep', patients: 35 },
    { month: 'Oct', patients: 31 },
    { month: 'Nov', patients: 44 },
    { month: 'Dec', patients: 39 },
    { month: 'Jan', patients: 52 },
    { month: 'Feb', patients: 48 },
]

const initialReports = [
    { id: 1, name: 'Rekha Sharma', goal: 'Weight Loss', sessions: 8, completion: 72, bmiChange: '-2.1', lastNote: 'Patient responding well to low-carb approach. Continue plan.', date: '2026-02-20', goalsMet: ['Diet Adherence', 'Weight Target'], recommendations: 'Continue low-carb plan. Add 30 min daily walks.' },
    { id: 2, name: 'Krishna Murthy', goal: 'Muscle Gain', sessions: 5, completion: 45, bmiChange: '+0.8', lastNote: 'Protein intake increased. Add resistance training plan.', date: '2026-02-18', goalsMet: ['Protein Intake'], recommendations: 'Increase protein to 2g/kg bodyweight.' },
    { id: 3, name: 'Priya Verma', goal: 'PCOS Management', sessions: 12, completion: 91, bmiChange: '-1.5', lastNote: 'Excellent progress. Hormonal markers improving significantly.', date: '2026-02-25', goalsMet: ['Diet Adherence', 'Weight Target', 'Lab Values', 'Energy Levels'], recommendations: 'Maintain current plan. Schedule blood test in 6 weeks.' },
    { id: 4, name: 'Arjun Reddy', goal: 'Diabetes Control', sessions: 3, completion: 20, bmiChange: '-0.3', lastNote: 'Diet adjustments made. Monitor blood sugar levels weekly.', date: '2026-02-15', goalsMet: ['Diet Adherence'], recommendations: 'Monitor carb intake carefully. Next review in 2 weeks.' },
]

const allGoalOptions = ['Diet Adherence', 'Weight Target', 'Lab Values', 'Energy Levels', 'Protein Intake', 'Hydration Goals', 'Exercise Routine', 'Stress Management']

const CustomTooltip = ({ active, payload, label }) =>
    active && payload?.length ? (
        <div style={{ background: '#0D1B0A', color: 'white', padding: '8px 12px', borderRadius: 10, fontSize: 12, border: '1px solid rgba(127,168,112,0.2)' }}>
            <p style={{ color: '#9BBF8A' }}>{label}</p>
            <p style={{ fontWeight: 700 }}>{payload[0]?.value} {payload[0]?.name === 'patients' ? 'patients' : '%'}</p>
        </div>
    ) : null

// ─── Create Report Modal ───────────────────────────────────────────────────────
function CreateReportModal({ onClose, onSave, existingPatients }) {
    const [form, setForm] = useState({
        name: '', goal: '', sessions: '', completion: 50, bmiChange: '',
        lastNote: '', date: new Date().toISOString().split('T')[0], goalsMet: [], recommendations: ''
    })
    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
    const toggleGoal = (g) => setForm(p => ({
        ...p,
        goalsMet: p.goalsMet.includes(g) ? p.goalsMet.filter(x => x !== g) : [...p.goalsMet, g]
    }))

    const handleSave = () => {
        if (!form.name || !form.goal) return
        onSave({ ...form, id: Date.now() })
    }

    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', padding: 24 }}
            onClick={onClose}>
            <div style={{ background: 'white', borderRadius: 24, padding: 32, width: '100%', maxWidth: 680, maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 24px 80px rgba(0,0,0,0.2)' }}
                onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: '#0D1B0A' }}>Create Patient Report</div>
                        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>Document sessions, goals, and recommendations</div>
                    </div>
                    <button onClick={onClose} style={{ background: '#F3F4F6', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <X size={16} color="#6B7280" />
                    </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Patient Name *</label>
                        <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#7FA870'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Session Date *</label>
                        <input type="date" value={form.date} onChange={e => set('date', e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#7FA870'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Treatment Goal *</label>
                        <select value={form.goal} onChange={e => set('goal', e.target.value)}
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit', cursor: 'pointer' }}
                            onFocus={e => e.target.style.borderColor = '#7FA870'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'}>
                            <option value="">Select goal</option>
                            {['Weight Loss', 'Muscle Gain', 'Diabetes Management', 'PCOS Management', 'Heart Health', 'Gut Health', 'General Wellness'].map(g => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Sessions Completed</label>
                        <input type="number" min="1" value={form.sessions} onChange={e => set('sessions', e.target.value)} placeholder="e.g. 5"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#7FA870'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>BMI Change (e.g. -1.5 or +0.5)</label>
                        <input value={form.bmiChange} onChange={e => set('bmiChange', e.target.value)} placeholder="-1.5"
                            style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                            onFocus={e => e.target.style.borderColor = '#7FA870'}
                            onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                    </div>
                    <div>
                        <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Plan Completion: {form.completion}%</label>
                        <input type="range" min="0" max="100" value={form.completion} onChange={e => set('completion', Number(e.target.value))}
                            style={{ width: '100%', accentColor: '#7FA870', marginTop: 8 }} />
                    </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 8 }}>Goals Met (select all that apply)</label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {allGoalOptions.map(g => {
                            const checked = form.goalsMet.includes(g)
                            return (
                                <button key={g} onClick={() => toggleGoal(g)} style={{
                                    padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
                                    border: `1.5px solid ${checked ? '#7FA870' : '#E5E7EB'}`,
                                    background: checked ? '#E8F5E2' : 'white',
                                    fontSize: 12, fontWeight: 600, color: checked ? '#4D7A3E' : '#6B7280',
                                    display: 'flex', alignItems: 'center', gap: 5, transition: 'all 0.15s'
                                }}>
                                    {checked && <Check size={11} />} {g}
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div style={{ marginBottom: 14 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Clinical Notes *</label>
                    <textarea value={form.lastNote} onChange={e => set('lastNote', e.target.value)} rows={3} placeholder="Document patient progress, observations, adjustments made..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = '#7FA870'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 5 }}>Recommendations</label>
                    <textarea value={form.recommendations} onChange={e => set('recommendations', e.target.value)} rows={2} placeholder="Next steps, dietary changes, lifestyle modifications..."
                        style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = '#7FA870'}
                        onBlur={e => e.target.style.borderColor = '#E5E7EB'} />
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                    <button onClick={onClose} style={{ flex: 1, padding: '12px', borderRadius: 50, border: '1.5px solid #E5E7EB', background: 'white', fontSize: 14, fontWeight: 600, color: '#6B7280', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                    <button onClick={handleSave} style={{
                        flex: 2, padding: '12px', borderRadius: 50,
                        background: !form.name || !form.goal || !form.lastNote ? '#E5E7EB' : 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                        color: !form.name || !form.goal || !form.lastNote ? '#9CA3AF' : 'white',
                        border: 'none', cursor: !form.name || !form.goal || !form.lastNote ? 'not-allowed' : 'pointer',
                        fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        fontFamily: 'inherit', boxShadow: form.name && form.goal && form.lastNote ? '0 8px 24px rgba(127,168,112,0.35)' : 'none'
                    }}>
                        <Save size={15} /> Save Report
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function AdminReports() {
    const [reports, setReports] = useState(initialReports)
    const [showModal, setShowModal] = useState(false)
    const [expandedId, setExpandedId] = useState(null)

    const handleSave = (newReport) => {
        setReports(prev => [newReport, ...prev])
        setShowModal(false)
    }

    return (
        <div className="anim-fade">
            {showModal && (
                <CreateReportModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                    existingPatients={reports.map(r => r.name)}
                />
            )}

            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Practice analytics & insights</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A' }}>Reports</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="icon-btn"><Bell size={17} /></button>
                    <button style={{
                        padding: '9px 18px', borderRadius: 50,
                        background: '#F4FAF1', color: '#4D7A3E',
                        border: '1.5px solid #C8E8BA', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                    }}>
                        <Download size={14} /> Export All
                    </button>
                    <button onClick={() => setShowModal(true)} style={{
                        padding: '9px 20px', borderRadius: 50,
                        background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                        color: 'white', border: 'none', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        boxShadow: '0 4px 16px rgba(127,168,112,0.3)',
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                    }}>
                        <Plus size={14} /> Create Report
                    </button>
                </div>
            </div>

            <div className="page-body">
                {/* KPIs */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Avg. Success Rate', val: '86%', icon: Star, color: '#FEF9C3', tc: '#92400E' },
                        { label: 'Patient Retention', val: '92%', icon: Users, color: '#E8F5E2', tc: '#4D7A3E' },
                        { label: 'Avg. Goal Time', val: '3.2 mo', icon: BarChart2, color: '#DBEAFE', tc: '#1D4ED8' },
                        { label: 'Reports Generated', val: `${reports.length}`, icon: FileText, color: '#EDE9FE', tc: '#5B21B6' },
                    ].map(({ label, val, icon: Icon, color, tc }) => (
                        <div key={label} className="stat-widget">
                            <div className="stat-widget-icon" style={{ background: color }}>
                                <Icon size={20} color={tc} />
                            </div>
                            <div className="stat-widget-value">{val}</div>
                            <div className="stat-widget-label">{label}</div>
                        </div>
                    ))}
                </div>

                {/* Charts row */}
                <div className="grid-3" style={{ marginBottom: 24 }}>
                    {/* Outcome rates */}
                    <div className="card" style={{ padding: 22 }}>
                        <div className="section-title" style={{ marginBottom: 16 }}>Treatment Outcomes</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            {outcomeData.map(({ category, success }) => (
                                <div key={category}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12, color: '#6B7280', fontWeight: 500 }}>
                                        <span>{category}</span>
                                        <span style={{ fontWeight: 700, color: '#4D7A3E' }}>{success}%</span>
                                    </div>
                                    <div style={{ height: 7, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${success}%`, background: `linear-gradient(90deg, #7FA870, #4D7A3E)`, borderRadius: 4 }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Radar chart */}
                    <div className="card" style={{ padding: 22 }}>
                        <div className="section-title" style={{ marginBottom: 4 }}>Practice Quality</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 8 }}>6 dimensions</div>
                        <ResponsiveContainer width="100%" height={210}>
                            <RadarChart data={radarData}>
                                <PolarGrid stroke="#F3F4F6" />
                                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <Radar name="Score" dataKey="A" stroke="#7FA870" fill="#7FA870" fillOpacity={0.15} strokeWidth={2} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Patient growth */}
                    <div className="card" style={{ padding: 22 }}>
                        <div className="section-title" style={{ marginBottom: 4 }}>Patient Growth</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22C55E', fontWeight: 600, marginBottom: 12 }}>
                            <TrendingUp size={13} /> +71% since Aug
                        </div>
                        <ResponsiveContainer width="100%" height={186}>
                            <LineChart data={patientGrowth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="patients" stroke="#7FA870" strokeWidth={2.5}
                                    dot={{ fill: '#7FA870', r: 4, strokeWidth: 0 }}
                                    activeDot={{ r: 6, fill: '#4D7A3E', stroke: 'white', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Patient reports list */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="section-title">Patient Reports</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <span style={{ fontSize: 12, color: '#9CA3AF' }}>{reports.length} reports</span>
                            <button onClick={() => setShowModal(true)} style={{
                                padding: '7px 14px', borderRadius: 20, background: '#E8F5E2',
                                border: '1px solid #C8E8BA', color: '#4D7A3E', cursor: 'pointer',
                                fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 5,
                                fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                            }}>
                                <Plus size={12} /> New Report
                            </button>
                        </div>
                    </div>
                    <div style={{ padding: '8px 0' }}>
                        {reports.map((p, i) => {
                            const isExpanded = expandedId === p.id
                            return (
                                <div key={p.id} style={{
                                    borderBottom: i < reports.length - 1 ? '1px solid #F9FAFB' : 'none'
                                }}>
                                    {/* Main row */}
                                    <div style={{
                                        padding: '14px 22px',
                                        display: 'grid', gridTemplateColumns: '200px 140px 80px 1fr 130px',
                                        alignItems: 'center', gap: 16, cursor: 'pointer', transition: 'background 0.15s'
                                    }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        onClick={() => setExpandedId(isExpanded ? null : p.id)}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 36, height: 36, borderRadius: 10,
                                                background: ['#FEF9C3', '#DBEAFE', '#EDE9FE', '#FEE2E2'][i % 4],
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700, fontSize: 12, color: '#374151'
                                            }}>{p.name.split(' ').map(n => n[0]).join('')}</div>
                                            <div>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</div>
                                                <div style={{ fontSize: 11, color: '#9CA3AF' }}>{p.goal}</div>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ flex: 1, height: 6, background: '#F3F4F6', borderRadius: 4, overflow: 'hidden', maxWidth: 80 }}>
                                                <div style={{ height: '100%', width: `${p.completion}%`, background: 'linear-gradient(90deg, #7FA870, #4D7A3E)', borderRadius: 4 }} />
                                            </div>
                                            <span style={{ fontSize: 11, fontWeight: 700, color: '#4D7A3E' }}>{p.completion}%</span>
                                        </div>
                                        <div style={{ textAlign: 'center' }}>
                                            <span style={{ fontSize: 13, fontWeight: 700, color: p.bmiChange.startsWith('-') ? '#22C55E' : '#F59E0B' }}>{p.bmiChange}</span>
                                            <div style={{ fontSize: 10, color: '#9CA3AF' }}>BMI Δ</div>
                                        </div>
                                        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.4 }}>{p.lastNote}</div>
                                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                            {p.goalsMet?.length > 0 && (
                                                <span style={{ fontSize: 10, color: '#4D7A3E', background: '#E8F5E2', padding: '3px 8px', borderRadius: 20, fontWeight: 600 }}>
                                                    {p.goalsMet.length} goal{p.goalsMet.length > 1 ? 's' : ''} met
                                                </span>
                                            )}
                                            <button style={{
                                                padding: '6px 12px', borderRadius: 20, background: '#F4FAF1',
                                                border: '1px solid #C8E8BA', color: '#4D7A3E', cursor: 'pointer',
                                                fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
                                                fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                                            }}>
                                                <Download size={11} /> PDF
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded detail */}
                                    {isExpanded && (
                                        <div style={{ padding: '12px 22px 16px', background: '#F9FAFB', borderTop: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Goals Met</div>
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                    {(p.goalsMet && p.goalsMet.length > 0) ? p.goalsMet.map(g => (
                                                        <span key={g} style={{ fontSize: 11, fontWeight: 600, background: '#E8F5E2', color: '#4D7A3E', border: '1px solid #C8E8BA', padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <Check size={9} /> {g}
                                                        </span>
                                                    )) : <span style={{ fontSize: 12, color: '#9CA3AF' }}>No specific goals recorded yet.</span>}
                                                </div>
                                            </div>
                                            <div>
                                                <div style={{ fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Recommendations</div>
                                                <div style={{ fontSize: 12, color: '#374151', lineHeight: 1.6 }}>{p.recommendations || 'No recommendations recorded.'}</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
