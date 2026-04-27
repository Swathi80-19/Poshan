import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  FileText,
  MessageSquare,
  Sparkles,
  Users,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { getNutritionistAppointments, getNutritionistDashboard } from '../../lib/memberApi'
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

function buildLoadTrend(appointments) {
  const grouped = appointments.reduce((map, appointment) => {
    const day = appointment.dateLabel || 'Upcoming'
    map.set(day, (map.get(day) || 0) + 1)
    return map
  }, new Map())

  return [...grouped.entries()].slice(0, 7).map(([day, count]) => ({ day, count }))
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const session = getNutritionistSession()
  const [dashboard, setDashboard] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const displayName = session.username || session.name || 'Nutritionist'
  const initial = displayName.charAt(0).toUpperCase()

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in as a nutritionist to view your real workspace.')
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const [dashboardResponse, appointmentResponse] = await Promise.all([
          getNutritionistDashboard(session.accessToken),
          getNutritionistAppointments(session.accessToken),
        ])

        if (!cancelled) {
          setDashboard(dashboardResponse)
          setAppointments(Array.isArray(appointmentResponse) ? appointmentResponse : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setDashboard(null)
          setAppointments([])
          setError(requestError.message || 'Unable to load the nutritionist dashboard right now.')
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

  const summary = dashboard?.summary || {}
  const patients = Array.isArray(dashboard?.items) ? dashboard.items : []
  const upcomingAppointments = appointments.filter((appointment) => appointment.status === 'UPCOMING')
  const loadTrend = buildLoadTrend(appointments)
  const patientSignals = useMemo(() => (
    [...patients]
      .sort((left, right) => (left.foodLogs + left.activityLogs) - (right.foodLogs + right.activityLogs))
      .slice(0, 3)
  ), [patients])

  const dashboardMetrics = [
    {
      icon: Users,
      label: 'Active patients',
      value: `${summary.patients || 0}`,
      foot: 'Patients tied to your booked appointments',
      tone: '#e7efe0',
      accent: '#73955f',
    },
    {
      icon: CalendarDays,
      label: 'Appointments',
      value: `${summary.appointments || 0}`,
      foot: `${upcomingAppointments.length} upcoming sessions`,
      tone: '#e8f0fb',
      accent: '#4d82b7',
    },
    {
      icon: FileText,
      label: 'Reports',
      value: `${summary.reports || 0}`,
      foot: 'Saved against your nutritionist account',
      tone: '#f8eccc',
      accent: '#c9953b',
    },
    {
      icon: Sparkles,
      label: 'Tracker logs',
      value: `${patients.reduce((sum, item) => sum + item.foodLogs + item.activityLogs, 0)}`,
      foot: 'Shared member updates across your roster',
      tone: '#eee6fa',
      accent: '#7a61b8',
    },
  ]

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Clinical overview</div>
          <h1>{displayName}&rsquo;s dashboard</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">Live backend data</span>
          <button className="btn btn-primary" onClick={() => navigate('/admin/appointments')}>
            <CalendarDays size={16} />
            Today&apos;s schedule
          </button>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <div className="header-avatar">{initial}</div>
        </div>
      </div>

      <div className="page-body">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Practice command center</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Your nutritionist workspace now reflects real registered patients, appointments, and shared tracker activity.
              </h2>
              <p className="hero-copy">
                Demo dashboard cards have been replaced with backend-driven totals. As members book you and log their data,
                this view updates from the actual saved records.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{summary.patients || 0} roster patients</span>
                <span className="badge badge-amber">{upcomingAppointments.length} upcoming sessions</span>
                <span className="badge badge-sky">{summary.reports || 0} reports created</span>
              </div>

              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate('/admin/patients')}>
                  <Users size={16} />
                  Open patient roster
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/admin/messages')}>
                  <MessageSquare size={16} />
                  Open messages
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/admin/appointments')}>
                  Open appointments
                </button>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Appointment load</h3>
                  <p>Real sessions grouped from your backend schedule</p>
                </div>
                <span className="badge badge-green">{appointments.length} total</span>
              </div>

              {loadTrend.length ? (
                <ResponsiveContainer width="100%" height={190}>
                  <AreaChart data={loadTrend}>
                    <defs>
                      <linearGradient id="appointmentLoadFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#73955f" stopOpacity={0.34} />
                        <stop offset="95%" stopColor="#73955f" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(92, 120, 74, 0.08)" vertical={false} />
                    <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#7f8776', fontSize: 11 }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#73955f" strokeWidth={3} fill="url(#appointmentLoadFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="admin-note" style={{ marginTop: '1rem' }}>
                  No booked appointments yet. Once members book this nutritionist account, your schedule appears here.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {dashboardMetrics.map(({ icon: Icon, label, value, foot, tone, accent }) => (
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

        <div className="admin-overview">
          <section className="queue-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Upcoming queue</h3>
                <p>Real member sessions linked to this nutritionist account</p>
              </div>
            </div>

            <div className="queue-list">
              {upcomingAppointments.length ? upcomingAppointments.slice(0, 4).map((item) => (
                <div key={item.id} className="queue-item">
                  <div className="queue-time">{item.timeLabel}</div>
                  <div>
                    <div className="queue-title">{item.memberName}</div>
                    <div className="queue-sub">{item.dateLabel} · {item.mode.replaceAll('_', ' ')}</div>
                  </div>
                  <div className="queue-meta">{item.status.toLowerCase()}</div>
                </div>
              )) : (
                <div className="admin-note">No upcoming appointments are booked yet.</div>
              )}
            </div>

            <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/admin/appointments')}>
              Open full schedule
              <ChevronRight size={16} />
            </button>
          </section>

          <section className="signal-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Patient signals</h3>
                <p>Members with the lightest shared logging activity</p>
              </div>
            </div>

            <div className="signal-list">
              {patientSignals.length ? patientSignals.map((item, index) => (
                <div key={item.memberId} className="signal-item">
                  <div className="signal-avatar" style={{ background: ['#eee6fa', '#fde8e2', '#e7efe0'][index % 3] }}>
                    {getInitials(item.name)}
                  </div>
                  <div>
                    <div className="signal-title">{item.name}</div>
                    <div className="signal-sub">{item.goalFocus || 'Goal not set'} · {item.sessions} sessions</div>
                  </div>
                  <div className="signal-meta">{item.foodLogs + item.activityLogs} logs</div>
                </div>
              )) : (
                <div className="admin-note">No patient signals yet because no members are attached to this account.</div>
              )}
            </div>
          </section>
        </div>

        {loading ? <div className="admin-note">Loading nutritionist dashboard...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}
      </div>
    </div>
  )
}
