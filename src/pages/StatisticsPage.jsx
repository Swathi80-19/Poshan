import { useState } from 'react'
import { Bell, TrendingUp, TrendingDown, Award } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, LineChart, Line, AreaChart, Area,
    RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
    PieChart, Pie, Cell, RadialBarChart, RadialBar,
    ComposedChart, ReferenceLine, Legend, CartesianGrid
} from 'recharts'

// ─── Data ──────────────────────────────────────────────────────────────────────
const weekData = [
    { day: 'Mon', kcal: 1320, goal: 1500, deficit: 180 },
    { day: 'Tue', kcal: 900, goal: 1500, deficit: 600 },
    { day: 'Wed', kcal: 1100, goal: 1500, deficit: 400 },
    { day: 'Thu', kcal: 1400, goal: 1500, deficit: 100 },
    { day: 'Fri', kcal: 1200, goal: 1500, deficit: 300 },
    { day: 'Sat', kcal: 1600, goal: 1500, deficit: -100 },
    { day: 'Sun', kcal: 1300, goal: 1500, deficit: 200 },
]

const weightData = [
    { week: 'W1', kg: 55 }, { week: 'W2', kg: 54.5 },
    { week: 'W3', kg: 54.1 }, { week: 'W4', kg: 53.8 },
    { week: 'W5', kg: 53.2 }, { week: 'W6', kg: 53 },
]

const macrosPie = [
    { name: 'Protein', value: 85, color: '#8BAF7C' },
    { name: 'Carbs', value: 180, color: '#3B82F6' },
    { name: 'Fats', value: 45, color: '#F97316' },
    { name: 'Fiber', value: 22, color: '#8B5CF6' },
]

const exerciseData = [
    { day: 'Mon', min: 30 }, { day: 'Tue', min: 45 }, { day: 'Wed', min: 20 },
    { day: 'Thu', min: 60 }, { day: 'Fri', min: 45 }, { day: 'Sat', min: 0 }, { day: 'Sun', min: 30 },
]

const sleepData = [
    { day: 'Mon', hours: 7.5, quality: 80 },
    { day: 'Tue', hours: 6.5, quality: 60 },
    { day: 'Wed', hours: 8, quality: 90 },
    { day: 'Thu', hours: 7, quality: 70 },
    { day: 'Fri', hours: 6, quality: 55 },
    { day: 'Sat', hours: 9, quality: 95 },
    { day: 'Sun', hours: 7.5, quality: 80 },
]

const waterData = [
    { day: 'Mon', actual: 1800, goal: 2000 },
    { day: 'Tue', actual: 1200, goal: 2000 },
    { day: 'Wed', actual: 2000, goal: 2000 },
    { day: 'Thu', actual: 1600, goal: 2000 },
    { day: 'Fri', actual: 1400, goal: 2000 },
    { day: 'Sat', actual: 2000, goal: 2000 },
    { day: 'Sun', actual: 1000, goal: 2000 },
]

const radialData = [
    { name: 'Protein', value: 71, fill: '#8BAF7C' },
    { name: 'Carbs', value: 72, fill: '#3B82F6' },
    { name: 'Fats', value: 69, fill: '#F97316' },
    { name: 'Fiber', value: 73, fill: '#8B5CF6' },
    { name: 'Calcium', value: 62, fill: '#EF4444' },
    { name: 'Iron', value: 44, fill: '#7C3AED' },
]

const achievements = [
    { icon: '🔥', label: '6-Day Streak', sub: 'Keep going!', color: '#FEF3C7' },
    { icon: '💧', label: 'Hydration Pro', sub: '7 days ≥ 2L water', color: '#DBEAFE' },
    { icon: '⚖️', label: '-2kg Goal', sub: 'Target achieved', color: '#E8F1E4' },
    { icon: '💪', label: 'Protein Champ', sub: '5-day protein streak', color: '#EDE9FE' },
]

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) return (
        <div style={{ background: '#1F2937', color: 'white', padding: '8px 12px', borderRadius: 10, fontSize: 12 }}>
            <div style={{ fontWeight: 600, marginBottom: 2 }}>{label}</div>
            {payload.map(p => (
                <div key={p.dataKey}>
                    <span style={{ color: p.color || '#9CA3AF' }}>{p.name || p.dataKey}: </span>
                    <span style={{ fontWeight: 700 }}>{p.value}{p.dataKey === 'kcal' || p.dataKey === 'goal' ? ' kcal' : p.dataKey === 'deficit' ? ' kcal cut' : p.dataKey === 'kg' ? ' kg' : p.dataKey === 'min' ? ' min' : p.dataKey === 'hours' ? 'h' : p.dataKey === 'actual' || p.dataKey === 'goal' ? ' ml' : ''}</span>
                </div>
            ))}
        </div>
    )
    return null
}

const Highlight = ({ children, color = '#8BAF7C' }) => (
    <span style={{
        background: color + '18',
        color: color,
        fontWeight: 800,
        padding: '1px 6px',
        borderRadius: 6,
        fontSize: 'inherit',
    }}>{children}</span>
)

export default function StatisticsPage() {
    const [period, setPeriod] = useState('Week')
    const username = localStorage.getItem('poshan_username') || localStorage.getItem('poshan_name') || 'Krishna'
    const initial = username.charAt(0).toUpperCase()

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Track your progress</span>
                    <span className="page-header-title">Statistics</span>
                </div>
                <div className="page-header-right">
                    <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 20, padding: 3 }}>
                        {['Day', 'Week', 'Month'].map(p => (
                            <button key={p} onClick={() => setPeriod(p)} className="btn" style={{
                                padding: '6px 16px', fontSize: 12, borderRadius: 17,
                                background: period === p ? 'white' : 'transparent',
                                color: period === p ? '#111827' : '#6B7280',
                                boxShadow: period === p ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                                fontWeight: period === p ? 600 : 400
                            }}>{p}</button>
                        ))}
                    </div>
                    <button className="header-icon-btn"><Bell size={18} /></button>
                    <div className="header-avatar" style={{ background: 'linear-gradient(135deg, #7FA870, #4D7A3E)', color: 'white' }}>{initial}</div>
                </div>
            </div>

            <div className="page-body">
                {/* KPI Strip */}
                <div className="g-4">
                    {[
                        { icon: '🔥', label: 'Avg Calories', val: <Highlight color="#F97316">1,239</Highlight>, sub: 'kcal/day', color: '#FFF0E6' },
                        { icon: '⚖️', label: 'Current Weight', val: <Highlight color="#8BAF7C">53 kg</Highlight>, sub: '-2kg this month', color: '#E8F1E4' },
                        { icon: '📊', label: 'BMI', val: <Highlight color="#3B82F6">20.8</Highlight>, sub: 'Normal range', color: '#DBEAFE' },
                        { icon: '🏃', label: 'Active Days', val: <Highlight color="#8B5CF6">6/7</Highlight>, sub: 'This week', color: '#EDE9FE' },
                    ].map(({ icon, label, val, sub, color }) => (
                        <div key={label} style={{ background: color, borderRadius: 18, padding: '18px 20px' }}>
                            <span style={{ fontSize: 24 }}>{icon}</span>
                            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '8px 0 2px' }}>{val}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 1 }}>{label}</div>
                            <div style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── Row 1: Calorie Cut Chart (NEW) + Weight Trend ── */}
                <div className="g-2">

                    {/* Calorie Cut / Deficit Chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Calorie Cut Tracker</div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                <span style={{ fontSize: 30, fontWeight: 800, color: '#111827' }}>1,680</span>
                                <span style={{ fontSize: 14, color: '#9CA3AF' }}>kcal cut this week</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                                <TrendingDown size={13} /> Weekly deficit on track
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <ComposedChart data={weekData}>
                                <defs>
                                    <linearGradient id="cutGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#22C55E" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <ReferenceLine y={0} stroke="#E5E7EB" strokeDasharray="4 4" />
                                <Bar dataKey="deficit" name="Deficit" radius={[6, 6, 0, 0]} fill="#22C55E" fillOpacity={0.8} />
                                <Line type="monotone" dataKey="kcal" name="Actual" stroke="#F97316" strokeWidth={2.5} dot={{ fill: '#F97316', r: 3 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: 16, marginTop: 8, justifyContent: 'center' }}>
                            {[['#22C55E', 'Calorie Cut'], ['#F97316', 'Actual Intake']].map(([c, l]) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Weight Trend — Area */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 13, color: '#9CA3AF' }}>Weight Trend</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                    <span style={{ fontSize: 30, fontWeight: 800, color: '#111827' }}>53</span>
                                    <span style={{ fontSize: 14, color: '#9CA3AF' }}>kg</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#22C55E', fontSize: 13, fontWeight: 600, background: '#F0FDF4', padding: '6px 12px', borderRadius: 20 }}>
                                <TrendingDown size={14} /> <Highlight color="#22C55E">-2kg</Highlight> this month
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <AreaChart data={weightData}>
                                <defs>
                                    <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8BAF7C" stopOpacity={0.25} />
                                        <stop offset="95%" stopColor="#8BAF7C" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} />
                                <YAxis hide domain={[51, 56]} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="kg" name="Weight" stroke="#8BAF7C" strokeWidth={3}
                                    fill="url(#weightGrad)"
                                    dot={{ fill: '#8BAF7C', r: 5, strokeWidth: 0 }}
                                    activeDot={{ r: 7, fill: '#5A8A4A', stroke: 'white', strokeWidth: 2 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Row 2: Macro Pie + Nutrient Radial ── */}
                <div className="g-2">

                    {/* Macros Pie Chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 13, color: '#9CA3AF' }}>Macronutrients</div>
                                <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>Today's Split</div>
                            </div>
                            <span style={{ fontSize: 12, color: '#8BAF7C', fontWeight: 600 }}>Today</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <ResponsiveContainer width={160} height={160}>
                                <PieChart>
                                    <Pie data={macrosPie} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={3} dataKey="value">
                                        {macrosPie.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                                    </Pie>
                                    <Tooltip formatter={(val, name) => [`${val}g`, name]} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {macrosPie.map(({ name, value, color }) => (
                                    <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
                                        <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', flex: 1 }}>{name}</span>
                                        <span style={{ fontSize: 14, fontWeight: 800, color }}>{value}g</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Nutrient Radial Progress */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ marginBottom: 14 }}>
                            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Nutrient Goals</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>% of Daily Target</div>
                        </div>
                        <ResponsiveContainer width="100%" height={180}>
                            <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="100%" data={radialData} startAngle={180} endAngle={-180}>
                                <RadialBar dataKey="value" cornerRadius={4} background={{ fill: '#F3F4F6' }} label={false} />
                                <Tooltip formatter={(val, name) => [`${val}%`, name]} />
                                <Legend iconSize={8} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── Row 3: Exercise Horizontal Bar + Sleep Stacked ── */}
                <div className="g-2">

                    {/* Exercise — Horizontal Bar Chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 13, color: '#9CA3AF' }}>Exercise Minutes</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                                    <span style={{ fontSize: 30, fontWeight: 800, color: '#111827' }}>230</span>
                                    <span style={{ fontSize: 14, color: '#9CA3AF' }}>min/week</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8BAF7C', fontSize: 13, fontWeight: 600 }}>
                                <TrendingUp size={14} /> +20% vs last
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <BarChart data={exerciseData} layout="vertical" barSize={14}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9CA3AF' }} width={30} />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Bar dataKey="min" name="Minutes" radius={[0, 6, 6, 0]}>
                                    {exerciseData.map((entry, i) => (
                                        <Cell key={i} fill={entry.min === 0 ? '#F3F4F6' : entry.min >= 45 ? '#4D7A3E' : '#8BAF7C'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Sleep + Water Stacked Chart */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Sleep & Hydration</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>Weekly Pattern</div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <ComposedChart data={sleepData}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="hours" name="Sleep(h)" fill="#7C3AED" fillOpacity={0.75} radius={[4, 4, 0, 0]} barSize={18} />
                                <Line type="monotone" dataKey="quality" name="Quality%" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', r: 3 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                            {[['#7C3AED', 'Sleep Hours'], ['#3B82F6', 'Quality %']].map(([c, l]) => (
                                <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6B7280' }}>
                                    <div style={{ width: 10, height: 10, borderRadius: 2, background: c }} />{l}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Row 4: Water Intake (Stacked) + Health Metrics ── */}
                <div className="g-2">

                    {/* Water Stacked Bar */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ marginBottom: 16 }}>
                            <div style={{ fontSize: 13, color: '#9CA3AF' }}>Water Intake vs Goal</div>
                            <div style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>Daily Hydration (ml)</div>
                        </div>
                        <ResponsiveContainer width="100%" height={170}>
                            <BarChart data={waterData} barSize={20}>
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Bar dataKey="actual" name="Actual" stackId="a" fill="#3B82F6" fillOpacity={0.85} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="goal" name="Goal" stackId="b" fill="#BFDBFE" fillOpacity={0.5} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Health Metrics */}
                    <div className="card" style={{ padding: 24 }}>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 18 }}>Health Metrics</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { icon: '🏃', label: 'Exercise', val: '45 min', sub: 'Today', color: '#E8F1E4', hc: '#4D7A3E' },
                                { icon: '❤️', label: 'BPM', val: '86', sub: 'Resting HR', color: '#FEE2E2', hc: '#DC2626' },
                                { icon: '💧', label: 'Water', val: '1,000 ml', sub: 'of 2L goal', color: '#DBEAFE', hc: '#3B82F6' },
                                { icon: '😴', label: 'Sleep', val: '7.5 hrs', sub: 'Last night', color: '#EDE9FE', hc: '#7C3AED' },
                            ].map(({ icon, label, val, sub, color, hc }) => (
                                <div key={label} style={{ background: color, borderRadius: 14, padding: 16 }}>
                                    <div style={{ fontSize: 22 }}>{icon}</div>
                                    <div style={{ fontSize: 18, fontWeight: 800, color: '#111827', marginTop: 6 }}>{val}</div>
                                    <div style={{ fontSize: 10, color: '#6B7280' }}>{sub}</div>
                                    <div style={{ fontSize: 10, color: hc, fontWeight: 700, marginTop: 2 }}>{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Row 5: Achievements ── */}
                <div className="card" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                        <Award size={16} color="#F59E0B" />
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Achievements</span>
                    </div>
                    <div className="g-4">
                        {achievements.map(({ icon, label, sub, color }) => (
                            <div key={label} style={{ background: color, borderRadius: 16, padding: '16px', textAlign: 'center' }}>
                                <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{label}</div>
                                <div style={{ fontSize: 11, color: '#6B7280', marginTop: 2 }}>{sub}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
