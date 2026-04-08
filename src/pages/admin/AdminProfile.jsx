import { useState } from 'react'
import {
  Award,
  Bell,
  Check,
  Edit2,
  Globe,
  Linkedin,
  Star,
  Users,
} from 'lucide-react'
import { getNutritionistSession } from '../../lib/session'

const specializations = [
  'Weight management',
  'Sports nutrition',
  'Diabetes care',
  'Gut health',
  'PCOS',
  'Pediatric nutrition',
]

const certifications = [
  { name: 'Registered dietitian nutritionist', year: '2014', issuer: 'Academy of Nutrition' },
  { name: 'MSc Nutrition and Dietetics', year: '2012', issuer: 'AIIMS, New Delhi' },
  { name: 'Sports nutrition certificate', year: '2018', issuer: 'NSCA' },
]

const reviews = [
  { name: 'Rekha S.', text: 'The plan felt balanced and actually sustainable. I stayed consistent for months.', date: '2 days ago' },
  { name: 'Krishna M.', text: 'A very clear, data-led approach that still felt personal and supportive.', date: '1 week ago' },
  { name: 'Priya V.', text: 'My PCOS symptoms improved because the guidance was specific and realistic.', date: '2 weeks ago' },
]

export default function AdminProfile() {
  const [editMode, setEditMode] = useState(false)
  const session = getNutritionistSession()
  const displayName = session.name || session.username || 'Nutritionist'
  const specialization = session.specialization || 'Clinical nutritionist'
  const [bio, setBio] = useState(
    `${displayName} is a Poshan nutritionist focused on clear, sustainable diet planning and structured care follow-through. The profile surface now mirrors the member-side design system while keeping clinic details easy to scan.`,
  )

  const initial = displayName.charAt(0).toUpperCase()

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
                {[1, 2, 3, 4, 5].map((item) => (
                  <Star key={item} size={14} fill="#c9953b" color="#c9953b" />
                ))}
                <span>4.9</span>
                <small>99 reviews</small>
              </div>

              <div className="admin-profile-stat-grid">
                {[
                  { value: '12+', label: 'Years' },
                  { value: '500+', label: 'Patients' },
                  { value: '99', label: 'Reviews' },
                ].map((item) => (
                  <div key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="admin-profile-links">
                {[Linkedin, Globe].map((Icon, index) => (
                  <button key={index} className="icon-btn">
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
                  <p>Profile copy aligned to the refreshed Poshan workspace</p>
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
                  <h3>Specializations</h3>
                  <p>Focus areas shown using the shared Poshan pill system</p>
                </div>
              </div>

              <div className="pill-row">
                {specializations.map((item) => (
                  <span key={item} className="badge badge-green">{item}</span>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Credentials</h3>
                  <p>Education and certification history</p>
                </div>
              </div>

              <div className="signal-list">
                {certifications.map((item) => (
                  <div key={item.name} className="signal-item">
                    <div className="signal-avatar" style={{ background: 'rgba(115, 149, 95, 0.12)' }}>
                      <Award size={16} color="#73955f" />
                    </div>
                    <div>
                      <div className="signal-title">{item.name}</div>
                      <div className="signal-sub">{item.issuer}</div>
                    </div>
                    <div className="signal-meta">{item.year}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Practice notes</h3>
                  <p>Availability and public-facing signals</p>
                </div>
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>Mon - Sat</strong>
                  <span>availability window</span>
                </div>
                <div className="mini-metric">
                  <strong>Tomorrow</strong>
                  <span>next open slot</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Currently accepting new patients. The profile page now carries the same calm
                surfaces, spacing, and hierarchy used across the member-facing dashboard.
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Patient reviews</h3>
                  <p>Recent voice-of-patient highlights</p>
                </div>
                <Users size={18} color="#73955f" />
              </div>

              <div className="admin-review-list">
                {reviews.map((review) => (
                  <article key={review.name} className="admin-review-card">
                    <div className="admin-review-top">
                      <strong>{review.name}</strong>
                      <span>{review.date}</span>
                    </div>
                    <p>{review.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
