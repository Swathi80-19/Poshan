import { useEffect, useMemo, useState } from 'react'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Video,
} from 'lucide-react'
import { getNutritionistAppointments } from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

export default function AdminAppointments() {
  const session = getNutritionistSession()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in as a nutritionist to view your appointments.')
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getNutritionistAppointments(session.accessToken)

        if (!cancelled) {
          setAppointments(Array.isArray(response) ? response : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setAppointments([])
          setError(requestError.message || 'Unable to load appointments right now.')
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
  }, [session.accessToken])

  const completedAppointments = appointments.filter((item) => item.status === 'COMPLETED')
  const upcomingAppointments = appointments.filter((item) => item.status === 'UPCOMING')
  const statCards = [
    { label: 'Scheduled', value: appointments.length, foot: 'Sessions on your account', tone: '#e7efe0', accent: '#73955f' },
    { label: 'Completed', value: completedAppointments.length, foot: 'Closed appointments', tone: '#e8f0fb', accent: '#4d82b7' },
    { label: 'Upcoming', value: upcomingAppointments.length, foot: 'Still to attend', tone: '#eee6fa', accent: '#7a61b8' },
    { label: 'Video calls', value: appointments.filter((item) => item.mode.includes('VIDEO')).length, foot: 'Remote consultations', tone: '#f8eccc', accent: '#c9953b' },
  ]

  const groupedByDate = useMemo(() => (
    appointments.reduce((map, appointment) => {
      const key = appointment.dateLabel || 'Scheduled'
      const list = map.get(key) || []
      list.push(appointment)
      map.set(key, list)
      return map
    }, new Map())
  ), [appointments])

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Schedule control</div>
          <h1>Appointments</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">{appointments.length} scheduled sessions</span>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Session board</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Keep your consultation calendar clear, organized, and easy to scan.
              </h2>
              <p className="hero-copy">
                Review booked sessions by date, track upcoming visits, and keep completed consultations within reach.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{completedAppointments.length} completed</span>
                <span className="badge badge-amber">{upcomingAppointments.length} upcoming</span>
                <span className="badge badge-sky">Schedule view</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Today&apos;s pace</h3>
                  <p>Quick view of the day&apos;s consultation flow</p>
                </div>
                <Clock3 size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{upcomingAppointments.length}</strong>
                  <span>upcoming sessions</span>
                </div>
                <div className="mini-metric">
                  <strong>{appointments.filter((item) => item.mode.includes('VIDEO')).length}</strong>
                  <span>video consultations</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {statCards.map(({ label, value, foot, tone, accent }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <CalendarDays size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Today</span>
              </div>
              <div className="metric-card-value">{value}</div>
              <div className="metric-card-label">{label}</div>
              <div className="metric-card-foot" style={{ color: accent }}>{foot}</div>
            </article>
          ))}
        </section>

        {loading ? <div className="admin-note">Loading nutritionist appointments...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}
        {!loading && !error && !appointments.length ? (
          <div className="admin-note">No members have booked this nutritionist account yet.</div>
        ) : null}

        <div className="g-2-auto">
          <section className="support-card admin-schedule-shell">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Appointment list</h3>
                <p>Grouped by scheduled date</p>
              </div>
            </div>

            <div className="timeline-list">
              {[...groupedByDate.entries()].map(([dateLabel, items]) => (
                <div key={dateLabel} style={{ marginBottom: '1rem' }}>
                  <div className="section-title" style={{ marginBottom: '0.6rem' }}>{dateLabel}</div>
                  {items.map((appointment) => (
                    <div key={appointment.id} className="signal-item">
                      <div className="signal-avatar" style={{ background: appointment.status === 'COMPLETED' ? '#e7efe0' : '#e8f0fb' }}>
                        {getInitials(appointment.memberName)}
                      </div>
                      <div>
                        <div className="signal-title">{appointment.memberName}</div>
                        <div className="signal-sub">{appointment.timeLabel} | {appointment.mode.replaceAll('_', ' ')}</div>
                      </div>
                      <div className="signal-meta">{appointment.status.toLowerCase()}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Upcoming sessions</h3>
                  <p>Keep the next consults visible</p>
                </div>
              </div>

              <div className="signal-list">
                {upcomingAppointments.length ? upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: '#eee6fa' }}>
                      {getInitials(appointment.memberName)}
                    </div>
                    <div>
                      <div className="signal-title">{appointment.memberName}</div>
                      <div className="signal-sub">{appointment.dateLabel}</div>
                      <div className="queue-sub">{appointment.timeLabel}</div>
                    </div>
                    {appointment.mode.includes('VIDEO') ? (
                      <div className="admin-video-pill">
                        <Video size={14} />
                      </div>
                    ) : (
                      <div className="signal-meta">In clinic</div>
                    )}
                  </div>
                )) : (
                  <div className="admin-note">No upcoming sessions are booked yet.</div>
                )}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Completed sessions</h3>
                  <p>Recently closed appointments</p>
                </div>
              </div>

              <div className="signal-list">
                {completedAppointments.length ? completedAppointments.slice(-3).reverse().map((appointment) => (
                  <div key={appointment.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: '#e7efe0' }}>
                      {getInitials(appointment.memberName)}
                    </div>
                    <div>
                      <div className="signal-title">{appointment.memberName}</div>
                      <div className="signal-sub">{appointment.dateLabel} | {appointment.timeLabel}</div>
                    </div>
                    <CheckCircle2 size={16} color="#2f8d58" />
                  </div>
                )) : (
                  <div className="admin-note">No completed sessions yet.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
