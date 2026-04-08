import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Droplets,
  Dumbbell,
  MoonStar,
  Save,
  Scale,
  Target,
  Utensils,
} from 'lucide-react'
import { useTracking } from '../context/TrackingContext'
import {
  DAY_ORDER,
  MEAL_OPTIONS,
  formatDateTime,
  getDaySnapshot,
  round,
} from '../lib/tracking'
import { getMemberDisplayName } from '../lib/session'

function createFoodForm(day) {
  return {
    day,
    mealType: 'Breakfast',
    foodName: '',
    calories: '',
    protein: '',
    carbs: '',
    fats: '',
    fiber: '',
  }
}

function createActivityForm(day) {
  return {
    day,
    steps: '',
    activeMinutes: '',
    water: '',
    sleepHours: '',
    sleepQuality: '',
    weight: '',
    mood: '',
    notes: '',
  }
}

export default function ActivityPage() {
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()
  const {
    profile,
    dailyData,
    latestDay,
    foodEntries,
    activityEntries,
    updateProfile,
    addFoodEntry,
    addActivityEntry,
  } = useTracking()

  const [goalDraft, setGoalDraft] = useState(profile)
  const [foodForm, setFoodForm] = useState(() => createFoodForm(latestDay))
  const [activityForm, setActivityForm] = useState(() => createActivityForm(latestDay))

  useEffect(() => {
    setGoalDraft(profile)
  }, [profile])

  const todaySnapshot = useMemo(() => getDaySnapshot(dailyData, latestDay), [dailyData, latestDay])

  const recentFoodEntries = useMemo(
    () => [...foodEntries].sort((left, right) => new Date(right.loggedAt) - new Date(left.loggedAt)).slice(0, 5),
    [foodEntries],
  )

  const recentActivityEntries = useMemo(
    () => [...activityEntries].sort((left, right) => new Date(right.loggedAt) - new Date(left.loggedAt)).slice(0, 5),
    [activityEntries],
  )

  const totalCheckIns = activityEntries.length
  const mealCoverage = round((todaySnapshot.calories / profile.calorieGoal) * 100)
  const hydrationCoverage = round((todaySnapshot.water / profile.waterGoal) * 100)
  const activityCoverage = round(
    (((todaySnapshot.steps / profile.stepGoal) + (todaySnapshot.activeMinutes / profile.activeMinutesGoal)) / 2) * 100,
  )

  const handleGoalSubmit = (event) => {
    event.preventDefault()
    updateProfile(goalDraft)
  }

  const handleFoodSubmit = (event) => {
    event.preventDefault()

    if (!foodForm.foodName.trim()) {
      return
    }

    addFoodEntry(foodForm)
    setFoodForm(createFoodForm(foodForm.day))
  }

  const handleActivitySubmit = (event) => {
    event.preventDefault()
    addActivityEntry(activityForm)
    setActivityForm(createActivityForm(activityForm.day))
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Daily tracker</span>
          <span className="page-header-title">Nutrition & activity inputs</span>
        </div>
        <div className="page-header-right">
          <span className="badge badge-green">{latestDay} in focus</span>
          <button className="header-icon-btn"><Bell size={18} /></button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body">
        <div className="summary-grid">
          {[
            { label: 'Meals logged', value: foodEntries.length, foot: `${todaySnapshot.meals} meals on ${latestDay}`, icon: Utensils, accent: '#73955f', tone: '#eef3ef' },
            { label: 'Diet goal coverage', value: `${Math.min(mealCoverage, 100)}%`, foot: `${todaySnapshot.calories}/${profile.calorieGoal} kcal today`, icon: Target, accent: '#c9953b', tone: '#f8eccc' },
            { label: 'Hydration pace', value: `${Math.min(hydrationCoverage, 100)}%`, foot: `${todaySnapshot.water}/${profile.waterGoal} ml today`, icon: Droplets, accent: '#4d82b7', tone: '#e8f0fb' },
            { label: 'Activity logs', value: totalCheckIns, foot: `${Math.min(activityCoverage, 100)}% movement coverage`, icon: Dumbbell, accent: '#7a61b8', tone: '#f1ede6' },
          ].map((item) => {
            const Icon = item.icon

            return (
              <div key={item.label} className="metric-card">
                <div className="metric-card-top">
                  <div className="metric-card-icon" style={{ background: item.tone }}>
                    <Icon size={18} color={item.accent} />
                  </div>
                  <span style={{ color: item.accent, fontWeight: 800 }}>Live</span>
                </div>
                <div className="metric-card-value" style={{ color: item.accent }}>{item.value}</div>
                <div className="metric-card-label">{item.label}</div>
                <div className="metric-card-foot">{item.foot}</div>
              </div>
            )
          })}
        </div>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Goal settings</h3>
                <p>These targets power the coverage bars and all chart calculations.</p>
              </div>
              <span className="badge badge-amber">Shared across dashboard</span>
            </div>

            <form onSubmit={handleGoalSubmit}>
              <div className="tracker-form-grid tracker-form-grid-3">
                {[
                  ['Calorie goal', 'calorieGoal', 'kcal'],
                  ['Protein goal', 'proteinGoal', 'g'],
                  ['Carbs goal', 'carbsGoal', 'g'],
                  ['Fats goal', 'fatsGoal', 'g'],
                  ['Fiber goal', 'fiberGoal', 'g'],
                  ['Water goal', 'waterGoal', 'ml'],
                  ['Step goal', 'stepGoal', 'steps'],
                  ['Active minutes', 'activeMinutesGoal', 'min'],
                  ['Sleep goal', 'sleepGoal', 'hrs'],
                ].map(([label, key, unit]) => (
                  <label key={key} className="form-group">
                    <span className="form-label">
                      {label}
                      <span className="tracker-field-unit">{unit}</span>
                    </span>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      value={goalDraft[key]}
                      onChange={(event) => setGoalDraft((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </label>
                ))}
              </div>

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  <Save size={16} />
                  Save goals
                </button>
              </div>
            </form>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Meal input</h3>
                <p>Add foods and macros so the calorie and nutrient graphs change immediately.</p>
              </div>
              <span className="badge badge-green">Food log</span>
            </div>

            <form onSubmit={handleFoodSubmit}>
              <div className="tracker-form-grid tracker-form-grid-2">
                <label className="form-group">
                  <span className="form-label">Day</span>
                  <select
                    className="form-input"
                    value={foodForm.day}
                    onChange={(event) => setFoodForm((current) => ({ ...current, day: event.target.value }))}
                  >
                    {DAY_ORDER.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </label>

                <label className="form-group">
                  <span className="form-label">Meal type</span>
                  <select
                    className="form-input"
                    value={foodForm.mealType}
                    onChange={(event) => setFoodForm((current) => ({ ...current, mealType: event.target.value }))}
                  >
                    {MEAL_OPTIONS.map((mealType) => (
                      <option key={mealType} value={mealType}>{mealType}</option>
                    ))}
                  </select>
                </label>

                <label className="form-group tracker-form-span-2">
                  <span className="form-label">Food name</span>
                  <input
                    className="form-input"
                    placeholder="Example: Roti, dal, and mixed vegetables"
                    value={foodForm.foodName}
                    onChange={(event) => setFoodForm((current) => ({ ...current, foodName: event.target.value }))}
                  />
                </label>

                {[
                  ['Calories', 'calories'],
                  ['Protein (g)', 'protein'],
                  ['Carbs (g)', 'carbs'],
                  ['Fats (g)', 'fats'],
                  ['Fiber (g)', 'fiber'],
                ].map(([label, key]) => (
                  <label key={key} className="form-group">
                    <span className="form-label">{label}</span>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      value={foodForm[key]}
                      onChange={(event) => setFoodForm((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </label>
                ))}
              </div>

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  <Utensils size={16} />
                  Add meal
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Activity & recovery input</h3>
                <p>Track movement, water, sleep, body weight, and quick notes in one place.</p>
              </div>
              <span className="badge badge-sky">Daily check-in</span>
            </div>

            <form onSubmit={handleActivitySubmit}>
              <div className="tracker-form-grid tracker-form-grid-2">
                <label className="form-group">
                  <span className="form-label">Day</span>
                  <select
                    className="form-input"
                    value={activityForm.day}
                    onChange={(event) => setActivityForm((current) => ({ ...current, day: event.target.value }))}
                  >
                    {DAY_ORDER.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </label>

                <label className="form-group">
                  <span className="form-label">Mood</span>
                  <input
                    className="form-input"
                    placeholder="Focused, tired, strong..."
                    value={activityForm.mood}
                    onChange={(event) => setActivityForm((current) => ({ ...current, mood: event.target.value }))}
                  />
                </label>

                {[
                  ['Steps', 'steps'],
                  ['Active minutes', 'activeMinutes'],
                  ['Water (ml)', 'water'],
                  ['Sleep hours', 'sleepHours'],
                  ['Sleep quality %', 'sleepQuality'],
                  ['Weight (kg)', 'weight'],
                ].map(([label, key]) => (
                  <label key={key} className="form-group">
                    <span className="form-label">{label}</span>
                    <input
                      className="form-input"
                      type="number"
                      min="0"
                      step={key === 'sleepHours' || key === 'weight' ? '0.1' : '1'}
                      value={activityForm[key]}
                      onChange={(event) => setActivityForm((current) => ({ ...current, [key]: event.target.value }))}
                    />
                  </label>
                ))}

                <label className="form-group tracker-form-span-2">
                  <span className="form-label">Notes</span>
                  <textarea
                    className="form-input tracker-textarea"
                    placeholder="Short note about workout, appetite, fatigue, or recovery."
                    value={activityForm.notes}
                    onChange={(event) => setActivityForm((current) => ({ ...current, notes: event.target.value }))}
                  />
                </label>
              </div>

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  <Dumbbell size={16} />
                  Save check-in
                </button>
              </div>
            </form>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>{latestDay} snapshot</h3>
                <p>What the graphs will read from right now.</p>
              </div>
              <span className="badge badge-violet">{todaySnapshot.adherence}% adherence</span>
            </div>

            <div className="tracker-snapshot-grid">
              {[
                { label: 'Calories', value: `${todaySnapshot.calories} kcal`, meta: `${mealCoverage}% of target`, icon: Target, accent: '#c9953b', tone: '#f8eccc' },
                { label: 'Water', value: `${todaySnapshot.water} ml`, meta: `${hydrationCoverage}% of target`, icon: Droplets, accent: '#4d82b7', tone: '#e8f0fb' },
                { label: 'Movement', value: `${todaySnapshot.activeMinutes} min`, meta: `${todaySnapshot.steps} steps`, icon: Dumbbell, accent: '#73955f', tone: '#eef3ef' },
                { label: 'Recovery', value: `${todaySnapshot.sleepHours || 0} hrs`, meta: `${todaySnapshot.sleepQuality || 0}% quality`, icon: MoonStar, accent: '#7a61b8', tone: '#f1ede6' },
                { label: 'Weight', value: todaySnapshot.weight ? `${todaySnapshot.weight} kg` : 'No entry', meta: 'Latest logged value', icon: Scale, accent: '#bf5f47', tone: '#f3e4d8' },
                { label: 'Macros', value: `${todaySnapshot.protein}g protein`, meta: `${todaySnapshot.carbs}g carbs | ${todaySnapshot.fats}g fats`, icon: Utensils, accent: '#465c39', tone: '#eef3ef' },
              ].map((item) => {
                const Icon = item.icon

                return (
                  <div key={item.label} className="tracker-snapshot-card">
                    <div className="metric-card-top">
                      <div className="metric-card-icon" style={{ background: item.tone }}>
                        <Icon size={17} color={item.accent} />
                      </div>
                    </div>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                    <small>{item.meta}</small>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recent food entries</h3>
                <p>Latest inputs feeding your calorie and macro charts.</p>
              </div>
              <span className="badge badge-green">{recentFoodEntries.length} visible</span>
            </div>

            <div className="tracker-log-list">
              {recentFoodEntries.map((entry) => (
                <div key={entry.id} className="tracker-log-item">
                  <div>
                    <div className="tracker-log-title">{entry.foodName}</div>
                    <div className="tracker-log-meta">{entry.day} · {entry.mealType} · {formatDateTime(entry.loggedAt)}</div>
                  </div>
                  <div className="tracker-log-values">
                    <strong>{entry.calories} kcal</strong>
                    <span>{entry.protein}P / {entry.carbs}C / {entry.fats}F / {entry.fiber}Fi</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recent activity entries</h3>
                <p>Movement and recovery check-ins that update the performance graphs.</p>
              </div>
              <span className="badge badge-sky">{recentActivityEntries.length} visible</span>
            </div>

            <div className="tracker-log-list">
              {recentActivityEntries.map((entry) => (
                <div key={entry.id} className="tracker-log-item">
                  <div>
                    <div className="tracker-log-title">{entry.day} wellness log</div>
                    <div className="tracker-log-meta">{formatDateTime(entry.loggedAt)}{entry.mood ? ` · ${entry.mood}` : ''}</div>
                  </div>
                  <div className="tracker-log-values">
                    <strong>{entry.steps} steps</strong>
                    <span>{entry.activeMinutes} min · {entry.water} ml · {entry.sleepHours} hrs</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
