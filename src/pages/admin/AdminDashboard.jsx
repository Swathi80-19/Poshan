import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Sparkles,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import { getNutritionistSession } from '../../lib/session'

const revenueTrend = [
  { month: 'Sep', revenue: 41000 },
  { month: 'Oct', revenue: 43800 },
  { month: 'Nov', revenue: 52000 },
  { month: 'Dec', revenue: 48700 },
  { month: 'Jan', revenue: 63000 },
  { month: 'Feb', revenue: 58000 },
  { month: 'Mar', revenue: 66400 },
]

const queue = [
  { time: '09:00', name: 'Rekha S.', sub: 'Follow-up for weight loss plan', meta: 'Ready' },
  { time: '11:30', name: 'Krishna M.', sub: 'Muscle gain intake review', meta: 'Chart updated' },
  { time: '14:00', name: 'Priya V.', sub: 'PCOS meal adherence check', meta: 'Needs adjustment' },
  { time: '16:30', name: 'Arjun R.', sub: 'Diabetes follow-up and report review', meta: 'Lab note pending' },
]

const patientSignals = [
  {
    initials: 'PV',
    title: 'Priya V. shows a fiber dip',
    sub: 'Three-day adherence fell to 58% after missing two logged meals.',
    meta: 'Review today',
    color: '#eee6fa',
  },
  {
    initials: 'AR',
    title: 'Arjun R. is missing a lab upload',
    sub: 'The session note needs glucose results before today evening.',
    meta: 'Request file',
    color: '#fde8e2',
  },
  {
    initials: 'KM',
    title: 'Krishna M. is holding protein goals',
    sub: 'Protein compliance has stayed above target for five straight days.',
    meta: 'Low risk',
    color: '#e7efe0',
  },
]

const dashboardMetrics = [
  {
    icon: CircleDollarSign,
    label: 'Monthly revenue',
    value: 'Rs 66,400',
    foot: '+14% compared with February',
    tone: '#f8eccc',
    accent: '#c9953b',
  },
  {
    icon: Users,
    label: 'Active patients',
    value: '48',
    foot: '7 plans need close follow-up',
    tone: '#e7efe0',
    accent: '#73955f',
  },
  {
    icon: CalendarDays,
    label: 'Sessions today',
    value: '4',
    foot: '2 follow-ups and 2 reviews',
    tone: '#e8f0fb',
    accent: '#4d82b7',
  },
  {
    icon: Sparkles,
    label: 'Care quality',
    value: '4.9',
    foot: 'Average patient satisfaction score',
    tone: '#eee6fa',
    accent: '#7a61b8',
  },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const session = getNutritionistSession()
  const displayName = session.username || session.name || 'Nutritionist'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Clinical overview</div>
          <h1>{displayName}&rsquo;s dashboard</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">Practice live</span>
          <button className="btn btn-primary" onClick={() => navigate('/admin/appointments')}>
            <CalendarDays size={16} />
            Today&apos;s schedule
          </button>
          <button className="icon-btn" style={{ position: 'relative' }}>
            <Bell size={18} />
            <span className="notification-dot" />
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
                A cleaner careboard for patient signals, schedule pressure, and revenue visibility.
              </h2>
              <p className="hero-copy">
                Today&apos;s board keeps the same Poshan structure as the member dashboard, but
                tuned for clinic work. One adherence dip, one pending lab file, and four sessions
                define the main focus for the day.
              </p>

              <div className="pill-row">
                <span className="badge badge-amber">2 follow-ups today</span>
                <span className="badge badge-green">Clinic load balanced</span>
                <span className="badge badge-sky">1 patient needs escalation</span>
              </div>

              <div className="hero-actions">
                <button className="btn btn-primary" onClick={() => navigate('/admin/patients')}>
                  <Users size={16} />
                  Open patient roster
                </button>
                <button className="btn btn-outline" onClick={() => navigate('/admin/reports')}>
                  Open reports
                </button>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Revenue rhythm</h3>
                  <p>Quarter-to-date collections and care continuity</p>
                </div>
                <span className="badge badge-green">+18% quarter</span>
              </div>

              <ResponsiveContainer width="100%" height={190}>
                <AreaChart data={revenueTrend}>
                  <defs>
                    <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#73955f" stopOpacity={0.34} />
                      <stop offset="95%" stopColor="#73955f" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(92, 120, 74, 0.08)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#7f8776', fontSize: 11 }}
                  />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#73955f"
                    strokeWidth={3}
                    fill="url(#revenueFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>Rs 3.7L</strong>
                  <span>quarter collections</span>
                </div>
                <div className="mini-metric">
                  <strong>82%</strong>
                  <span>follow-up retention</span>
                </div>
              </div>
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
                <h3>Today&apos;s queue</h3>
                <p>Session order with quick context for each member</p>
              </div>
              <Clock3 size={18} color="#73955f" />
            </div>

            <div className="queue-list">
              {queue.map((item) => (
                <div key={`${item.time}-${item.name}`} className="queue-item">
                  <div className="queue-time">{item.time}</div>
                  <div>
                    <div className="queue-title">{item.name}</div>
                    <div className="queue-sub">{item.sub}</div>
                  </div>
                  <div className="queue-meta">{item.meta}</div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-secondary"
              style={{ marginTop: '1rem' }}
              onClick={() => navigate('/admin/appointments')}
            >
              Open full schedule
              <ChevronRight size={16} />
            </button>
          </section>

          <section className="signal-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Patient signals</h3>
                <p>Fast triage for adherence, lab, and progress changes</p>
              </div>
              <TrendingUp size={18} color="#c9953b" />
            </div>

            <div className="signal-list">
              {patientSignals.map((item) => (
                <div key={item.title} className="signal-item">
                  <div className="signal-avatar" style={{ background: item.color }}>{item.initials}</div>
                  <div>
                    <div className="signal-title">{item.title}</div>
                    <div className="signal-sub">{item.sub}</div>
                  </div>
                  <div className="signal-meta">{item.meta}</div>
                </div>
              ))}
            </div>

            <div className="admin-note" style={{ marginTop: '1rem' }}>
              Priya&apos;s check-in should be handled first. Her recent intake pattern shows the
              biggest care impact if adjusted today.
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
