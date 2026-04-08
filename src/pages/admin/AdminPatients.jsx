import { useEffect, useMemo, useState } from 'react'
import { Bell, Filter, Search, Users } from 'lucide-react'
import { getNutritionistPatients } from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

const statusTone = {
  active: 'badge-green',
  new: 'badge-sky',
}

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

function toPatientView(patient, index) {
  const progress = Math.min((patient.foodLogs * 12) + (patient.activityLogs * 16), 100)

  return {
    ...patient,
    id: patient.memberId,
    goal: patient.goalFocus || 'Goal not set',
    status: patient.foodLogs + patient.activityLogs > 0 ? 'active' : 'new',
    progress,
    lastSeen: patient.activityLogs > 0 ? `${patient.activityLogs} activity logs` : `${patient.foodLogs} food logs`,
    color: ['#f8eccc', '#e8f0fb', '#eee6fa', '#fde8e2', '#e7efe0', '#fff2df'][index % 6],
    tags: [`${patient.foodLogs} meals`, `${patient.activityLogs} check-ins`],
  }
}

export default function AdminPatients() {
  const session = getNutritionistSession()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in as a nutritionist to view your real patients.')
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getNutritionistPatients(session.accessToken)

        if (!cancelled) {
          setPatients(Array.isArray(response) ? response.map(toPatientView) : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setPatients([])
          setError(requestError.message || 'Unable to load the patient roster right now.')
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

  const filteredPatients = useMemo(
    () => patients.filter((patient) => {
      const matchesFilter = filter === 'All' || patient.status === filter.toLowerCase()
      const searchValue = `${patient.name} ${patient.goal} ${patient.tags.join(' ')}`.toLowerCase()
      return matchesFilter && searchValue.includes(query.toLowerCase())
    }),
    [filter, patients, query],
  )

  const atRiskPatients = filteredPatients
    .filter((patient) => patient.progress < 60)
    .slice(0, 3)

  const statCards = [
    { label: 'Total patients', value: filteredPatients.length, tone: '#f8eccc', accent: '#c9953b' },
    { label: 'Active plans', value: filteredPatients.filter((item) => item.status === 'active').length, tone: '#e7efe0', accent: '#73955f' },
    { label: 'Reviews due', value: filteredPatients.filter((item) => item.progress < 60).length, tone: '#fde8e2', accent: '#bf5f47' },
    { label: 'New patients', value: filteredPatients.filter((item) => item.status === 'new').length, tone: '#e8f0fb', accent: '#4d82b7' },
  ]

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
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Patient command center</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                This roster now shows the real members attached to the logged-in nutritionist.
              </h2>
              <p className="hero-copy">
                Demo patient rows have been removed. Members appear here only when they have real sessions with this
                nutritionist account and actual shared tracker data.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{patients.length} roster patients</span>
                <span className="badge badge-amber">{atRiskPatients.length} low-log reviews</span>
                <span className="badge badge-sky">Backend-driven list</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Care load</h3>
                  <p>Snapshot from real sessions and tracker logs</p>
                </div>
                <Users size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{patients.reduce((sum, item) => sum + item.sessions, 0)}</strong>
                  <span>total booked sessions</span>
                </div>
                <div className="mini-metric">
                  <strong>{patients.reduce((sum, item) => sum + item.foodLogs + item.activityLogs, 0)}</strong>
                  <span>shared tracker logs</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {statCards.map(({ label, value, tone, accent }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <Users size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Roster</span>
              </div>
              <div className="metric-card-value">{value}</div>
              <div className="metric-card-label">{label}</div>
            </article>
          ))}
        </section>

        <div className="g-2-auto">
          <section className="support-card admin-surface-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Patient list</h3>
                <p>Search by member name, goal, or real tracker counts</p>
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
                {['All', 'Active', 'New'].map((value) => (
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

            {loading ? <div className="admin-note">Loading nutritionist patients...</div> : null}
            {error ? <div className="admin-note">{error}</div> : null}
            {!loading && !error && !filteredPatients.length ? (
              <div className="admin-note">No patients are linked to this nutritionist account yet.</div>
            ) : null}

            {!!filteredPatients.length && (
              <div className="admin-table-card">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Patient</th>
                      <th>Goal</th>
                      <th>Sessions</th>
                      <th>Food logs</th>
                      <th>Activity logs</th>
                      <th>Progress</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient) => (
                      <tr key={patient.id}>
                        <td>
                          <div className="admin-table-person">
                            <div className="admin-avatar-chip" style={{ background: patient.color }}>
                              {getInitials(patient.name)}
                            </div>
                            <div>
                              <div className="admin-table-title">{patient.name}</div>
                              <div className="admin-table-sub">{patient.age ? `Age ${patient.age}` : 'Age not shared'}</div>
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
                        <td><span className="admin-table-title">{patient.sessions}</span></td>
                        <td><span className="admin-table-title">{patient.foodLogs}</span></td>
                        <td><span className="admin-table-title">{patient.activityLogs}</span></td>
                        <td>
                          <div className="admin-progress-row">
                            <div className="progress-bar-wrap">
                              <div className="progress-bar-fill" style={{ width: `${patient.progress}%` }} />
                            </div>
                            <span>{patient.progress}%</span>
                          </div>
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
            )}
          </section>

          <div className="admin-side-stack">
            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Review priority</h3>
                  <p>Members with the lightest logging activity</p>
                </div>
              </div>

              <div className="signal-list">
                {atRiskPatients.length ? atRiskPatients.map((patient) => (
                  <div key={patient.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: patient.color }}>
                      {getInitials(patient.name)}
                    </div>
                    <div>
                      <div className="signal-title">{patient.name}</div>
                      <div className="signal-sub">
                        {patient.goal} with {patient.progress}% progress
                      </div>
                    </div>
                    <div className="signal-meta">{patient.lastSeen}</div>
                  </div>
                )) : (
                  <div className="admin-note">No review-priority patients right now.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
