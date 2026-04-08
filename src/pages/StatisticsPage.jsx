import { useMemo, useState } from 'react'
import { Bell, Droplets, MoonStar, Sparkles, TrendingDown, TrendingUp, Utensils } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useTracking } from '../context/TrackingContext'
import { getMemberDisplayName } from '../lib/session'
import {
  getMacroTotals,
  getWeightTrend,
  round,
} from '../lib/tracking'

const PALETTE = {
  primary: '#73955f',
  primarySoft: '#d2e0c8',
  deep: '#465c39',
  gold: '#c9953b',
  goldSoft: '#f8eccc',
  mist: '#cdd7d0',
  clay: '#d4a47d',
  claySoft: '#f3e4d8',
  ink: '#1f241d',
  muted: '#7f8776',
  line: 'rgba(92, 120, 74, 0.1)',
  panel: 'rgba(255, 252, 247, 0.82)',
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: PALETTE.panel,
        border: `1px solid ${PALETTE.line}`,
        borderRadius: 16,
        padding: '10px 12px',
        boxShadow: '0 16px 32px rgba(57, 44, 23, 0.08)',
      }}
    >
      <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: PALETTE.muted, marginBottom: 6 }}>
        {label}
      </div>
      {payload.map((item) => (
        <div key={`${item.dataKey}-${item.value}`} style={{ display: 'flex', gap: 8, fontSize: 12, marginTop: 2 }}>
          <span style={{ color: item.color || PALETTE.deep, fontWeight: 700 }}>
            {item.name || item.dataKey}
          </span>
          <span style={{ color: PALETTE.ink }}>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function ChartFrame({ title, subtitle, children, action }) {
  return (
    <div className="card" style={{ padding: 24 }}>
      <div className="dashboard-panel-heading">
        <div>
          <h3 style={{ fontSize: '1.35rem' }}>{title}</h3>
          <p>{subtitle}</p>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function scoreFromRatio(value, goal) {
  if (!goal) return 100
  return Math.min(round((value / goal) * 100), 100)
}

export default function StatisticsPage() {
  const [period, setPeriod] = useState('7 days')
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()
  const { profile, dailyData, foodEntries, summary, latestDay } = useTracking()

  const periodDays = useMemo(() => {
    if (period === 'Today') {
      return dailyData.filter((day) => day.day === latestDay)
    }

    return dailyData
  }, [dailyData, latestDay, period])

  const selectedDayLabels = periodDays.map((day) => day.day)
  const selectedFoodEntries = foodEntries.filter((entry) => selectedDayLabels.includes(entry.day))
  const selectedMacros = getMacroTotals(selectedFoodEntries)
  const averageCalories = round(periodDays.reduce((sum, day) => sum + day.calories, 0) / Math.max(periodDays.length, 1))
  const currentWeight = [...periodDays].reverse().find((day) => day.weight !== null)?.weight ?? summary.latestWeight
  const consistencyScore = round(periodDays.reduce((sum, day) => sum + day.adherence, 0) / Math.max(periodDays.length, 1))
  const activeDayCount = periodDays.filter((day) => day.activeMinutes > 0 || day.steps > 0).length
  const weightChange = round((getWeightTrend(dailyData)[0]?.kg ?? currentWeight) - currentWeight, 1)
  const calorieDelta = round(periodDays.reduce((sum, day) => sum + day.deficit, 0) / Math.max(periodDays.length, 1))

  const weekData = dailyData.map((day) => ({
    day: day.day,
    kcal: day.calories,
    goal: profile.calorieGoal,
    deficit: day.deficit,
  }))

  const weightData = getWeightTrend(dailyData)

  const macrosPie = [
    { name: 'Protein', value: selectedMacros.protein || 0, color: PALETTE.primary },
    { name: 'Carbs', value: selectedMacros.carbs || 0, color: PALETTE.mist },
    { name: 'Fats', value: selectedMacros.fats || 0, color: PALETTE.gold },
    { name: 'Fiber', value: selectedMacros.fiber || 0, color: PALETTE.clay },
  ]

  const exerciseData = dailyData.map((day) => ({ day: day.day, min: day.activeMinutes }))
  const sleepData = dailyData.map((day) => ({ day: day.day, hours: day.sleepHours, quality: day.sleepQuality }))
  const waterData = dailyData.map((day) => ({ day: day.day, actual: day.water, goal: profile.waterGoal }))

  const daysInScope = Math.max(periodDays.length, 1)
  const radialData = [
    { name: 'Protein', value: scoreFromRatio(selectedMacros.protein, profile.proteinGoal * daysInScope), fill: PALETTE.primary },
    { name: 'Carbs', value: scoreFromRatio(selectedMacros.carbs, profile.carbsGoal * daysInScope), fill: PALETTE.mist },
    { name: 'Fats', value: scoreFromRatio(selectedMacros.fats, profile.fatsGoal * daysInScope), fill: PALETTE.gold },
    { name: 'Fiber', value: scoreFromRatio(selectedMacros.fiber, profile.fiberGoal * daysInScope), fill: PALETTE.clay },
    { name: 'Water', value: scoreFromRatio(periodDays.reduce((sum, day) => sum + day.water, 0), profile.waterGoal * daysInScope), fill: '#8aa7c6' },
    { name: 'Movement', value: scoreFromRatio(periodDays.reduce((sum, day) => sum + day.activeMinutes, 0), profile.activeMinutesGoal * daysInScope), fill: '#8d7f64' },
  ]

  const consistencyData = [
    { metric: 'Meals', score: round(periodDays.reduce((sum, day) => sum + Math.min((day.meals / 3) * 100, 100), 0) / daysInScope) },
    { metric: 'Hydration', score: round(periodDays.reduce((sum, day) => sum + scoreFromRatio(day.water, profile.waterGoal), 0) / daysInScope) },
    { metric: 'Sleep', score: round(periodDays.reduce((sum, day) => sum + scoreFromRatio(day.sleepHours, profile.sleepGoal), 0) / daysInScope) },
    { metric: 'Movement', score: round(periodDays.reduce((sum, day) => sum + scoreFromRatio(day.activeMinutes, profile.activeMinutesGoal), 0) / daysInScope) },
    { metric: 'Protein', score: round(periodDays.reduce((sum, day) => sum + scoreFromRatio(day.protein, profile.proteinGoal), 0) / daysInScope) },
  ]

  const achievements = [
    { icon: Sparkles, label: `${consistencyScore}% consistency`, sub: 'Average adherence score in the selected view', color: PALETTE.goldSoft, accent: PALETTE.gold },
    { icon: Droplets, label: `${round(summary.averageHydration / 1000, 1)}L hydration avg`, sub: 'Tracker entries are feeding the water chart', color: '#eef3ef', accent: PALETTE.primary },
    { icon: TrendingDown, label: `${currentWeight} kg latest weight`, sub: `${weightChange >= 0 ? '-' : '+'}${Math.abs(weightChange)} kg change from earliest log`, color: PALETTE.claySoft, accent: PALETTE.clay },
    { icon: MoonStar, label: `${summary.averageSleep}h sleep avg`, sub: 'Recovery data now updates the performance layer', color: '#f1ede6', accent: PALETTE.deep },
  ]

  const segmentedWrap = {
    display: 'flex',
    padding: 4,
    borderRadius: 999,
    background: 'rgba(255,252,247,0.95)',
    border: `1px solid ${PALETTE.line}`,
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Performance review</span>
          <span className="page-header-title">Statistics</span>
        </div>
        <div className="page-header-right">
          <div style={segmentedWrap}>
            {['Today', '7 days'].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPeriod(item)}
                style={{
                  minWidth: 74,
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: period === item ? `linear-gradient(135deg, ${PALETTE.primary}, ${PALETTE.deep})` : 'transparent',
                  color: period === item ? 'white' : PALETTE.muted,
                  fontWeight: 700,
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body">
        <div className="summary-grid">
          {[
            { label: 'Average intake', value: `${averageCalories}`, suffix: 'kcal/day', accent: PALETTE.gold, tone: PALETTE.goldSoft },
            { label: 'Current weight', value: `${currentWeight}`, suffix: 'kg', accent: PALETTE.primary, tone: '#eef3ef' },
            { label: 'Consistency', value: `${consistencyScore}`, suffix: 'score', accent: PALETTE.deep, tone: '#f1ede6' },
            { label: 'Active days', value: `${activeDayCount}/${daysInScope}`, suffix: 'tracked', accent: PALETTE.clay, tone: PALETTE.claySoft },
          ].map((item) => (
            <div key={item.label} className="metric-card">
              <div className="metric-card-top">
                <span className="eyebrow" style={{ letterSpacing: '0.12em' }}>{item.label}</span>
                <span style={{ color: item.accent, fontWeight: 800 }}>Live</span>
              </div>
              <div className="metric-card-value" style={{ color: item.accent }}>{item.value}</div>
              <div className="metric-card-label">{item.suffix}</div>
              <div style={{ marginTop: 14, height: 8, borderRadius: 999, background: item.tone }} />
            </div>
          ))}
        </div>

        <div className="g-2">
          <ChartFrame
            title="Calorie deficit"
            subtitle="Goal versus actual intake rebuilt from your logged meals"
            action={<span className="badge badge-green">{calorieDelta >= 0 ? `${calorieDelta} kcal under target` : `${Math.abs(calorieDelta)} kcal over target`}</span>}
          >
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={weekData}>
                <defs>
                  <linearGradient id="deficitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.primary} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={PALETTE.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={PALETTE.line} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <ReferenceLine y={0} stroke={PALETTE.line} strokeDasharray="4 4" />
                <Bar dataKey="deficit" name="Deficit" radius={[8, 8, 0, 0]} fill={PALETTE.primarySoft} />
                <Line type="monotone" dataKey="kcal" name="Actual intake" stroke={PALETTE.deep} strokeWidth={2.5} dot={{ fill: PALETTE.deep, r: 3 }} />
                <Area type="monotone" dataKey="goal" name="Goal" stroke={PALETTE.gold} strokeWidth={2} fill="url(#deficitFill)" fillOpacity={0.3} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartFrame>

          <ChartFrame
            title="Weight trend"
            subtitle="Weight entries now come from tracker check-ins"
            action={
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: PALETTE.primary, fontWeight: 700 }}>
                <TrendingDown size={14} /> {weightChange >= 0 ? `-${weightChange}` : `+${Math.abs(weightChange)}`}kg
              </span>
            }
          >
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={PALETTE.gold} stopOpacity={0.24} />
                    <stop offset="95%" stopColor={PALETTE.gold} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={PALETTE.line} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="kg" name="Weight" stroke={PALETTE.gold} strokeWidth={3} fill="url(#weightFill)" dot={{ fill: PALETTE.gold, r: 4 }} connectNulls />
              </AreaChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className="g-2">
          <ChartFrame title="Macro split" subtitle="Selected nutrition period shown as a live macro distribution">
            <div className="stats-macro-layout">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={macrosPie} innerRadius={54} outerRadius={82} paddingAngle={3} dataKey="value">
                    {macrosPie.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="timeline-list">
                {macrosPie.map((entry) => (
                  <div key={entry.name} className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                    <div style={{ width: 12, height: 12, borderRadius: 999, background: entry.color }} />
                    <div className="signal-title">{entry.name}</div>
                    <div className="signal-meta" style={{ color: entry.color, fontWeight: 800 }}>{entry.value}g</div>
                  </div>
                ))}
              </div>
            </div>
          </ChartFrame>

          <ChartFrame title="Daily target coverage" subtitle="Food and activity goals rolled into one view">
            <ResponsiveContainer width="100%" height={250}>
              <RadialBarChart data={radialData} innerRadius="18%" outerRadius="92%" startAngle={180} endAngle={0}>
                <RadialBar dataKey="value" background={{ fill: '#efe7da' }} cornerRadius={8} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
              </RadialBarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className="g-2">
          <ChartFrame
            title="Exercise cadence"
            subtitle="Movement minutes now follow your activity check-ins"
            action={<span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: PALETTE.gold, fontWeight: 700 }}><TrendingUp size={14} /> {summary.activeDays}/7 active days</span>}
          >
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={exerciseData} barSize={26}>
                <CartesianGrid stroke={PALETTE.line} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="min" name="Minutes" radius={[10, 10, 0, 0]}>
                  {exerciseData.map((entry) => (
                    <Cell key={entry.day} fill={entry.min === 0 ? '#e9e2d6' : entry.min >= profile.activeMinutesGoal ? PALETTE.primary : PALETTE.gold} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>

          <ChartFrame title="Recovery pattern" subtitle="Sleep hours and quality based on tracker recovery logs">
            <ResponsiveContainer width="100%" height={240}>
              <ComposedChart data={sleepData}>
                <CartesianGrid stroke={PALETTE.line} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" name="Sleep hours" fill={PALETTE.mist} radius={[10, 10, 0, 0]} />
                <Line type="monotone" dataKey="quality" name="Quality %" stroke={PALETTE.deep} strokeWidth={2.5} dot={{ fill: PALETTE.deep, r: 3 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className="g-2">
          <ChartFrame title="Hydration versus goal" subtitle="Actual water intake plotted against your saved target">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={waterData} barSize={24}>
                <CartesianGrid stroke={PALETTE.line} vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="goal" name="Goal" fill="#e9e2d6" radius={[10, 10, 0, 0]} />
                <Bar dataKey="actual" name="Actual" fill={PALETTE.primary} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartFrame>

          <ChartFrame title="Habit consistency" subtitle="Broader behavior quality across meals, hydration, sleep, and movement">
            <ResponsiveContainer width="100%" height={240}>
              <RadarChart data={consistencyData}>
                <PolarGrid stroke={PALETTE.line} />
                <PolarAngleAxis dataKey="metric" tick={{ fill: PALETTE.muted, fontSize: 11 }} />
                <Radar dataKey="score" stroke={PALETTE.deep} fill={PALETTE.primarySoft} fillOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartFrame>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <div className="dashboard-panel-heading">
            <div>
              <h3 style={{ fontSize: '1.35rem' }}>Tracker highlights</h3>
              <p>Signals created directly from your new meal and activity inputs</p>
            </div>
            <Utensils size={18} color={PALETTE.gold} />
          </div>
          <div className="g-4" style={{ marginBottom: 0 }}>
            {achievements.map((item) => {
              const Icon = item.icon

              return (
                <div key={item.label} className="metric-card" style={{ background: item.color }}>
                  <div className="metric-card-icon" style={{ background: 'rgba(255,255,255,0.55)' }}>
                    <Icon size={18} color={item.accent} />
                  </div>
                  <div style={{ fontWeight: 800, marginTop: 10 }}>{item.label}</div>
                  <div className="metric-card-label" style={{ marginTop: 6 }}>{item.sub}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
