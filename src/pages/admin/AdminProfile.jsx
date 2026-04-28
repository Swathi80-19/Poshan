import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  Check,
  Edit2,
  Globe,
  Linkedin,
  Mail,
  Phone,
  Star,
  UserRound,
} from 'lucide-react'
import { getNutritionistProfile, updateNutritionistProfile } from '../../lib/memberApi'
import { getNutritionistSession, updateNutritionistSessionProfile } from '../../lib/session'

function buildDefaultBio(displayName, specialization) {
  return `${displayName} supports members through ${specialization.toLowerCase()} with a focus on clear plans, practical follow-through, and consistent care. This profile helps members understand your background before they book a consultation.`
}

export default function AdminProfile() {
  const [editMode, setEditMode] = useState(false)
  const session = getNutritionistSession()
  const displayName = session.name || session.username || 'Nutritionist'
  const specialization = session.specialization || 'Clinical Nutrition'
  const experience = typeof session.experience === 'number' ? session.experience : null
  const [bio, setBio] = useState('')
  const [age, setAge] = useState(session.age || '')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const initial = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setBio(buildDefaultBio(displayName, specialization))
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const profile = await getNutritionistProfile(session.accessToken)

        if (!cancelled) {
          setBio(profile.bio || buildDefaultBio(displayName, specialization))
          setAge(profile.age || '')
          updateNutritionistSessionProfile({
            age: profile.age ?? null,
            profileCompleted: Boolean(profile.profileCompleted),
          })
        }
      } catch (requestError) {
        if (!cancelled) {
          setBio(buildDefaultBio(displayName, specialization))
          setError(requestError.message || 'Unable to load your profile right now.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [displayName, session.accessToken, specialization])

  const profileStats = [
    { label: 'Specialization', value: specialization },
    { label: 'Experience', value: experience === null ? 'Not shared' : `${experience} year${experience === 1 ? '' : 's'}` },
    { label: 'Visibility', value: 'Expert directory' },
  ]

  const contactItems = [
    { label: 'Username', value: session.username || 'Not shared', icon: UserRound },
    { label: 'Email', value: session.email || 'Not shared', icon: Mail },
    { label: 'Phone', value: session.phone || 'Not shared', icon: Phone },
    { label: 'Age', value: age || 'Not shared', icon: UserRound },
  ]

  const dummyHighlights = useMemo(() => ([
    'Clinical intake planning',
    'Habit-first follow-through',
    'Meal structure simplification',
    'Progress review check-ins',
  ]), [])

  const handleToggleEdit = async () => {
    if (!editMode) {
      setEditMode(true)
      return
    }

    if (!session.accessToken) {
      return
    }

    try {
      setSaving(true)
      setError('')
      const response = await updateNutritionistProfile(session.accessToken, {
        age: Number(age) || null,
        bio: bio.trim() || null,
      })
      updateNutritionistSessionProfile({
        age: response.age ?? null,
        profileCompleted: Boolean(response.profileCompleted),
      })
      setAge(response.age || '')
      setBio(response.bio || buildDefaultBio(displayName, specialization))
      setEditMode(false)
    } catch (requestError) {
      setError(requestError.message || 'Unable to save your profile right now.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Professional profile</div>
          <h1>My profile</h1>
        </div>

        <div className="page-header-right">
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <button
            className={editMode ? 'btn btn-primary' : 'btn btn-outline'}
            onClick={handleToggleEdit}
            disabled={saving}
          >
            {editMode ? <Check size={16} /> : <Edit2 size={16} />}
            {saving ? 'Saving...' : editMode ? 'Save changes' : 'Edit profile'}
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="g-2-auto">
          <section className="support-card admin-profile-sheet">
            <div className="admin-profile-banner" />

            <div className="admin-profile-main">
              <div className="admin-profile-avatar">{initial}</div>

              <h2>{displayName}</h2>
              <p>{specialization}</p>

              <div className="admin-rating-row">
                <Star size={14} color="#c9953b" />
                <span>Public profile</span>
                <small>{experience === null ? 'Experience not shared yet' : `${experience} year${experience === 1 ? '' : 's'} experience`}</small>
              </div>

              <div className="admin-profile-stat-grid">
                {profileStats.map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="admin-profile-links">
                {[Linkedin, Globe].map((Icon, index) => (
                  <button key={index} className="icon-btn" type="button">
                    <Icon size={15} />
                  </button>
                ))}
              </div>
            </div>
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>About</h3>
                  <p>Share a short introduction that members will see before booking.</p>
                </div>
              </div>

              {loading ? <div className="admin-note">Loading profile details...</div> : null}
              {error ? <div className="admin-note">{error}</div> : null}

              {editMode ? (
                <div className="tracker-form-grid" style={{ gap: 14 }}>
                  <label className="form-group">
                    <span className="form-label">Age</span>
                    <input
                      className="form-input"
                      type="number"
                      min="18"
                      value={age}
                      onChange={(event) => setAge(event.target.value)}
                    />
                  </label>
                  <label className="form-group">
                    <span className="form-label">Bio</span>
                    <textarea
                      className="form-input tracker-textarea"
                      value={bio}
                      onChange={(event) => setBio(event.target.value)}
                    />
                  </label>
                </div>
              ) : (
                <p className="hero-copy" style={{ marginTop: 0 }}>{bio}</p>
              )}

              <div className="divider" style={{ margin: '1.2rem 0' }} />

              <div className="dashboard-panel-heading">
                <div>
                  <h3>Focus area</h3>
                  <p>Highlight the primary specialization shown in the expert directory.</p>
                </div>
              </div>

              <div className="pill-row">
                <span className="badge badge-green">{specialization}</span>
                {dummyHighlights.map((item) => (
                  <span key={item} className="badge badge-gray">{item}</span>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Contact details</h3>
                  <p>Profile information available for your account.</p>
                </div>
              </div>

              <div className="signal-list">
                {contactItems.map(({ label, value, icon: Icon }) => (
                  <div key={label} className="signal-item">
                    <div className="signal-avatar" style={{ background: 'rgba(115, 149, 95, 0.12)' }}>
                      <Icon size={16} color="#73955f" />
                    </div>
                    <div>
                      <div className="signal-title">{label}</div>
                      <div className="signal-sub">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Directory status</h3>
                  <p>How your profile appears inside Poshan.</p>
                </div>
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>Visible</strong>
                  <span>expert listing status</span>
                </div>
                <div className="mini-metric">
                  <strong>{session.email ? 'Verified profile' : 'Profile details pending'}</strong>
                  <span>account readiness</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Dummy profile highlights are shown here now so the nutritionist profile feels populated even before richer practice metadata is added.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
