import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Bell, Flame, Droplets, Moon, Brain,
    Play, Pause, RotateCcw, Plus, Minus, Check, ChevronRight,
    TrendingUp, Heart, Zap, Clock, Target, Award, Calendar, Edit3, X
} from 'lucide-react'
import {
    AreaChart, Area, RadialBarChart, RadialBar, ResponsiveContainer,
    Tooltip, XAxis, YAxis, ComposedChart, Bar, Line
} from 'recharts'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const clamp = (v, min, max) => Math.max(min, Math.min(max, v))
const pct = (val, total) => Math.round(clamp(val / total, 0, 1) * 100)

// ─── Timer Hook ───────────────────────────────────────────────────────────────
function useTimer(defaultSecs) {
    const [remaining, setRemaining] = useState(defaultSecs)
    const [running, setRunning] = useState(false)
    const [done, setDone] = useState(false)
    const ref = useRef(null)
    useEffect(() => {
        if (running && remaining > 0) {
            ref.current = setInterval(() => setRemaining(r => {
                if (r <= 1) { clearInterval(ref.current); setRunning(false); setDone(true); return 0 }
                return r - 1
            }), 1000)
        } else { clearInterval(ref.current) }
        return () => clearInterval(ref.current)
    }, [running])
    const toggle = () => { setRunning(r => !r); setDone(false) }
    const reset = (secs) => { clearInterval(ref.current); setRunning(false); setRemaining(secs); setDone(false) }
    const fmt = () => `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`
    return { remaining, running, done, toggle, reset, fmt }
}

const weekCalories = [
    { day: 'Sun', cal: 1100 }, { day: 'Mon', cal: 1320 }, { day: 'Tue', cal: 1050 },
    { day: 'Wed', cal: 1239 }, { day: 'Thu', cal: 0 }, { day: 'Fri', cal: 0 }, { day: 'Sat', cal: 0 },
]

// ─── Sub-components ───────────────────────────────────────────────────────────
function CircleProgress({ pct: p, size = 80, stroke = 8, color = '#8BAF7C', children }) {
    const r = (size - stroke * 2) / 2
    const circ = 2 * Math.PI * r
    const dash = (p / 100) * circ
    return (
        <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                <circle cx={size / 2} cy={size / 2} r={r} stroke="#F3F4F6" strokeWidth={stroke} fill="none" />
                <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
                    strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                {children}
            </div>
        </div>
    )
}

function StatPill({ icon, label, val, color, trend, trendDir }) {
    return (
        <div className="card" style={{ padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{icon}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 1 }}>{label}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#111827' }}>{val}</div>
                {trend && <div style={{ fontSize: 10, color: trendDir === 'up' ? '#22C55E' : '#EF4444', fontWeight: 600 }}>{trendDir === 'up' ? '↑' : '↓'} {trend}</div>}
            </div>
        </div>
    )
}

// ─── TIMER WIDGET ─────────────────────────────────────────────────────────────
function TimerWidget({ title, emoji, color, presets, defaultSecs }) {
    const timer = useTimer(defaultSecs)
    const [custom, setCustom] = useState(null)
    const current = custom || defaultSecs
    return (
        <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{emoji}</div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{title}</span>
                {timer.done && <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 700, background: '#D1FAE5', color: '#059669', padding: '3px 8px', borderRadius: 20 }}>✓ Done!</span>}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                <CircleProgress pct={Math.round((1 - timer.remaining / current) * 100)} size={100} stroke={10} color={color}>
                    <span style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{timer.fmt()}</span>
                </CircleProgress>
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14 }}>
                {presets.map(p => (
                    <button key={p.label} onClick={() => { timer.reset(p.secs); setCustom(p.secs) }}
                        style={{ padding: '5px 10px', borderRadius: 20, border: current === p.secs ? `2px solid ${color}` : '1.5px solid #E5E7EB', background: current === p.secs ? color + '15' : 'white', fontSize: 11, fontWeight: 600, color: current === p.secs ? color : '#374151', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {p.label}
                    </button>
                ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={timer.toggle} className="btn btn-primary" style={{ flex: 1, background: timer.running ? '#EF4444' : color, borderColor: timer.running ? '#EF4444' : color, padding: '10px 0', fontSize: 13 }}>
                    {timer.running ? <><Pause size={14} /> Pause</> : <><Play size={14} /> {timer.remaining < current ? 'Resume' : 'Start'}</>}
                </button>
                <button onClick={() => { timer.reset(current) }} className="btn btn-ghost" style={{ width: 40, padding: '10px 0' }}>
                    <RotateCcw size={14} />
                </button>
            </div>
        </div>
    )
}

// ─── SLEEP TRACKER ────────────────────────────────────────────────────────────
function SleepTracker() {
    const [hours, setHours] = useState(7.5)
    const [quality, setQuality] = useState('Good')
    const qualities = ['Poor', 'Fair', 'Good', 'Great', 'Perfect']
    const qualityColors = { Poor: '#EF4444', Fair: '#F59E0B', Good: '#3B82F6', Great: '#8BAF7C', Perfect: '#22C55E' }
    const goal = 8
    return (
        <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🌙</div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Sleep Tracker</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: qualityColors[quality], fontWeight: 700, background: qualityColors[quality] + '20', padding: '3px 8px', borderRadius: 20 }}>{quality}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
                <CircleProgress pct={pct(hours, goal)} size={100} stroke={10} color="#7C3AED">
                    <span style={{ fontSize: 20, fontWeight: 800, color: '#111827' }}>{hours}h</span>
                    <span style={{ fontSize: 9, color: '#9CA3AF' }}>of {goal}h</span>
                </CircleProgress>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
                <button onClick={() => setHours(h => Math.max(0, +(h - 0.5).toFixed(1)))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Minus size={14} /></button>
                <span style={{ fontSize: 22, fontWeight: 800, color: '#111827', minWidth: 60, textAlign: 'center' }}>{hours}h</span>
                <button onClick={() => setHours(h => Math.min(12, +(h + 0.5).toFixed(1)))} style={{ width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={14} /></button>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Sleep Quality</div>
            <div style={{ display: 'flex', gap: 5 }}>
                {qualities.map(q => (
                    <button key={q} onClick={() => setQuality(q)} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: quality === q ? `2px solid ${qualityColors[q]}` : '1.5px solid #E5E7EB', background: quality === q ? qualityColors[q] + '15' : 'white', fontSize: 10, fontWeight: 700, color: quality === q ? qualityColors[q] : '#9CA3AF', cursor: 'pointer', fontFamily: 'inherit' }}>{q}</button>
                ))}
            </div>
        </div>
    )
}

// ─── MEAL NUTRITION LOGGER ────────────────────────────────────────────────────
const MEAL_NUTRIENTS = ['Calories(kcal)', 'Protein(g)', 'Carbs(g)', 'Fats(g)', 'Calcium(mg)', 'Iron(mg)', 'Vit C(mg)']
const NUT_DEFAULTS = { 'Calories(kcal)': 0, 'Protein(g)': 0, 'Carbs(g)': 0, 'Fats(g)': 0, 'Calcium(mg)': 0, 'Iron(mg)': 0, 'Vit C(mg)': 0 }

const MEAL_PRESETS = {
    breakfast: [
        { name: 'Oats & Fruits', 'Calories(kcal)': 320, 'Protein(g)': 12, 'Carbs(g)': 58, 'Fats(g)': 6, 'Calcium(mg)': 120, 'Iron(mg)': 2.5, 'Vit C(mg)': 10 },
        { name: 'Idli & Sambar', 'Calories(kcal)': 280, 'Protein(g)': 9, 'Carbs(g)': 52, 'Fats(g)': 4, 'Calcium(mg)': 80, 'Iron(mg)': 2, 'Vit C(mg)': 8 },
        { name: 'Eggs & Toast', 'Calories(kcal)': 350, 'Protein(g)': 22, 'Carbs(g)': 30, 'Fats(g)': 14, 'Calcium(mg)': 60, 'Iron(mg)': 2.8, 'Vit C(mg)': 5 },
    ],
    lunch: [
        { name: 'Dal Rice + Salad', 'Calories(kcal)': 480, 'Protein(g)': 24, 'Carbs(g)': 72, 'Fats(g)': 14, 'Calcium(mg)': 150, 'Iron(mg)': 5, 'Vit C(mg)': 25 },
        { name: 'Chicken + Roti', 'Calories(kcal)': 520, 'Protein(g)': 38, 'Carbs(g)': 45, 'Fats(g)': 18, 'Calcium(mg)': 90, 'Iron(mg)': 4, 'Vit C(mg)': 12 },
        { name: 'Veg Pulao', 'Calories(kcal)': 420, 'Protein(g)': 12, 'Carbs(g)': 68, 'Fats(g)': 12, 'Calcium(mg)': 110, 'Iron(mg)': 3, 'Vit C(mg)': 18 },
    ],
    dinner: [
        { name: 'Chicken + Veggies', 'Calories(kcal)': 380, 'Protein(g)': 36, 'Carbs(g)': 20, 'Fats(g)': 14, 'Calcium(mg)': 80, 'Iron(mg)': 3.5, 'Vit C(mg)': 30 },
        { name: 'Fish Curry + Rice', 'Calories(kcal)': 440, 'Protein(g)': 30, 'Carbs(g)': 48, 'Fats(g)': 16, 'Calcium(mg)': 180, 'Iron(mg)': 3, 'Vit C(mg)': 15 },
        { name: 'Paneer Sabzi + Roti', 'Calories(kcal)': 410, 'Protein(g)': 20, 'Carbs(g)': 42, 'Fats(g)': 18, 'Calcium(mg)': 280, 'Iron(mg)': 2.5, 'Vit C(mg)': 10 },
    ],
    snacks: [
        { name: 'Banana + Almonds', 'Calories(kcal)': 210, 'Protein(g)': 6, 'Carbs(g)': 34, 'Fats(g)': 9, 'Calcium(mg)': 40, 'Iron(mg)': 1, 'Vit C(mg)': 8 },
        { name: 'Greek Yogurt', 'Calories(kcal)': 150, 'Protein(g)': 15, 'Carbs(g)': 12, 'Fats(g)': 4, 'Calcium(mg)': 200, 'Iron(mg)': 0.5, 'Vit C(mg)': 2 },
        { name: 'Fruit Bowl', 'Calories(kcal)': 180, 'Protein(g)': 3, 'Carbs(g)': 42, 'Fats(g)': 1, 'Calcium(mg)': 50, 'Iron(mg)': 1.2, 'Vit C(mg)': 60 },
    ],
}

function MealLogger({ mealType, emoji, color, bgColor, time: defaultTime }) {
    const [mealItems, setMealItems] = useState([])
    const [time, setTime] = useState(defaultTime)
    const [showAdd, setShowAdd] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [customName, setCustomName] = useState('')
    const presets = MEAL_PRESETS[mealType] || []

    const totals = mealItems.reduce((acc, item) => {
        MEAL_NUTRIENTS.forEach(n => acc[n] = (acc[n] || 0) + (item[n] || 0))
        return acc
    }, { ...NUT_DEFAULTS })

    const addPreset = (preset) => {
        setMealItems(prev => [...prev, { ...preset }])
        setShowAdd(false)
    }

    const removeItem = (idx) => setMealItems(prev => prev.filter((_, i) => i !== idx))

    const mealTitle = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snacks: 'Snacks' }[mealType]

    return (
        <div style={{ background: 'white', border: '1px solid #F3F4F6', borderRadius: 20, padding: 18, transition: 'box-shadow 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.06)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ width: 42, height: 42, borderRadius: 14, background: bgColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{emoji}</div>
                <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{mealTitle}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={10} color="#9CA3AF" />
                        <input type="time" value={time} onChange={e => setTime(e.target.value)}
                            style={{ fontSize: 11, color: '#6B7280', border: 'none', outline: 'none', background: 'transparent', fontFamily: 'inherit', cursor: 'pointer' }} />
                    </div>
                </div>
                {mealItems.length > 0 && (
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 16, fontWeight: 800, color: color }}>{totals['Calories(kcal)']} kcal</div>
                        <div style={{ fontSize: 10, color: '#9CA3AF' }}>P:{totals['Protein(g)']}g · C:{totals['Carbs(g)']}g · F:{totals['Fats(g)']}g</div>
                    </div>
                )}
            </div>

            {/* Meal items */}
            {mealItems.length > 0 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
                    {mealItems.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', background: bgColor + '60', borderRadius: 10 }}>
                            <span style={{ fontSize: 12, fontWeight: 600, color: '#374151', flex: 1 }}>{item.name}</span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                {['Calcium(mg)', 'Iron(mg)', 'Vit C(mg)'].map(n => (
                                    <span key={n} style={{ fontSize: 9, fontWeight: 700, color: color, background: color + '15', padding: '2px 5px', borderRadius: 8 }}>
                                        {n.replace('(mg)', '').replace('Vit ', 'C')}: {item[n]}
                                    </span>
                                ))}
                            </div>
                            <button onClick={() => removeItem(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex', padding: 2 }}><X size={12} /></button>
                        </div>
                    ))}
                </div>
            )}

            {/* Calcium/Iron/VitC summary */}
            {mealItems.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                    {[['🦴', 'Calcium', totals['Calcium(mg)'], 'mg', '#EF4444'], ['🩸', 'Iron', totals['Iron(mg)'], 'mg', '#7C3AED'], ['🍊', 'Vit C', totals['Vit C(mg)'], 'mg', '#F59E0B']].map(([ic, name, val, unit, clr]) => (
                        <div key={name} style={{ flex: 1, background: clr + '10', borderRadius: 10, padding: '6px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: 14 }}>{ic}</div>
                            <div style={{ fontSize: 13, fontWeight: 800, color: clr }}>{typeof val === 'number' ? val.toFixed(1) : val}</div>
                            <div style={{ fontSize: 9, color: '#9CA3AF' }}>{name} ({unit})</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add food */}
            {showAdd ? (
                <div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Quick Add:</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {presets.map(p => (
                            <button key={p.name} onClick={() => addPreset(p)}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, border: '1.5px solid #E5E7EB', background: 'white', cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s' }}
                                onMouseEnter={e => { e.currentTarget.style.background = bgColor; e.currentTarget.style.borderColor = color + '40' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#E5E7EB' }}>
                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</span>
                                <span style={{ fontSize: 11, color: '#6B7280' }}>{p['Calories(kcal)']} kcal</span>
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setShowAdd(false)} style={{ marginTop: 8, width: '100%', padding: '7px', border: '1.5px solid #E5E7EB', borderRadius: 10, background: 'white', fontSize: 12, color: '#9CA3AF', cursor: 'pointer', fontFamily: 'inherit' }}>
                        Cancel
                    </button>
                </div>
            ) : (
                <button onClick={() => setShowAdd(true)} style={{
                    width: '100%', padding: '8px', borderRadius: 10,
                    border: `1.5px dashed ${color}50`, background: color + '08',
                    fontSize: 12, fontWeight: 600, color: color, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    transition: 'all 0.2s'
                }}
                    onMouseEnter={e => e.currentTarget.style.background = color + '15'}
                    onMouseLeave={e => e.currentTarget.style.background = color + '08'}>
                    <Plus size={13} /> Add Food
                </button>
            )}
        </div>
    )
}

// ─── HYDRATION TRACKER WITH ML ────────────────────────────────────────────────
function HydrationTracker() {
    const [entries, setEntries] = useState([250, 250, 250, 250])
    const [customMl, setCustomMl] = useState(250)
    const goalMl = 2000
    const totalMl = entries.reduce((a, b) => a + b, 0)
    const glasses = entries.length

    const addEntry = (ml) => setEntries(prev => [...prev, ml])
    const removeEntry = (idx) => setEntries(prev => prev.filter((_, i) => i !== idx))

    const quickAmounts = [150, 200, 250, 350, 500]

    return (
        <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#DBEAFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>💧</div>
                <div>
                    <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Hydration Tracker</span>
                    <div style={{ fontSize: 11, color: '#6B7280', marginTop: 1 }}>Daily Goal: {goalMl} ml (2L)</div>
                </div>
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: '#3B82F6' }}>{totalMl} ml</div>
                    <div style={{ fontSize: 10, color: '#9CA3AF' }}>{glasses} drink{glasses !== 1 ? 's' : ''}</div>
                </div>
            </div>

            {/* Progress ring + bar */}
            <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 14 }}>
                <CircleProgress pct={pct(totalMl, goalMl)} size={84} stroke={9} color="#3B82F6">
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>{pct(totalMl, goalMl)}%</span>
                </CircleProgress>
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                        {entries.map((ml, i) => (
                            <button key={i} onClick={() => removeEntry(i)} title={`${ml}ml — click to remove`}
                                style={{ padding: '3px 8px', borderRadius: 8, background: '#3B82F6', color: 'white', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
                                💧 {ml}ml
                            </button>
                        ))}
                    </div>
                    {entries.length === 0 && <div style={{ fontSize: 12, color: '#9CA3AF' }}>No entries yet. Add water below.</div>}
                </div>
            </div>

            <div style={{ height: 8, background: '#F3F4F6', borderRadius: 6, marginBottom: 14, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${Math.min(100, pct(totalMl, goalMl))}%`, background: 'linear-gradient(90deg, #3B82F6, #60A5FA)', borderRadius: 6, transition: 'width 0.4s ease' }} />
            </div>

            {/* Quick add amounts */}
            <div style={{ fontSize: 11, fontWeight: 600, color: '#374151', marginBottom: 8 }}>Quick Add:</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                {quickAmounts.map(ml => (
                    <button key={ml} onClick={() => addEntry(ml)}
                        style={{ padding: '6px 10px', borderRadius: 10, border: '1.5px solid #BFDBFE', background: '#EFF6FF', fontSize: 11, fontWeight: 600, color: '#3B82F6', cursor: 'pointer', fontFamily: 'inherit' }}>
                        {ml}ml
                    </button>
                ))}
            </div>

            {/* Custom ml input */}
            <div style={{ display: 'flex', gap: 8 }}>
                <input
                    type="number" min="50" max="2000" step="50" value={customMl}
                    onChange={e => setCustomMl(Number(e.target.value))}
                    style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                    placeholder="Custom ml"
                    onFocus={e => e.target.style.borderColor = '#3B82F6'}
                    onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                />
                <button onClick={() => addEntry(customMl)} className="btn btn-primary"
                    style={{ padding: '8px 14px', fontSize: 12, background: '#3B82F6', borderColor: '#3B82F6' }}>
                    <Plus size={13} /> Add
                </button>
            </div>
        </div>
    )
}

// ─── MOOD TRACKER ─────────────────────────────────────────────────────────────
function MoodTracker() {
    const [mood, setMood] = useState(null)
    const moods = [
        { emoji: '😔', label: 'Low', color: '#EF4444' },
        { emoji: '😐', label: 'Okay', color: '#F59E0B' },
        { emoji: '🙂', label: 'Good', color: '#3B82F6' },
        { emoji: '😊', label: 'Great', color: '#8BAF7C' },
        { emoji: '🤩', label: 'Amazing', color: '#22C55E' },
    ]
    return (
        <div className="card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 20 }}>💭</span>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Today's Mood</span>
                {mood && <span style={{ marginLeft: 'auto', fontSize: 20 }}>{moods.find(m => m.label === mood)?.emoji}</span>}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
                {moods.map(m => (
                    <button key={m.label} onClick={() => setMood(m.label)} style={{
                        flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit',
                        border: mood === m.label ? `2px solid ${m.color}` : '1.5px solid #E5E7EB',
                        background: mood === m.label ? m.color + '15' : 'white',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, transition: 'all 0.2s'
                    }}>
                        <span style={{ fontSize: 22 }}>{m.emoji}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: mood === m.label ? m.color : '#9CA3AF' }}>{m.label}</span>
                    </button>
                ))}
            </div>
        </div>
    )
}

// ─── STEPS TRACKER ────────────────────────────────────────────────────────────
function StepsTracker() {
    const [steps, setSteps] = useState(6432)
    const goal = 10000
    const p = pct(steps, goal)
    const cals = Math.round(steps * 0.04)
    const km = (steps * 0.00075).toFixed(1)
    return (
        <div className="card" style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: '#FEF9C3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👟</div>
                <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Steps Today</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#6B7280', fontWeight: 500 }}>{p}% of goal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
                <CircleProgress pct={p} size={88} stroke={9} color="#EAB308">
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#111827', lineHeight: 1 }}>{(steps / 1000).toFixed(1)}k</span>
                </CircleProgress>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[['🔥', `${cals} kcal`, 'Burned'], ['📍', `${km} km`, 'Distance'], ['🎯', `${goal.toLocaleString()}`, 'Goal']].map(([ic, val, lbl]) => (
                        <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ fontSize: 13 }}>{ic}</span>
                            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{val}</span>
                            <span style={{ fontSize: 11, color: '#9CA3AF' }}>{lbl}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="progress-bar-wrap">
                <div className="progress-bar-fill" style={{ width: `${p}%`, background: '#EAB308' }} />
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => setSteps(s => s + 500)} className="btn btn-primary" style={{ flex: 1, padding: '8px 0', fontSize: 12 }}><Plus size={13} /> +500</button>
                <button onClick={() => setSteps(s => s + 1000)} className="btn btn-secondary" style={{ flex: 1, padding: '8px 0', fontSize: 12 }}><Plus size={13} /> +1000</button>
            </div>
        </div>
    )
}

// ─── AI TIPS ────────────────────────────────────────────────────────────────
const tips = [
    { text: "Add more leafy greens today — you're 30g short on fiber this week.", cat: 'Nutrition' },
    { text: "Your sleep average is 6.8h. Aim for 7.5h tonight to optimize recovery.", cat: 'Sleep' },
    { text: "You've hit your protein goal 5 days in a row — excellent consistency!", cat: 'Protein' },
    { text: "Hydration tip: drink a glass of water before each meal to aid digestion.", cat: 'Hydration' },
    { text: "Light stretching after your evening walk improves flexibility 23% faster.", cat: 'Exercise' },
]

// ─── MAIN DASHBOARD ────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const navigate = useNavigate()
    const [tipIdx, setTipIdx] = useState(0)
    const [selectedDay, setSelectedDay] = useState(3)

    const username = localStorage.getItem('poshan_username') || localStorage.getItem('poshan_name') || 'Krishna'
    const initial = username.charAt(0).toUpperCase()

    useEffect(() => {
        const t = setInterval(() => setTipIdx(i => (i + 1) % tips.length), 6000)
        return () => clearInterval(t)
    }, [])

    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
    const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now)
        d.setDate(now.getDate() - now.getDay() + i)
        return { label: days[i], num: d.getDate(), active: i === now.getDay() }
    })
    const tip = tips[tipIdx]

    return (
        <div className="animate-fade">
            {/* Header */}
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">{greeting} 👋</span>
                    <span className="page-header-title" style={{
                        background: 'linear-gradient(135deg, #4D7A3E, #8BAF7C)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
                    }}>{username}</span>
                </div>
                <div className="page-header-right">
                    <span style={{ fontSize: 12, color: '#9CA3AF', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 20, padding: '5px 12px' }}>
                        📅 {now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button className="header-icon-btn" style={{ position: 'relative' }}>
                        <Bell size={18} />
                        <div style={{ position: 'absolute', top: 8, right: 8, width: 7, height: 7, borderRadius: '50%', background: '#EF4444', border: '1.5px solid white' }} />
                    </button>
                    <div className="header-avatar" style={{ background: 'linear-gradient(135deg, #7FA870, #4D7A3E)' }}>{initial}</div>
                </div>
            </div>

            <div className="page-body">
                {/* ── ROW 0: Quick stat pills ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 22 }}>
                    <StatPill icon="🔥" label="Calories Today" val="1,239 kcal" color="#F97316" trend="+8% vs avg" trendDir="up" />
                    <StatPill icon="💧" label="Water Intake" val="1,000 ml" color="#3B82F6" trend="50% of 2L" trendDir="up" />
                    <StatPill icon="💪" label="Protein Today" val="74g / 120g" color="#8BAF7C" trend="62% of goal" trendDir="up" />
                    <StatPill icon="❤️" label="Heart Rate" val="86 bpm" color="#EF4444" trend="Normal" trendDir="up" />
                </div>

                {/* ── ROW 1: Progress banner + Calorie Summary ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 22, marginBottom: 22 }}>
                    <div style={{ background: 'linear-gradient(145deg, #4D7A3E 0%, #8BAF7C 100%)', borderRadius: 24, padding: '24px 28px', position: 'relative', overflow: 'hidden', color: 'white' }}>
                        <div style={{ position: 'absolute', right: -30, top: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                        <div style={{ position: 'absolute', right: 40, bottom: -40, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                            <div>
                                <div style={{ fontSize: 13, opacity: 0.75, marginBottom: 4 }}>Your Weekly</div>
                                <div style={{ fontSize: 26, fontWeight: 800 }}>Progress</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 13, opacity: 0.75 }}>Goal</div>
                                <div style={{ fontSize: 28, fontWeight: 800 }}>75%</div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
                            {[['🔥', '6 day streak'], ['⭐', 'On track!']].map(([e, t]) => (
                                <span key={t} style={{ fontSize: 11, background: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: '4px 10px', fontWeight: 600 }}>{e} {t}</span>
                            ))}
                        </div>
                        <div style={{ display: 'flex', gap: 24, marginBottom: 12 }}>
                            {[['1,239', 'kcal today'], ['7.5h', 'sleep'], ['86bpm', 'heart rate'], ['6,432', 'steps']].map(([val, lbl]) => (
                                <div key={lbl}>
                                    <div style={{ fontSize: 16, fontWeight: 800 }}>{val}</div>
                                    <div style={{ fontSize: 10, opacity: 0.7 }}>{lbl}</div>
                                </div>
                            ))}
                        </div>
                        <ResponsiveContainer width="100%" height={60}>
                            <AreaChart data={weekCalories} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                                <defs>
                                    <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="white" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="white" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <Area type="monotone" dataKey="cal" stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="url(#wg)" dot={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Calorie ring + macros */}
                    <div className="card" style={{ padding: 22 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Calorie Summary</span>
                            <span style={{ fontSize: 11, color: '#8BAF7C', fontWeight: 600 }}>Today</span>
                        </div>
                        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                            <CircleProgress pct={pct(1239, 1500)} size={80} stroke={9} color="#8BAF7C">
                                <span style={{ fontSize: 13, fontWeight: 800, color: '#111827' }}>1,239</span>
                                <span style={{ fontSize: 9, color: '#9CA3AF' }}>kcal</span>
                            </CircleProgress>
                            <div style={{ flex: 1 }}>
                                {[['🎯', 'Target', '1,500 kcal', '#8BAF7C'], ['⚡', 'Remaining', '261 kcal', '#3B82F6'], ['🔥', 'Burned', '320 kcal', '#F97316']].map(([ic, lbl, val, c]) => (
                                    <div key={lbl} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 12 }}>
                                        <span style={{ color: '#6B7280' }}>{ic} {lbl}</span>
                                        <span style={{ fontWeight: 700, color: c }}>{val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: 14 }}>
                            {[['Protein', 74, 120, '#8BAF7C'], ['Carbs', 178, 250, '#3B82F6'], ['Fats', 45, 65, '#F97316']].map(([label, cur, goal, color]) => (
                                <div key={label} style={{ marginBottom: 8 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 12 }}>
                                        <span style={{ fontWeight: 600, color: '#374151' }}>{label}</span>
                                        <span style={{ color: '#6B7280' }}>{cur}<span style={{ color: '#D1D5DB' }}>/{goal}g</span></span>
                                    </div>
                                    <div className="progress-bar-wrap">
                                        <div className="progress-bar-fill" style={{ width: `${pct(cur, goal)}%`, background: color }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── ROW 2: Week calendar ── */}
                <div className="card" style={{ padding: '18px 24px', marginBottom: 22 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Week Calendar</span>
                        <span style={{ fontSize: 12, color: '#9CA3AF' }}>{now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {weekDates.map((d, i) => (
                            <button key={i} onClick={() => setSelectedDay(i)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '8px 10px', borderRadius: 14, background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                                <span style={{ fontSize: 10, color: selectedDay === i ? '#8BAF7C' : '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>{d.label}</span>
                                <div style={{ width: 36, height: 36, borderRadius: '50%', background: selectedDay === i ? '#8BAF7C' : 'transparent', border: selectedDay === i ? 'none' : d.active ? '2px solid #8BAF7C' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: selectedDay === i ? 'white' : '#374151', boxShadow: selectedDay === i ? '0 4px 12px rgba(139,175,124,0.35)' : 'none', transition: 'all 0.2s' }}>{d.num}</div>
                                <div style={{ width: 5, height: 5, borderRadius: '50%', background: i < 4 ? '#8BAF7C' : '#F3F4F6' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── ROW 3: AI Tip + Mood ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 22, marginBottom: 22 }}>
                    <div style={{ background: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)', border: '1px solid #DDD6FE', borderRadius: 20, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ width: 44, height: 44, borderRadius: 14, background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🤖</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 10, fontWeight: 800, color: '#7C3AED', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>AI NUTRITION TIP · {tip.cat}</div>
                            <div style={{ fontSize: 14, color: '#374151', lineHeight: 1.5, fontWeight: 500 }}>{tip.text}</div>
                        </div>
                        <button onClick={() => setTipIdx(i => (i + 1) % tips.length)} style={{ background: '#7C3AED', border: 'none', borderRadius: 10, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', flexShrink: 0 }}>
                            <Zap size={14} />
                        </button>
                    </div>
                    <MoodTracker />
                </div>

                {/* ── ROW 4: Timers Grid ── */}
                <div style={{ fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 14 }}>🏃 Activity Timers</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginBottom: 22 }}>
                    <TimerWidget title="Exercise Timer" emoji="💪" color="#F97316"
                        presets={[{ label: '15 min', secs: 900 }, { label: '30 min', secs: 1800 }, { label: '45 min', secs: 2700 }, { label: '60 min', secs: 3600 }]}
                        defaultSecs={1800} />
                    <TimerWidget title="Meditation Timer" emoji="🧘" color="#7C3AED"
                        presets={[{ label: '5 min', secs: 300 }, { label: '10 min', secs: 600 }, { label: '15 min', secs: 900 }, { label: '20 min', secs: 1200 }]}
                        defaultSecs={600} />
                    <SleepTracker />
                </div>

                {/* ── ROW 5: Today's Meals (with nutrition input) ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#111827' }}>🍽️ Today's Meals</span>
                    <span style={{ fontSize: 12, color: '#6B7280' }}>Tap meal to add food • auto-calculates nutrients</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14, marginBottom: 22 }}>
                    <MealLogger mealType="breakfast" emoji="🥣" color="#F97316" bgColor="#FFF7ED" time="08:30" />
                    <MealLogger mealType="lunch" emoji="🍱" color="#3B82F6" bgColor="#EFF6FF" time="13:00" />
                    <MealLogger mealType="dinner" emoji="🍛" color="#8BAF7C" bgColor="#F0FDF4" time="19:30" />
                    <MealLogger mealType="snacks" emoji="🍌" color="#EAB308" bgColor="#FEFCE8" time="16:30" />
                </div>

                {/* ── ROW 6: Steps + Hydration ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22, marginBottom: 22 }}>
                    <StepsTracker />
                    <HydrationTracker />
                </div>

                {/* ── ROW 7: BMI + Upcoming Appointment ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
                    {/* BMI */}
                    <div className="card" style={{ padding: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#E8F1E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚖️</div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>BMI Tracker</span>
                            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 700, background: '#D1FAE5', color: '#059669', padding: '3px 8px', borderRadius: 20 }}>Normal</span>
                        </div>
                        <div style={{ textAlign: 'center', marginBottom: 14 }}>
                            <span style={{ fontSize: 40, fontWeight: 800, color: '#111827' }}>20.8</span>
                            <span style={{ fontSize: 14, color: '#9CA3AF', marginLeft: 6 }}>BMI</span>
                        </div>
                        <div style={{ position: 'relative', marginBottom: 8 }}>
                            <div style={{ height: 10, borderRadius: 20, background: 'linear-gradient(to right, #3B82F6 0%, #22C55E 30%, #22C55E 60%, #F59E0B 75%, #EF4444 100%)' }} />
                            <div style={{ position: 'absolute', top: -4, left: `${((20.8 - 10) / 40) * 100}%`, width: 18, height: 18, background: 'white', border: '3px solid #111827', borderRadius: '50%', transform: 'translateX(-50%)' }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: '#9CA3AF', marginBottom: 12 }}>
                            {['Underweight', 'Normal', 'Overweight', 'Obese'].map(l => <span key={l}>{l}</span>)}
                        </div>
                        {[['Height', '170 cm'], ['Weight', '53 kg'], ['Ideal Weight', '55–72 kg']].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                                <span style={{ color: '#6B7280' }}>{k}</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming appointment — CHAT ONLY, no video */}
                    <div className="card" style={{ padding: 22 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <div style={{ width: 38, height: 38, borderRadius: 12, background: '#E8F1E4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📅</div>
                            <span style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Next Appointment</span>
                        </div>
                        <div style={{ background: 'linear-gradient(135deg, #8BAF7C, #4D7A3E)', borderRadius: 18, padding: 20, color: 'white', marginBottom: 14 }}>
                            <div style={{ fontSize: 12, opacity: 0.75, marginBottom: 3 }}>Today at 3:00 PM</div>
                            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2 }}>Dr. Bipasha</div>
                            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 14 }}>M.Sc in Nutrition & Dietetics</div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => navigate('/app/messages')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 12, padding: '7px 14px', fontSize: 12, color: 'white', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    💬 Chat
                                </button>
                            </div>
                        </div>
                        <button onClick={() => navigate('/app/search')} className="btn btn-primary" style={{ width: '100%', padding: '10px 0', fontSize: 13 }}>
                            <Calendar size={14} /> Book New Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
