import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Filter, Plus, Search, Users } from 'lucide-react'

const patients = [
  {
    id: 1,
    name: 'Rekha Sharma',
    age: 28,
    goal: 'Weight loss',
    sessions: 8,
    lastSeen: '2 days ago',
    status: 'active',
    progress: 72,
    bmi: 26.4,
    color: '#f8eccc',
    tags: ['PCOS', 'Vegetarian'],
  },
  {
    id: 2,
    name: 'Krishna Murthy',
    age: 34,
    goal: 'Muscle gain',
    sessions: 5,
    lastSeen: 'Yesterday',
    status: 'active',
    progress: 45,
    bmi: 23.1,
    color: '#e8f0fb',
    tags: ['Diabetic', 'Sports'],
  },
  {
    id: 3,
    name: 'Priya Verma',
    age: 22,
    goal: 'PCOS management',
    sessions: 12,
    lastSeen: 'Today',
    status: 'completed',
    progress: 91,
    bmi: 24.8,
    color: '#eee6fa',
    tags: ['PCOS'],
  },
  {
    id: 4,
    name: 'Arjun Reddy',
    age: 45,
    goal: 'Diabetes control',
    sessions: 3,
    lastSeen: '1 week ago',
    status: 'new',
    progress: 20,
    bmi: 28.7,
    color: '#fde8e2',
    tags: ['Type 2', 'Hypertension'],
  },
  {
    id: 5,
    name: 'Sunita Patel',
    age: 38,
    goal: 'Heart health',
    sessions: 6,
    lastSeen: '3 days ago',
    status: 'active',
    progress: 58,
    bmi: 25.2,
    color: '#e7efe0',
    tags: ['Cholesterol'],
  },
  {
    id: 6,
    name: 'Rahul Singh',
    age: 29,
    goal: 'Weight loss',
    sessions: 10,
    lastSeen: 'Today',
    status: 'active',
    progress: 65,
    bmi: 30.1,
    color: '#fff2df',
    tags: ['Keto', 'High BP'],
  },
]

const statusTone = {
  active: 'badge-green',
  completed: 'badge-emerald',
  new: 'badge-sky',
  paused: 'badge-amber',
}

const statCards = [
  { label: 'Total patients', getValue: (items) => items.length, tone: '#f8eccc', accent: '#c9953b' },
  { label: 'Active plans', getValue: (items) => items.filter((item) => item.status === 'active').length, tone: '#e7efe0', accent: '#73955f' },
  { label: 'Reviews due', getValue: (items) => items.filter((item) => item.progress < 60).length, tone: '#fde8e2', accent: '#bf5f47' },
  { label: 'New this week', getValue: (items) => items.filter((item) => item.status === 'new').length, tone: '#e8f0fb', accent: '#4d82b7' },
]

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function AdminPatients() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredPatients = useMemo(
    () => patients.filter((patient) => {
      const matchesFilter = filter === 'All' || patient.status === filter.toLowerCase()
      const searchValue = `${patient.name} ${patient.goal} ${patient.tags.join(' ')}`.toLowerCase()
      return matchesFilter && searchValue.includes(query.toLowerCase())
    }),
    [filter, query],
  )

  const atRiskPatients = filteredPatients
    .filter((patient) => patient.progress < 60)
    .slice(0, 3)

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Practice roster</div>
          <h1>Patients</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">{filteredPatients.length} visible</span>
          <button className="icon-btn">
            <Bell size={18} />
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add patient
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Patient command center</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Scan your roster with the same calm hierarchy used across the member dashboard.
              </h2>
              <p className="hero-copy">
                Filters, search, progress, and care status are now grouped into one cleaner
                workspace, so you can spot new patients, active plans, and review pressure faster.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">4 active plans</span>
                <span className="badge badge-amber">3 reviews due</span>
                <span className="badge badge-sky">1 new intake</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Care load</h3>
                  <p>Use this week&apos;s roster to prioritize follow-ups first</p>
                </div>
                <Users size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>72%</strong>
                  <span>average completion pace</span>
                </div>
                <div className="mini-metric">
                  <strong>4</strong>
                  <span>members seen this week</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Rekha and Priya are stable. Arjun and Krishna should be reviewed first because
                their program progress is below the current clinic target.
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {statCards.map(({ label, getValue, tone, accent }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <Users size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Roster</span>
              </div>
              <div className="metric-card-value">{getValue(filteredPatients)}</div>
              <div className="metric-card-label">{label}</div>
            </article>
          ))}
        </section>

        <div className="g-2-auto">
          <section className="support-card admin-surface-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Patient list</h3>
                <p>Search by member name, goal, or care tags</p>
              </div>
            </div>

            <div className="admin-toolbar">
              <div className="search-wrap">
                <Search size={15} color="#9ca38f" />
                <input
                  placeholder="Search patients"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>

              <div className="filter-tabs">
                {['All', 'Active', 'New', 'Completed'].map((value) => (
                  <button
                    key={value}
                    className={`filter-tab ${filter === value ? 'active' : ''}`}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                  </button>
                ))}
              </div>

              <button className="icon-btn">
                <Filter size={16} />
              </button>
            </div>

            <div className="admin-table-card">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Goal</th>
                    <th>BMI</th>
                    <th>Sessions</th>
                    <th>Progress</th>
                    <th>Last seen</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map((patient) => (
                    <tr key={patient.id} onClick={() => navigate('/admin/appointments')}>
                      <td>
                        <div className="admin-table-person">
                          <div
                            className="admin-avatar-chip"
                            style={{ background: patient.color }}
                          >
                            {getInitials(patient.name)}
                          </div>
                          <div>
                            <div className="admin-table-title">{patient.name}</div>
                            <div className="admin-table-sub">Age {patient.age}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admin-goal-block">
                          <div className="admin-table-title">{patient.goal}</div>
                          <div className="pill-row" style={{ marginTop: '0.4rem' }}>
                            {patient.tags.map((tag) => (
                              <span key={tag} className="badge badge-gray">{tag}</span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="admin-table-title">{patient.bmi}</span>
                      </td>
                      <td>
                        <span className="admin-table-title">{patient.sessions}</span>
                      </td>
                      <td>
                        <div className="admin-progress-row">
                          <div className="progress-bar-wrap">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${patient.progress}%` }}
                            />
                          </div>
                          <span>{patient.progress}%</span>
                        </div>
                      </td>
                      <td>
                        <span className="admin-table-sub">{patient.lastSeen}</span>
                      </td>
                      <td>
                        <span className={`badge ${statusTone[patient.status] || 'badge-gray'}`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Review priority</h3>
                  <p>Members that need a closer plan check</p>
                </div>
              </div>

              <div className="signal-list">
                {atRiskPatients.map((patient) => (
                  <div key={patient.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: patient.color }}>
                      {getInitials(patient.name)}
                    </div>
                    <div>
                      <div className="signal-title">{patient.name}</div>
                      <div className="signal-sub">
                        {patient.goal} with {patient.progress}% completion
                      </div>
                    </div>
                    <div className="signal-meta">{patient.lastSeen}</div>
                  </div>
                ))}
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Roster notes</h3>
                  <p>Quick reminders before you open a profile</p>
                </div>
              </div>

              <ul className="check-list">
                <li><span className="check-dot">1</span><span>Open new intakes first and confirm current weight, goals, and plan expectations.</span></li>
                <li><span className="check-dot">2</span><span>Use the progress bar and last-seen field together before adjusting a stalled plan.</span></li>
                <li><span className="check-dot">3</span><span>Keep care tags tight so search stays useful as more members join the roster.</span></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
