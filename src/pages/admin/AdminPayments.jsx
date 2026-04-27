import { useEffect, useMemo, useState } from 'react'
import { Bell, CalendarDays, CreditCard, Download, Wallet } from 'lucide-react'
import { getNutritionistAppointments } from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

function formatMode(value) {
  return (value || '').replaceAll('_', ' ') || 'Session'
}

export default function AdminPayments() {
  const session = getNutritionistSession()
  const displayName = session.username || session.name || 'Nutritionist'
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in as a nutritionist to view your billing workspace.')
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
          setError(requestError.message || 'Unable to load billing details right now.')
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

  const upcomingAppointments = appointments.filter((item) => item.status === 'UPCOMING')
  const completedAppointments = appointments.filter((item) => item.status === 'COMPLETED')
  const recentSessions = useMemo(
    () => [...appointments].sort((left, right) => new Date(right.scheduledAt) - new Date(left.scheduledAt)).slice(0, 5),
    [appointments],
  )

  const statCards = [
    { label: 'Booked sessions', value: appointments.length, foot: 'Appointments connected to your account', tone: '#e7efe0', accent: '#73955f' },
    { label: 'Upcoming visits', value: upcomingAppointments.length, foot: 'Scheduled consultations ahead', tone: '#e8f0fb', accent: '#4d82b7' },
    { label: 'Completed visits', value: completedAppointments.length, foot: 'Finished consultations', tone: '#f8eccc', accent: '#c9953b' },
    { label: 'Billing records', value: 0, foot: 'No payment ledger available yet', tone: '#eee6fa', accent: '#7a61b8' },
  ]

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Billing workspace</div>
          <h1>Payments</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">Finance overview</span>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <button className="btn btn-outline">
            <Download size={16} />
            Export report
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Collections overview</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Keep booked sessions and billing readiness visible from one workspace.
              </h2>
              <p className="hero-copy">
                This page tracks appointment volume today and leaves room for billing records as soon as payment reporting is available.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{appointments.length} booked sessions</span>
                <span className="badge badge-amber">{upcomingAppointments.length} upcoming visits</span>
                <span className="badge badge-sky">Ledger pending</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Billing status</h3>
                  <p>Payment totals will appear here when settlement tracking is enabled.</p>
                </div>
                <Wallet size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{displayName}</strong>
                  <span>practice account</span>
                </div>
                <div className="mini-metric">
                  <strong>{completedAppointments.length}</strong>
                  <span>completed sessions</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                No payment amounts are shown yet because this account does not have billing records connected in the app.
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {statCards.map(({ label, value, foot, tone, accent }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <CreditCard size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Finance</span>
              </div>
              <div className="metric-card-value">{value}</div>
              <div className="metric-card-label">{label}</div>
              <div className="metric-card-foot" style={{ color: accent }}>{foot}</div>
            </article>
          ))}
        </section>

        {loading ? <div className="admin-note">Loading billing workspace...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}

        <div className="g-2-auto">
          <section className="support-card admin-surface-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recent appointments</h3>
                <p>Session activity that can feed future billing records.</p>
              </div>
              <CalendarDays size={18} color="#73955f" />
            </div>

            {!loading && !error && !recentSessions.length ? (
              <div className="admin-note">Booked appointments will appear here once members schedule sessions.</div>
            ) : null}

            {!!recentSessions.length && (
              <div className="signal-list">
                {recentSessions.map((appointment) => (
                  <div key={appointment.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: appointment.status === 'COMPLETED' ? '#e7efe0' : '#e8f0fb' }}>
                      {appointment.memberName?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div className="signal-title">{appointment.memberName}</div>
                      <div className="signal-sub">{appointment.dateLabel || 'Scheduled'} | {appointment.timeLabel || 'Time pending'}</div>
                    </div>
                    <div className="signal-meta">{formatMode(appointment.mode)}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Payment records</h3>
                  <p>Billing entries will appear here when available.</p>
                </div>
              </div>

              <div className="admin-note">
                No transaction history is available yet. When payment tracking is connected, this section will show collections, payouts, and settlement updates.
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
