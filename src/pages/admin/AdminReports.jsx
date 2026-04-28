import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  Download,
  FileText,
  Plus,
  Save,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import {
  createNutritionistReport,
  getNutritionistPatients,
  getNutritionistReports,
} from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

const goalOptions = [
  'Diet adherence',
  'Weight target',
  'Lab values',
  'Energy levels',
  'Protein intake',
  'Hydration goals',
  'Exercise routine',
  'Stress management',
]

function formatDate(value) {
  if (!value) return 'Not scheduled'

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function normalizeReport(report) {
  return {
    ...report,
    name: report.memberName,
    goal: report.goal || 'General care',
    sessions: report.sessionsCompleted || 0,
    completion: report.completion || 0,
    bmiChange: report.bmiChange || '',
    date: report.sessionDate,
    lastNote: report.clinicalNote || '',
    recommendations: report.recommendations || '',
    goalsMet: Array.isArray(report.goalsMet) ? report.goalsMet : [],
  }
}

function CreateReportModal({ patients, onClose, onSave, saving }) {
  const [form, setForm] = useState({
    memberId: '',
    goal: '',
    sessions: '',
    completion: 50,
    bmiChange: '',
    lastNote: '',
    date: new Date().toISOString().split('T')[0],
    goalsMet: [],
    recommendations: '',
  })

  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const toggleGoal = (goal) => {
    setForm((current) => ({
      ...current,
      goalsMet: current.goalsMet.includes(goal)
        ? current.goalsMet.filter((item) => item !== goal)
        : [...current.goalsMet, goal],
    }))
  }

  const handleSave = () => {
    if (!form.memberId || !form.goal.trim() || !form.lastNote.trim()) {
      return
    }

    onSave({
      memberId: Number(form.memberId),
      goal: form.goal.trim(),
      sessionsCompleted: Number(form.sessions) || 0,
      completion: Number(form.completion) || 0,
      bmiChange: form.bmiChange.trim(),
      sessionDate: form.date,
      clinicalNote: form.lastNote.trim(),
      recommendations: form.recommendations.trim(),
      goalsMet: form.goalsMet,
    })
  }

  return (
    <div className="admin-modal-shell" onClick={onClose}>
      <div className="admin-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h3>Create patient report</h3>
            <p>Document progress, session context, and next-step guidance.</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="tracker-form-grid tracker-form-grid-2">
          <label>
            <span className="form-label">Patient</span>
            <select
              className="form-input"
              value={form.memberId}
              onChange={(event) => updateField('memberId', event.target.value)}
            >
              <option value="">Select patient</option>
              {patients.map((patient) => (
                <option key={patient.memberId} value={patient.memberId}>{patient.name}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="form-label">Session date</span>
            <input
              className="form-input"
              type="date"
              value={form.date}
              onChange={(event) => updateField('date', event.target.value)}
            />
          </label>

          <label>
            <span className="form-label">Goal</span>
            <input
              className="form-input"
              value={form.goal}
              onChange={(event) => updateField('goal', event.target.value)}
              placeholder="Primary care goal"
            />
          </label>

          <label>
            <span className="form-label">Sessions completed</span>
            <input
              className="form-input"
              type="number"
              min="0"
              value={form.sessions}
              onChange={(event) => updateField('sessions', event.target.value)}
              placeholder="0"
            />
          </label>

          <label>
            <span className="form-label">BMI change</span>
            <input
              className="form-input"
              value={form.bmiChange}
              onChange={(event) => updateField('bmiChange', event.target.value)}
              placeholder="-1.5"
            />
          </label>

          <label className="admin-report-range">
            <span className="form-label">Plan completion: {form.completion}%</span>
            <input
              type="range"
              min="0"
              max="100"
              value={form.completion}
              onChange={(event) => updateField('completion', Number(event.target.value))}
            />
          </label>
        </div>

        <div className="admin-goal-picker">
          {goalOptions.map((goal) => (
            <button
              key={goal}
              type="button"
              className={`filter-tab ${form.goalsMet.includes(goal) ? 'active' : ''}`}
              onClick={() => toggleGoal(goal)}
            >
              {form.goalsMet.includes(goal) ? <Check size={13} /> : null}
              {goal}
            </button>
          ))}
        </div>

        <label>
          <span className="form-label">Clinical notes</span>
          <textarea
            className="form-input tracker-textarea"
            value={form.lastNote}
            onChange={(event) => updateField('lastNote', event.target.value)}
            placeholder="Document progress, concerns, or plan adjustments."
          />
        </label>

        <label>
          <span className="form-label">Recommendations</span>
          <textarea
            className="form-input tracker-textarea"
            value={form.recommendations}
            onChange={(event) => updateField('recommendations', event.target.value)}
            placeholder="Add guidance for the next phase of care."
          />
        </label>

        <div className="admin-modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} />
            {saving ? 'Saving...' : 'Save report'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminReports() {
  const session = getNutritionistSession()
  const [reports, setReports] = useState([])
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [patientError, setPatientError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setPatientError('')
        const [reportResponse, patientResponse] = await Promise.all([
          getNutritionistReports(session.accessToken),
          getNutritionistPatients(session.accessToken),
        ])

        if (!cancelled) {
          setReports(Array.isArray(reportResponse) ? reportResponse.map(normalizeReport) : [])
          setPatients(Array.isArray(patientResponse) ? patientResponse : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setReports([])
          setPatients([])
          setPatientError(requestError.message || 'Unable to load report details right now.')
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

  const handleSave = async (report) => {
    if (!session.accessToken) {
      return
    }

    try {
      setSaving(true)
      const saved = await createNutritionistReport(session.accessToken, report)
      setReports((current) => [normalizeReport(saved), ...current])
      setShowModal(false)
    } catch (requestError) {
      setPatientError(requestError.message || 'Unable to save the report right now.')
    } finally {
      setSaving(false)
    }
  }

  const averageCompletion = reports.length
    ? Math.round(reports.reduce((sum, item) => sum + (Number(item.completion) || 0), 0) / reports.length)
    : 0

  const uniquePatients = new Set(reports.map((item) => item.name?.trim()?.toLowerCase()).filter(Boolean)).size
  const latestReport = reports[0]

  const goalBreakdown = useMemo(() => {
    const counts = reports.reduce((map, report) => {
      const key = report.goal || 'General care'
      map.set(key, (map.get(key) || 0) + 1)
      return map
    }, new Map())

    return [...counts.entries()]
      .map(([goal, count]) => ({ goal, count }))
      .sort((left, right) => right.count - left.count)
      .slice(0, 5)
  }, [reports])

  const statCards = [
    { label: 'Saved reports', value: reports.length, foot: 'Reports stored in the backend', tone: '#eee6fa', accent: '#7a61b8', icon: FileText },
    { label: 'Tracked patients', value: patients.length, foot: 'Members currently connected to your practice', tone: '#e7efe0', accent: '#73955f', icon: Users },
    { label: 'Avg completion', value: `${averageCompletion}%`, foot: 'Across saved reports', tone: '#e8f0fb', accent: '#4d82b7', icon: TrendingUp },
    { label: 'Patients documented', value: uniquePatients, foot: 'Unique people with saved reports', tone: '#f8eccc', accent: '#c9953b', icon: FileText },
  ]

  return (
    <div className="animate-fade">
      {showModal ? <CreateReportModal patients={patients} onClose={() => setShowModal(false)} onSave={handleSave} saving={saving} /> : null}

      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Clinical documentation</div>
          <h1>Reports</h1>
        </div>

        <div className="page-header-right">
          <button className="btn btn-outline">
            <Download size={16} />
            Export all
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)} disabled={!patients.length}>
            <Plus size={16} />
            Create report
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="admin-hero">
          <div className="admin-hero-grid">
            <div>
              <div className="eyebrow">Report workspace</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Capture patient progress, clinical notes, and next-step guidance in a clear format.
              </h2>
              <p className="hero-copy">
                The local dummy report store has been removed. This page now reads and writes only real nutritionist reports.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{reports.length} saved reports</span>
                <span className="badge badge-amber">{patients.length} connected patients</span>
                <span className="badge badge-sky">{latestReport ? `Latest: ${formatDate(latestReport.date)}` : 'No reports yet'}</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Documentation status</h3>
                  <p>Keep report writing active as consultations progress.</p>
                </div>
                <FileText size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{averageCompletion}%</strong>
                  <span>average plan completion</span>
                </div>
                <div className="mini-metric">
                  <strong>{uniquePatients}</strong>
                  <span>patients documented</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                {latestReport
                  ? `Most recent report saved for ${latestReport.name} on ${formatDate(latestReport.date)}.`
                  : 'Create your first report to start documenting patient progress.'}
              </div>
            </div>
          </div>
        </section>

        <section className="summary-grid">
          {statCards.map(({ label, value, foot, tone, accent, icon: Icon }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <Icon size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Reports</span>
              </div>
              <div className="metric-card-value">{value}</div>
              <div className="metric-card-label">{label}</div>
              <div className="metric-card-foot" style={{ color: accent }}>{foot}</div>
            </article>
          ))}
        </section>

        {loading ? <div className="admin-note">Loading report workspace...</div> : null}
        {patientError ? <div className="admin-note">{patientError}</div> : null}

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Goal coverage</h3>
                <p>Which care goals appear most often across saved reports.</p>
              </div>
            </div>

            {!goalBreakdown.length ? (
              <div className="admin-note">Goal coverage will appear after reports are added.</div>
            ) : (
              <div className="admin-outcome-list">
                {goalBreakdown.map((item) => {
                  const width = Math.max((item.count / reports.length) * 100, 12)

                  return (
                    <div key={item.goal}>
                      <div className="admin-outcome-row">
                        <span>{item.goal}</span>
                        <strong>{item.count}</strong>
                      </div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Connected patients</h3>
                <p>Members currently visible in your practice roster.</p>
              </div>
            </div>

            {!patients.length ? (
              <div className="admin-note">Patients will appear here once members book appointments and share activity.</div>
            ) : (
              <div className="signal-list">
                {patients.slice(0, 5).map((patient) => (
                  <div key={patient.memberId || patient.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: 'rgba(115, 149, 95, 0.12)' }}>
                      {patient.name?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div className="signal-title">{patient.name}</div>
                      <div className="signal-sub">{patient.goalFocus || 'Goal not set'}</div>
                    </div>
                    <div className="signal-meta">{patient.sessions || 0} sessions</div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <section className="support-card admin-surface-card">
          <div className="admin-toolbar">
            <div>
              <h3 style={{ marginBottom: '0.2rem' }}>Patient reports</h3>
              <p style={{ color: '#8b907f', fontSize: '0.84rem' }}>
                Expand a report to review notes, outcomes, and recommendations.
              </p>
            </div>

            <button className="btn btn-secondary" onClick={() => setShowModal(true)} disabled={!patients.length}>
              <Plus size={16} />
              New report
            </button>
          </div>

          {!reports.length ? (
            <div className="admin-note">No reports have been created yet.</div>
          ) : (
            <div className="admin-report-list">
              {reports.map((report) => {
                const isExpanded = expandedId === report.id

                return (
                  <article key={report.id} className={`admin-report-item ${isExpanded ? 'expanded' : ''}`}>
                    <button
                      className="admin-report-row"
                      onClick={() => setExpandedId(isExpanded ? null : report.id)}
                    >
                      <div>
                        <div className="admin-table-title">{report.name}</div>
                        <div className="admin-table-sub">{report.goal}</div>
                      </div>
                      <div className="admin-report-progress">
                        <div className="progress-bar-wrap">
                          <div className="progress-bar-fill" style={{ width: `${report.completion}%` }} />
                        </div>
                        <span>{report.completion}%</span>
                      </div>
                      <div className="admin-report-meta">
                        <strong>{report.bmiChange || '--'}</strong>
                        <span>BMI change</span>
                      </div>
                      <div className="admin-table-sub">{formatDate(report.date)}</div>
                      <div className="badge badge-green">{report.goalsMet.length} goals met</div>
                    </button>

                    {isExpanded ? (
                      <div className="admin-report-body">
                        <div>
                          <h4>Clinical note</h4>
                          <p>{report.lastNote}</p>
                        </div>
                        <div>
                          <h4>Goals met</h4>
                          <div className="pill-row">
                            {report.goalsMet.length ? report.goalsMet.map((goal) => (
                              <span key={goal} className="badge badge-green">{goal}</span>
                            )) : <span className="badge badge-gray">No goals marked yet</span>}
                          </div>
                        </div>
                        <div>
                          <h4>Recommendations</h4>
                          <p>{report.recommendations || 'No recommendations added yet.'}</p>
                        </div>
                      </div>
                    ) : null}
                  </article>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
