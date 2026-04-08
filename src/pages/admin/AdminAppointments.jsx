import { useState } from 'react'
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Plus,
  Video,
} from 'lucide-react'

const hours = ['9 AM', '10 AM', '11 AM', '12 PM', '1 PM', '2 PM', '3 PM', '4 PM', '5 PM']

const appointments = [
  { id: 1, time: '9:00 AM', name: 'Rekha Sharma', type: 'Follow-up', duration: 45, row: 0, status: 'done', initials: 'RS', color: '#f8eccc' },
  { id: 2, time: '11:30 AM', name: 'Krishna Murthy', type: 'Diet review', duration: 60, row: 2.5, status: 'done', initials: 'KM', color: '#e8f0fb' },
  { id: 3, time: '2:00 PM', name: 'Priya Verma', type: 'Initial consult', duration: 60, row: 5.5, status: 'upcoming', initials: 'PV', color: '#eee6fa' },
  { id: 4, time: '4:30 PM', name: 'Arjun Reddy', type: 'Follow-up', duration: 30, row: 7.5, status: 'upcoming', initials: 'AR', color: '#fde8e2' },
]

const upcomingList = [
  { name: 'Priya Verma', time: 'Today, 2:00 PM', type: 'Initial consult', initials: 'PV', color: '#eee6fa', video: true },
  { name: 'Arjun Reddy', time: 'Today, 4:30 PM', type: 'Follow-up', initials: 'AR', color: '#f8eccc', video: false },
  { name: 'Sunita Patel', time: 'Tomorrow, 10:00 AM', type: 'Diet review', initials: 'SP', color: '#e7efe0', video: true },
  { name: 'Rahul Singh', time: 'Tomorrow, 3:00 PM', type: 'Progress check', initials: 'RS', color: '#fff2df', video: false },
]

const weekDays = [
  { day: 'Mon', date: 24, appointments: 4 },
  { day: 'Tue', date: 25, appointments: 2 },
  { day: 'Wed', date: 26, appointments: 5 },
  { day: 'Thu', date: 27, appointments: 3 },
  { day: 'Fri', date: 28, appointments: 4 },
  { day: 'Sat', date: 29, appointments: 1 },
]

const statCards = [
  { label: 'Scheduled', value: '4', foot: 'Sessions on today board', tone: '#e7efe0', accent: '#73955f' },
  { label: 'Completed', value: '2', foot: 'Morning reviews already closed', tone: '#e8f0fb', accent: '#4d82b7' },
  { label: 'Upcoming', value: '2', foot: 'Afternoon consult block', tone: '#eee6fa', accent: '#7a61b8' },
  { label: 'Video calls', value: '2', foot: 'Remote check-ins still pending', tone: '#f8eccc', accent: '#c9953b' },
]

export default function AdminAppointments() {
  const [activeDay, setActiveDay] = useState(4)

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Schedule control</div>
          <h1>Appointments</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">4 sessions today</span>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            New appointment
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Session board</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                The clinic schedule now follows the same visual rhythm as the member tracker pages.
              </h2>
              <p className="hero-copy">
                Your week strip, time grid, and next-session stack are grouped into a calmer flow,
                so you can see what is completed, what is next, and where a consult needs context.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">Morning block completed</span>
                <span className="badge badge-amber">2 reviews left</span>
                <span className="badge badge-sky">2 remote sessions</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Today&apos;s pace</h3>
                  <p>Time already cleared and what still needs energy</p>
                </div>
                <Clock3 size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>2h 45m</strong>
                  <span>care time completed</span>
                </div>
                <div className="mini-metric">
                  <strong>1</strong>
                  <span>session needing prep notes</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Priya&apos;s intake consult is the most important remaining session. Open her notes
                before 2 PM and keep the 4:30 follow-up lighter.
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

        <div className="g-2-auto">
          <section className="support-card admin-schedule-shell">
            <div className="admin-schedule-top">
              <div className="admin-schedule-month">
                <button className="week-nav-btn">
                  <ChevronLeft size={14} />
                </button>
                <span>February 2026</span>
                <button className="week-nav-btn">
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="filter-tabs">
                {['Day', 'Week', 'Month'].map((view) => (
                  <button
                    key={view}
                    className={`filter-tab ${view === 'Day' ? 'active' : ''}`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-week-strip">
              {weekDays.map((item, index) => (
                <button
                  key={`${item.day}-${item.date}`}
                  className={`admin-week-day ${activeDay === index ? 'active' : ''}`}
                  onClick={() => setActiveDay(index)}
                >
                  <span>{item.day}</span>
                  <strong>{item.date}</strong>
                  <small>{item.appointments} booked</small>
                </button>
              ))}
            </div>

            <div className="admin-time-grid">
              {hours.map((hour, index) => (
                <div key={hour} className="admin-time-row">
                  <div className="admin-time-label">{hour}</div>
                  <div className="admin-time-track">
                    {appointments
                      .filter((appointment) => Math.floor(appointment.row) === index)
                      .map((appointment) => (
                        <button
                          key={appointment.id}
                          className={`admin-session-block ${appointment.status}`}
                          style={{
                            top: `${(appointment.row % 1) * 68}px`,
                            height: `${(appointment.duration / 60) * 68}px`,
                            background: appointment.status === 'done' ? 'rgba(255, 252, 247, 0.92)' : appointment.color,
                          }}
                        >
                          <div className="admin-session-avatar">{appointment.initials}</div>
                          <div className="admin-session-copy">
                            <strong>{appointment.name}</strong>
                            <span>{appointment.type}</span>
                            <small>{appointment.time} / {appointment.duration} min</small>
                          </div>
                          {appointment.status === 'done'
                            ? <CheckCircle2 size={14} color="#2f8d58" />
                            : <div className="admin-session-dot" />
                          }
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Session stats</h3>
                  <p>Quick scan before the next consult begins</p>
                </div>
              </div>

              <div className="admin-session-stat-grid">
                {[
                  { label: 'Scheduled', value: '4' },
                  { label: 'Completed', value: '2' },
                  { label: 'Upcoming', value: '2' },
                  { label: 'Cancelled', value: '0' },
                ].map((item) => (
                  <div key={item.label} className="mini-metric">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Upcoming sessions</h3>
                  <p>Keep the next consults and remote calls visible</p>
                </div>
              </div>

              <div className="signal-list">
                {upcomingList.map((appointment) => (
                  <div key={`${appointment.name}-${appointment.time}`} className="signal-item">
                    <div className="signal-avatar" style={{ background: appointment.color }}>
                      {appointment.initials}
                    </div>
                    <div>
                      <div className="signal-title">{appointment.name}</div>
                      <div className="signal-sub">{appointment.type}</div>
                      <div className="queue-sub">{appointment.time}</div>
                    </div>
                    {appointment.video ? (
                      <div className="admin-video-pill">
                        <Video size={14} />
                      </div>
                    ) : (
                      <div className="signal-meta">In clinic</div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
