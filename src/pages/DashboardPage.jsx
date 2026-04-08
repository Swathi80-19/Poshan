import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarClock,
  ChevronRight,
  Droplets,
  Dumbbell,
  MessageSquare,
  MoonStar,
  Sparkles,
  Target,
  Utensils,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { useTracking } from '../context/TrackingContext'
import {
  getDaySnapshot,
  getMacroTotals,
  round,
} from '../lib/tracking'

const mealOrder = {
  Breakfast: '08:00',
  Lunch: '13:00',
  Dinner: '19:30',
  Snack: '16:30',
}

function buildCareNotes(daySnapshot, profile) {
  const notes = []

  if (daySnapshot.protein < profile.proteinGoal) {
    notes.push(`Protein is ${profile.proteinGoal - daySnapshot.protein}g below target. Add a higher-protein lunch or snack to close the gap.`)
  }

  if (daySnapshot.water < profile.waterGoal) {
    notes.push(`Hydration is short by ${profile.waterGoal - daySnapshot.water} ml. Splitting water before lunch and before dinner will lift the chart quickly.`)
  }

  if (daySnapshot.sleepHours < profile.sleepGoal) {
    notes.push(`Sleep is below goal by ${round(profile.sleepGoal - daySnapshot.sleepHours, 1)} hours. Recovery metrics will look stronger after one earlier night.`)
  }

  if (daySnapshot.activeMinutes < profile.activeMinutesGoal && daySnapshot.steps < profile.stepGoal) {
    notes.push('Movement is lagging on both active minutes and steps. Even one walk block will improve the readiness trend.')
  }

  if (!notes.length) {
    notes.push('Your current logs are balanced across nutrition, hydration, and recovery. Keep entering meals to maintain the upward trend.')
  }

  return notes.slice(0, 3)
}

function getStrongDayStreak(dailyData) {
  let streak = 0

  for (let index = dailyData.length - 1; index >= 0; index -= 1) {
    if (dailyData[index].adherence >= 75) {
      streak += 1
    } else if (dailyData[index].meals || dailyData[index].checkIns) {
      break
    }
  }

  return streak
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const username = localStorage.getItem('poshan_username') || localStorage.getItem('poshan_name') || 'Krishna'
  const initial = username.charAt(0).toUpperCase()
  const { profile, foodEntries, dailyData, latestDay, summary } = useTracking()

  const greeting = useMemo(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }, [])

  const daySnapshot = getDaySnapshot(dailyData, latestDay)
  const weekAdherence = dailyData.map((day) => ({ day: day.day, score: day.adherence }))
  const macroTotals = getMacroTotals(foodEntries)
  const proteinLeft = Math.max(profile.proteinGoal - daySnapshot.protein, 0)
  const strongDayStreak = getStrongDayStreak(dailyData)
  const careNotes = buildCareNotes(daySnapshot, profile)

  const mealEntries = [...foodEntries]
    .filter((entry) => entry.day === latestDay)
    .sort((left, right) => (mealOrder[left.mealType] || '23:59').localeCompare(mealOrder[right.mealType] || '23:59'))

  const protocolTimeline = mealEntries.length
    ? mealEntries.map((entry) => ({
        time: mealOrder[entry.mealType] || 'Anytime',
        title: `${entry.mealType} logged`,
        sub: `${entry.foodName} · ${entry.calories} kcal`,
        state: 'Done',
      }))
    : [
        { time: '08:00', title: 'Breakfast not logged', sub: 'Use the tracker to add the first meal of the day.', state: 'Next' },
        { time: '13:00', title: 'Lunch not logged', sub: 'Once meals are entered, this section becomes your meal timeline.', state: 'Later' },
      ]

  const metrics = [
    { icon: Sparkles, label: 'Readiness score', value: `${daySnapshot.adherence}`, foot: `${summary.averageAdherence}% weekly average`, tone: '#f8eccc', accent: '#c9953b' },
    { icon: Droplets, label: 'Hydration pace', value: `${round(daySnapshot.water / 1000, 1)}L`, foot: `${Math.min(round((daySnapshot.water / profile.waterGoal) * 100), 100)}% of daily target`, tone: '#e8f0fb', accent: '#4d82b7' },
    { icon: Utensils, label: 'Protein progress', value: `${daySnapshot.protein}g`, foot: proteinLeft ? `${proteinLeft}g left for goal` : 'Target reached', tone: '#e7efe0', accent: '#73955f' },
    { icon: Dumbbell, label: 'Movement block', value: `${round(daySnapshot.steps / 1000, 1)}k`, foot: `${daySnapshot.activeMinutes} active minutes`, tone: '#eee6fa', accent: '#7a61b8' },
  ]

  const macroProgress = [
    { label: 'Protein', value: daySnapshot.protein, goal: profile.proteinGoal, color: '#73955f' },
    { label: 'Carbs', value: daySnapshot.carbs, goal: profile.carbsGoal, color: '#4d82b7' },
    { label: 'Fats', value: daySnapshot.fats, goal: profile.fatsGoal, color: '#c9953b' },
    { label: 'Fibre', value: daySnapshot.fiber, goal: profile.fiberGoal, color: '#7a61b8' },
  ]

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">{greeting}</span>
          <span className="page-header-title">{username}&rsquo;s careboard</span>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">Live tracker connected</span>
          <button className="header-icon-btn" style={{ position: 'relative' }}>
            <Bell size={18} />
            <span className="notification-dot" />
          </button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body">
        <section className="dashboard-hero">
          <div className="dashboard-hero-grid">
            <div>
              <div className="eyebrow">Daily command center</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Your charts now respond to logged meals, hydration, movement, and recovery inputs.
              </h2>
              <p className="hero-copy">
                {latestDay} currently shows {daySnapshot.calories} kcal, {daySnapshot.protein}g protein, {daySnapshot.water} ml water,
                and {daySnapshot.activeMinutes} active minutes. Add new inputs in the tracker page to refresh this view.
              </p>

              <div className="pill-row">
                <span className="badge badge-amber">Readiness {daySnapshot.adherence}/100</span>
                <span className="badge badge-green">{strongDayStreak} strong days in a row</span>
                <span className="badge badge-sky">{summary.activeDays}/7 active days</span>
              </div>

              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate('/app/activity')}>
                  <Utensils size={16} />
                  Log food & activity
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/app/statistics')}>
                  Open live graphs
                </button>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Weekly adherence</h3>
                  <p>Composite of diet intake, hydration, movement, and sleep quality</p>
                </div>
                <span className="badge badge-green">Updates from tracker</span>
              </div>

              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={weekAdherence}>
                  <defs>
                    <linearGradient id="adherenceFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#73955f" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#73955f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(92, 120, 74, 0.08)" vertical={false} />
                  <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#7f8776', fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#73955f" strokeWidth={3} fill="url(#adherenceFill)" />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{strongDayStreak}</strong>
                  <span>strong days in a row</span>
                </div>
                <div className="mini-metric">
                  <strong>{proteinLeft}g</strong>
                  <span>protein left to hit target</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {metrics.map(({ icon: Icon, label, value, foot, tone, accent }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <Icon size={19} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Live</span>
              </div>
              <div className="metric-card-value">{value}</div>
              <div className="metric-card-label">{label}</div>
              <div className="metric-card-foot" style={{ color: accent }}>{foot}</div>
            </article>
          ))}
        </section>

        <div className="g-2">
          <section className="timeline-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Meal cadence</h3>
                <p>Food entries on {latestDay} are shown here as soon as you log them</p>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => navigate('/app/activity')}>
                Open tracker
              </button>
            </div>

            <div className="timeline-list">
              {protocolTimeline.map((item) => (
                <div key={`${item.time}-${item.title}`} className="timeline-item">
                  <div className="timeline-time">{item.time}</div>
                  <div>
                    <div className="timeline-title">{item.title}</div>
                    <div className="timeline-sub">{item.sub}</div>
                  </div>
                  <div className={`timeline-status status-${item.state.toLowerCase()}`}>{item.state}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="insight-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Precision macros</h3>
                <p>Daily targets translated into progress based on your current inputs</p>
              </div>
              <Target size={18} color="#73955f" />
            </div>

            {macroProgress.map((item) => {
              const progress = Math.round((item.value / item.goal) * 100)
              return (
                <div key={item.label} style={{ marginBottom: '1rem' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ fontWeight: 800 }}>{item.label}</span>
                    <span style={{ color: '#7f8776', fontSize: '0.84rem' }}>
                      {item.value}
                      <span style={{ opacity: 0.5 }}>/{item.goal}</span>
                    </span>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${Math.min(progress, 100)}%`, background: item.color }} />
                  </div>
                </div>
              )
            })}

            <div className="insight-note" style={{ marginTop: '1.1rem' }}>
              <strong>Weekly macro total</strong>
              <p>
                Protein {macroTotals.protein}g, carbs {macroTotals.carbs}g, fats {macroTotals.fats}g, and fiber {macroTotals.fiber}g
                across all logged meals.
              </p>
            </div>
          </section>
        </div>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Tracker prompts</h3>
                <p>Small actions that would improve chart accuracy the fastest</p>
              </div>
              <CalendarClock size={18} color="#c9953b" />
            </div>

            <ul className="check-list">
              <li><span className="check-dot">1</span><span>Log each meal with calories and macros so the calorie deficit graph stays accurate.</span></li>
              <li><span className="check-dot">2</span><span>Add water, sleep, and step entries daily to strengthen the adherence and recovery charts.</span></li>
              <li><span className="check-dot">3</span><span>Update your goals in the tracker whenever your diet plan changes.</span></li>
            </ul>

            <div className="auth-actions" style={{ marginTop: '1.2rem' }}>
              <button className="btn btn-primary" onClick={() => navigate('/app/activity')}>
                Open tracker
              </button>
              <button className="btn btn-outline" onClick={() => navigate('/app/messages')}>
                <MessageSquare size={16} />
                Share with nutritionist
              </button>
            </div>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recovery notes</h3>
                <p>Insights generated from your latest tracker values</p>
              </div>
              <MoonStar size={18} color="#7a61b8" />
            </div>

            <div className="mini-metric-grid" style={{ marginTop: 0, marginBottom: '1rem' }}>
              <div className="mini-metric">
                <strong>{summary.averageSleep}h</strong>
                <span>average sleep</span>
              </div>
              <div className="mini-metric">
                <strong>{summary.latestWeight} kg</strong>
                <span>latest logged weight</span>
              </div>
            </div>

            <div className="timeline-list">
              {careNotes.map((note) => (
                <div key={note} className="admin-note">
                  {note}
                </div>
              ))}
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/app/statistics')}>
              Deep dive into statistics
              <ChevronRight size={16} />
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
