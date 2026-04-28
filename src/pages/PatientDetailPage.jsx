import { useEffect, useMemo, useState } from 'react'
import { Bell, Calendar, CheckCircle2, Clock3, MessageSquare } from 'lucide-react'
import { getMemberAppointments } from '../lib/memberApi'
import { getMemberDisplayName, getMemberSession } from '../lib/session'

function formatMode(value) {
  return (value || '').replaceAll('_', ' ') || 'Session'
}

export default function PatientDetailPage() {
  const session = getMemberSession()
  const username = getMemberDisplayName()
  const initial = username.charAt(0).toUpperCase()
  const [activeTab, setActiveTab] = useState('All')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in to view your care calendar.')
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getMemberAppointments(session.accessToken)

        if (!cancelled) {
          setAppointments(Array.isArray(response) ? response : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setAppointments([])
          setError(requestError.message || 'Unable to load your appointments right now.')
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

  const filteredAppointments = useMemo(() => (
    appointments.filter((appointment) => {
      if (activeTab === 'All') return true
      return appointment.status === activeTab.toUpperCase()
    })
  ), [activeTab, appointments])

  const upcomingAppointments = appointments.filter((appointment) => appointment.status === 'UPCOMING')
  const completedAppointments = appointments.filter((appointment) => appointment.status === 'COMPLETED')
  const nextAppointment = upcomingAppointments[0] || null

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="header-avatar">{initial}</div>
          <div>
            <div className="page-header-greeting">Care calendar</div>
            <div className="page-header-title">{username}</div>
          </div>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn">
            <Calendar size={18} />
          </button>
          <button className="header-icon-btn">
            <Bell size={18} />
          </button>
        </div>
      </div>

      <div className="page-body">
        <div className="patient-detail-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <section className="card" style={{ padding: 22 }}>
              <div className="dashboard-panel-heading">
                <div>
                  <div className="eyebrow">Appointment overview</div>
                  <h3 style={{ marginTop: 8 }}>Track your booked consultations and follow-up sessions.</h3>
                </div>
              </div>

              <div className="mini-metric-grid" style={{ marginTop: 16 }}>
                <div className="mini-metric">
                  <strong>{appointments.length}</strong>
                  <span>total appointments</span>
                </div>
                <div className="mini-metric">
                  <strong>{upcomingAppointments.length}</strong>
                  <span>upcoming sessions</span>
                </div>
                <div className="mini-metric">
                  <strong>{completedAppointments.length}</strong>
                  <span>completed sessions</span>
                </div>
              </div>
            </section>

            <section className="card" style={{ padding: 22 }}>
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Next consultation</h3>
                  <p>Your next booked appointment appears here.</p>
                </div>
                <Clock3 size={18} color="#73955f" />
              </div>

              {nextAppointment ? (
                <div className="signal-item" style={{ paddingTop: 16 }}>
                  <div className="signal-avatar" style={{ background: '#e7efe0' }}>
                    {nextAppointment.nutritionistName?.charAt(0)?.toUpperCase() || 'N'}
                  </div>
                  <div>
                    <div className="signal-title">{nextAppointment.nutritionistName || 'Nutritionist'}</div>
                    <div className="signal-sub">{nextAppointment.dateLabel || 'Date pending'} | {nextAppointment.timeLabel || 'Time pending'}</div>
                  </div>
                  <div className="signal-meta">{formatMode(nextAppointment.mode)}</div>
                </div>
              ) : (
                <div className="admin-note" style={{ marginTop: '1rem' }}>
                  No upcoming consultation is booked yet.
                </div>
              )}
            </section>

            <section className="card" style={{ padding: 22 }}>
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Support</h3>
                  <p>Use chat after booking to stay in touch with your nutritionist.</p>
                </div>
                <MessageSquare size={18} color="#73955f" />
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Messages become available once your appointment chat is opened.
              </div>
            </section>
          </div>

          <div>
            <div className="patient-tab-row" style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
              {['All', 'Upcoming', 'Completed'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 500,
                    cursor: 'pointer',
                    border: 'none',
                    background: activeTab === tab ? '#8BAF7C' : '#F3F4F6',
                    color: activeTab === tab ? 'white' : '#6B7280',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {loading ? <div className="admin-note">Loading appointments...</div> : null}
            {error ? <div className="admin-note">{error}</div> : null}
            {!loading && !error && !filteredAppointments.length ? (
              <div className="admin-note">No appointments match this view.</div>
            ) : null}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="card"
                  style={{
                    padding: '16px 18px',
                    border: '1px solid #F3F4F6',
                  }}
                >
                  <div className="dashboard-panel-heading" style={{ marginBottom: 12 }}>
                    <div>
                      <div className="doctor-name">{appointment.nutritionistName || 'Nutritionist'}</div>
                      <div className="doctor-specialty">{formatMode(appointment.mode)}</div>
                    </div>
                    {appointment.status === 'COMPLETED' ? (
                      <span className="badge badge-green">
                        <CheckCircle2 size={12} />
                        Completed
                      </span>
                    ) : (
                      <span className="badge badge-amber">Upcoming</span>
                    )}
                  </div>

                  <div className="timeline-list">
                    <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto', paddingTop: 0 }}>
                      <Calendar size={14} color="#73955f" />
                      <div className="signal-title">Date</div>
                      <div className="signal-meta">{appointment.dateLabel || 'Pending'}</div>
                    </div>
                    <div className="signal-item" style={{ gridTemplateColumns: 'auto 1fr auto' }}>
                      <Clock3 size={14} color="#7f8776" />
                      <div className="signal-title">Time</div>
                      <div className="signal-meta">{appointment.timeLabel || 'Pending'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
