import { useState } from 'react'
import {
  BarChart2,
  Check,
  Download,
  FileText,
  Plus,
  Save,
  Star,
  TrendingUp,
  Users,
  X,
} from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const outcomeData = [
  { category: 'Weight loss', success: 88 },
  { category: 'Diabetes care', success: 92 },
  { category: 'PCOS', success: 85 },
  { category: 'Muscle gain', success: 78 },
  { category: 'Heart health', success: 94 },
  { category: 'Gut health', success: 80 },
]

const radarData = [
  { metric: 'Adherence', score: 85 },
  { metric: 'Progress', score: 78 },
  { metric: 'Retention', score: 92 },
  { metric: 'Rating', score: 98 },
  { metric: 'Response', score: 88 },
  { metric: 'Goals met', score: 80 },
]

const patientGrowth = [
  { month: 'Aug', patients: 28 },
  { month: 'Sep', patients: 35 },
  { month: 'Oct', patients: 31 },
  { month: 'Nov', patients: 44 },
  { month: 'Dec', patients: 39 },
  { month: 'Jan', patients: 52 },
  { month: 'Feb', patients: 48 },
]

const initialReports = [
  {
    id: 1,
    name: 'Rekha Sharma',
    goal: 'Weight loss',
    sessions: 8,
    completion: 72,
    bmiChange: '-2.1',
    lastNote: 'Patient is responding well to a lower-carb meal pattern.',
    date: '2026-02-20',
    goalsMet: ['Diet adherence', 'Weight target'],
    recommendations: 'Keep the current meal plan. Add 30 minutes of walking daily.',
  },
  {
    id: 2,
    name: 'Krishna Murthy',
    goal: 'Muscle gain',
    sessions: 5,
    completion: 45,
    bmiChange: '+0.8',
    lastNote: 'Protein intake improved, but total calories still need attention.',
    date: '2026-02-18',
    goalsMet: ['Protein intake'],
    recommendations: 'Raise total intake and pair it with resistance training.',
  },
  {
    id: 3,
    name: 'Priya Verma',
    goal: 'PCOS management',
    sessions: 12,
    completion: 91,
    bmiChange: '-1.5',
    lastNote: 'Excellent consistency. Energy and hormonal markers are improving.',
    date: '2026-02-25',
    goalsMet: ['Diet adherence', 'Weight target', 'Lab values', 'Energy levels'],
    recommendations: 'Maintain the current plan and schedule labs again in six weeks.',
  },
  {
    id: 4,
    name: 'Arjun Reddy',
    goal: 'Diabetes control',
    sessions: 3,
    completion: 20,
    bmiChange: '-0.3',
    lastNote: 'Carb adjustments started, but logging is still inconsistent.',
    date: '2026-02-15',
    goalsMet: ['Diet adherence'],
    recommendations: 'Monitor carb intake closely and review again in two weeks.',
  },
]

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

const statCards = [
  { label: 'Average success rate', value: '86%', foot: 'Across active programs', tone: '#f8eccc', accent: '#c9953b', icon: Star },
  { label: 'Patient retention', value: '92%', foot: 'Members continuing plans', tone: '#e7efe0', accent: '#73955f', icon: Users },
  { label: 'Average goal time', value: '3.2 mo', foot: 'Typical plan completion window', tone: '#e8f0fb', accent: '#4d82b7', icon: TrendingUp },
  { label: 'Reports generated', value: `${initialReports.length}`, foot: 'Current clinic documents', tone: '#eee6fa', accent: '#7a61b8', icon: FileText },
]

const tooltipContent = ({ active, payload, label }) => (
  active && payload?.length ? (
    <div className="admin-chart-tooltip">
      <div>{label}</div>
      <div><strong>{payload[0]?.value}</strong> patients</div>
    </div>
  ) : null
)

function CreateReportModal({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
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
    if (!form.name || !form.goal || !form.lastNote) return
    onSave({ ...form, id: Date.now() })
  }

  return (
    <div className="admin-modal-shell" onClick={onClose}>
      <div className="admin-modal-card" onClick={(event) => event.stopPropagation()}>
        <div className="admin-modal-header">
          <div>
            <h3>Create patient report</h3>
            <p>Document session context, progress, and next-step guidance.</p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="tracker-form-grid tracker-form-grid-2">
          <label>
            <span className="form-label">Patient name</span>
            <input
              className="form-input"
              value={form.name}
              onChange={(event) => updateField('name', event.target.value)}
              placeholder="Full name"
            />
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
            <select
              className="form-input"
              value={form.goal}
              onChange={(event) => updateField('goal', event.target.value)}
            >
              <option value="">Select goal</option>
              {['Weight loss', 'Muscle gain', 'Diabetes care', 'PCOS management', 'Heart health', 'Gut health', 'General wellness'].map((goal) => (
                <option key={goal} value={goal}>{goal}</option>
              ))}
            </select>
          </label>

          <label>
            <span className="form-label">Sessions completed</span>
            <input
              className="form-input"
              type="number"
              min="1"
              value={form.sessions}
              onChange={(event) => updateField('sessions', event.target.value)}
              placeholder="e.g. 5"
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
            placeholder="Document patient progress, adjustments, and concerns."
          />
        </label>

        <label>
          <span className="form-label">Recommendations</span>
          <textarea
            className="form-input tracker-textarea"
            value={form.recommendations}
            onChange={(event) => updateField('recommendations', event.target.value)}
            placeholder="Add next-step guidance and follow-up actions."
          />
        </label>

        <div className="admin-modal-actions">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Save size={16} />
            Save report
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminReports() {
  const [reports, setReports] = useState(initialReports)
  const [showModal, setShowModal] = useState(false)
  const [expandedId, setExpandedId] = useState(null)

  const handleSave = (report) => {
    setReports((current) => [report, ...current])
    setShowModal(false)
  }

  return (
    <div className="animate-fade">
      {showModal ? <CreateReportModal onClose={() => setShowModal(false)} onSave={handleSave} /> : null}

      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Practice analytics</div>
          <h1>Reports</h1>
        </div>

        <div className="page-header-right">
          <button className="btn btn-outline">
            <Download size={16} />
            Export all
          </button>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} />
            Create report
          </button>
        </div>
      </div>

      <div className="page-body admin-page-stack">
        <section className="summary-grid">
          {statCards.map(({ label, value, foot, tone, accent, icon: Icon }) => (
            <article key={label} className="metric-card">
              <div className="metric-card-top">
                <div className="metric-card-icon" style={{ background: tone }}>
                  <Icon size={18} color={accent} />
                </div>
                <span style={{ color: accent, fontWeight: 800, fontSize: '0.78rem' }}>Insight</span>
              </div>
              <div className="metric-card-value">{label === 'Reports generated' ? reports.length : value}</div>
              <div className="metric-card-label">{label}</div>
              <div className="metric-card-foot" style={{ color: accent }}>{foot}</div>
            </article>
          ))}
        </section>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Treatment outcomes</h3>
                <p>Current success rate by care area</p>
              </div>
            </div>

            <div className="admin-outcome-list">
              {outcomeData.map((item) => (
                <div key={item.category}>
                  <div className="admin-outcome-row">
                    <span>{item.category}</span>
                    <strong>{item.success}%</strong>
                  </div>
                  <div className="progress-bar-wrap">
                    <div className="progress-bar-fill" style={{ width: `${item.success}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="focus-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Patient growth</h3>
                <p>Monthly growth in the active member base</p>
              </div>
              <span className="badge badge-green">+71% since Aug</span>
            </div>

            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={patientGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ede6" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca38f' }} />
                <YAxis hide />
                <Tooltip content={tooltipContent} />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#73955f"
                  strokeWidth={2.5}
                  dot={{ fill: '#73955f', r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#5c784a', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </section>
        </div>

        <div className="g-2">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Practice quality</h3>
                <p>Six dimensions of care performance</p>
              </div>
              <BarChart2 size={18} color="#73955f" />
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ebe6dc" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 10, fill: '#8b907f' }} />
                <Radar dataKey="score" stroke="#73955f" fill="#73955f" fillOpacity={0.16} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Monthly outcome mix</h3>
                <p>Another quick view of outcome distribution</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={230}>
              <BarChart data={outcomeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ede6" vertical={false} />
                <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca38f' }} />
                <YAxis hide />
                <Tooltip content={({ active, payload }) => active && payload?.length ? (
                  <div className="admin-chart-tooltip">
                    <div><strong>{payload[0]?.payload?.category}</strong></div>
                    <div>{payload[0]?.value}% success</div>
                  </div>
                ) : null} />
                <Bar dataKey="success" fill="#c9953b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>
        </div>

        <section className="support-card admin-surface-card">
          <div className="admin-toolbar">
            <div>
              <h3 style={{ marginBottom: '0.2rem' }}>Patient reports</h3>
              <p style={{ color: '#8b907f', fontSize: '0.84rem' }}>
                Expand a report to read goals met and recommendations.
              </p>
            </div>

            <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
              <Plus size={16} />
              New report
            </button>
          </div>

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
                      <strong>{report.bmiChange}</strong>
                      <span>BMI change</span>
                    </div>
                    <div className="admin-table-sub">{report.date}</div>
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
                          {report.goalsMet.map((goal) => (
                            <span key={goal} className="badge badge-green">{goal}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4>Recommendations</h4>
                        <p>{report.recommendations}</p>
                      </div>
                    </div>
                  ) : null}
                </article>
              )
            })}
          </div>
        </section>
      </div>
    </div>
  )
}
