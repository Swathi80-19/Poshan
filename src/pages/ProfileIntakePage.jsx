import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Ruler, Scale, Target, UserRound } from 'lucide-react'
import { useTracking } from '../context/TrackingContext'
import { getMemberDisplayName, updateMemberSessionProfile } from '../lib/session'

export default function ProfileIntakePage() {
  const navigate = useNavigate()
  const { profile, updateProfile } = useTracking()
  const username = getMemberDisplayName()

  const [form, setForm] = useState({
    age: profile.age || '',
    gender: profile.gender || '',
    heightCm: profile.heightCm || '',
    currentWeightKg: profile.currentWeightKg || '',
    targetWeightKg: profile.targetWeightKg || '',
    activityLevel: profile.activityLevel || '',
    goalFocus: profile.goalFocus || '',
  })

  const completion = useMemo(() => {
    const requiredFields = ['age', 'gender', 'heightCm', 'currentWeightKg', 'activityLevel', 'goalFocus']
    const filled = requiredFields.filter((key) => String(form[key]).trim()).length
    return Math.round((filled / requiredFields.length) * 100)
  }, [form])

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    updateProfile(form)
    updateMemberSessionProfile({
      age: Number(form.age) || null,
      profileCompleted: true,
    })
    navigate('/app/dashboard')
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Profile intake</span>
          <span className="page-header-title">Set up {username}&rsquo;s body profile</span>
        </div>
      </div>

      <div className="page-body">
        <div className="g-2-auto">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Body details</h3>
                <p>This profile helps Poshan shape your dashboard goals and nutrition summaries around your actual inputs.</p>
              </div>
              <span className="badge badge-green">{completion}% complete</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="tracker-form-grid tracker-form-grid-2">
                <label className="form-group">
                  <span className="form-label">Age</span>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.age}
                    onChange={(event) => setField('age', event.target.value)}
                    required
                  />
                </label>

                <label className="form-group">
                  <span className="form-label">Gender</span>
                  <select
                    className="form-input"
                    value={form.gender}
                    onChange={(event) => setField('gender', event.target.value)}
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </label>

                <label className="form-group">
                  <span className="form-label">Height (cm)</span>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.heightCm}
                    onChange={(event) => setField('heightCm', event.target.value)}
                    required
                  />
                </label>

                <label className="form-group">
                  <span className="form-label">Current weight (kg)</span>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.currentWeightKg}
                    onChange={(event) => setField('currentWeightKg', event.target.value)}
                    required
                  />
                </label>

                <label className="form-group">
                  <span className="form-label">Target weight (kg)</span>
                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.targetWeightKg}
                    onChange={(event) => setField('targetWeightKg', event.target.value)}
                  />
                </label>

                <label className="form-group">
                  <span className="form-label">Activity level</span>
                  <select
                    className="form-input"
                    value={form.activityLevel}
                    onChange={(event) => setField('activityLevel', event.target.value)}
                    required
                  >
                    <option value="">Select activity level</option>
                    <option value="Sedentary">Sedentary</option>
                    <option value="Lightly active">Lightly active</option>
                    <option value="Moderately active">Moderately active</option>
                    <option value="Very active">Very active</option>
                  </select>
                </label>

                <label className="form-group tracker-form-span-2">
                  <span className="form-label">Primary goal</span>
                  <select
                    className="form-input"
                    value={form.goalFocus}
                    onChange={(event) => setField('goalFocus', event.target.value)}
                    required
                  >
                    <option value="">Select primary goal</option>
                    <option value="Weight loss">Weight loss</option>
                    <option value="Weight gain">Weight gain</option>
                    <option value="Muscle gain">Muscle gain</option>
                    <option value="Improve energy">Improve energy</option>
                    <option value="Clinical nutrition support">Clinical nutrition support</option>
                    <option value="General wellness">General wellness</option>
                  </select>
                </label>
              </div>

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="submit">
                  Save profile and continue
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Why this matters</h3>
                <p>These details keep your intake and dashboard grounded in your own profile and goals.</p>
              </div>
            </div>

            <div className="tracker-snapshot-grid">
              {[
                {
                  icon: UserRound,
                  label: 'Personal baseline',
                  value: form.age ? `${form.age} years` : 'Add age',
                  meta: form.gender || 'Select gender',
                  accent: '#73955f',
                  tone: '#eef3ef',
                },
                {
                  icon: Ruler,
                  label: 'Body frame',
                  value: form.heightCm ? `${form.heightCm} cm` : 'Add height',
                  meta: form.activityLevel || 'Set activity level',
                  accent: '#4d82b7',
                  tone: '#e8f0fb',
                },
                {
                  icon: Scale,
                  label: 'Weight profile',
                  value: form.currentWeightKg ? `${form.currentWeightKg} kg` : 'Add current weight',
                  meta: form.targetWeightKg ? `Target ${form.targetWeightKg} kg` : 'Optional target weight',
                  accent: '#c9953b',
                  tone: '#f8eccc',
                },
                {
                  icon: Target,
                  label: 'Goal focus',
                  value: form.goalFocus || 'Choose your goal',
                  meta: 'Used to tailor your careboard language',
                  accent: '#7a61b8',
                  tone: '#f1ede6',
                },
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
      </div>
    </div>
  )
}
