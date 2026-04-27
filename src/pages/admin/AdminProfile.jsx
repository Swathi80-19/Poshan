import { useState } from 'react'
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
import { getNutritionistSession } from '../../lib/session'

function buildDefaultBio(displayName, specialization) {
  return `${displayName} supports members through ${specialization.toLowerCase()} with a focus on clear plans, practical follow-through, and consistent care. This profile helps members understand your background before they book a consultation.`
}

export default function AdminProfile() {
  const [editMode, setEditMode] = useState(false)
  const session = getNutritionistSession()
  const displayName = session.name || session.username || 'Nutritionist'
  const specialization = session.specialization || 'Clinical Nutrition'
  const experience = typeof session.experience === 'number' ? session.experience : null
  const [bio, setBio] = useState(() => buildDefaultBio(displayName, specialization))
  const initial = displayName.charAt(0).toUpperCase()

  const profileStats = [
    { label: 'Specialization', value: specialization },
    { label: 'Experience', value: experience === null ? 'Not shared' : `${experience} year${experience === 1 ? '' : 's'}` },
    { label: 'Visibility', value: 'Expert directory' },
  ]

  const contactItems = [
    { label: 'Username', value: session.username || 'Not shared', icon: UserRound },
    { label: 'Email', value: session.email || 'Not shared', icon: Mail },
    { label: 'Phone', value: session.phone || 'Not shared', icon: Phone },
  ]

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
            onClick={() => setEditMode((current) => !current)}
          >
            {editMode ? <Check size={16} /> : <Edit2 size={16} />}
            {editMode ? 'Save changes' : 'Edit profile'}
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

              {editMode ? (
                <textarea
                  className="form-input tracker-textarea"
                  value={bio}
                  onChange={(event) => setBio(event.target.value)}
                />
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
                Member feedback and additional credentials will appear here when that information becomes available.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
