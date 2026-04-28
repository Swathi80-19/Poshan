import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ShieldCheck, UserRound } from 'lucide-react'
import { updateNutritionistProfile } from '../../lib/memberApi'
import { getNutritionistSession, updateNutritionistSessionProfile } from '../../lib/session'

export default function AdminProfileIntakePage() {
  const navigate = useNavigate()
  const session = getNutritionistSession()
  const displayName = session.name || session.username || 'Nutritionist'
  const [form, setForm] = useState({
    age: session.age || '',
    bio: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!session.accessToken) {
      navigate('/admin/login')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await updateNutritionistProfile(session.accessToken, {
        age: Number(form.age) || null,
        bio: form.bio.trim() || null,
      })

      updateNutritionistSessionProfile({
        age: response.age ?? (Number(form.age) || null),
        profileCompleted: Boolean(response.profileCompleted),
      })
      navigate('/admin/dashboard')
    } catch (requestError) {
      setError(requestError.message || 'Unable to save your personal details right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">First login setup</span>
          <span className="page-header-title">Complete {displayName}&rsquo;s personal details</span>
        </div>
      </div>

      <div className="page-body">
        <div className="g-2-auto">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Personal details</h3>
                <p>Add your age once so the profile stays complete across your nutritionist workspace.</p>
              </div>
              <span className="badge badge-green">Required</span>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="tracker-form-grid">
                <label className="form-group">
                  <span className="form-label">Age</span>
                  <input
                    className="form-input"
                    type="number"
                    min="18"
                    value={form.age}
                    onChange={(event) => setForm((current) => ({ ...current, age: event.target.value }))}
                    required
                  />
                </label>

                <label className="form-group">
                  <span className="form-label">Short bio</span>
                  <textarea
                    className="form-input tracker-textarea"
                    value={form.bio}
                    onChange={(event) => setForm((current) => ({ ...current, bio: event.target.value }))}
                    placeholder="Optional introduction for your profile."
                  />
                </label>
              </div>

              {error ? <div className="admin-note">{error}</div> : null}

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? 'Saving details...' : 'Save and continue'}
                  {!loading ? <ArrowRight size={16} /> : null}
                </button>
              </div>
            </form>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Why this is required</h3>
                <p>Your age is now part of the nutritionist personal-details record and is collected once on first login.</p>
              </div>
            </div>

            <div className="tracker-snapshot-grid">
              {[
                {
                  icon: UserRound,
                  label: 'Identity',
                  value: displayName,
                  meta: session.specialization || 'Nutritionist account',
                  accent: '#73955f',
                  tone: '#eef3ef',
                },
                {
                  icon: ShieldCheck,
                  label: 'Profile status',
                  value: form.age ? `${form.age} years` : 'Age required',
                  meta: 'Needed before dashboard access',
                  accent: '#4d82b7',
                  tone: '#e8f0fb',
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
