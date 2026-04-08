import { useState } from 'react'
import { Bell, Clock3, CreditCard, Download, TrendingUp, Wallet } from 'lucide-react'
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getNutritionistSession } from '../../lib/session'

const monthlyData = [
  { month: 'Aug', income: 32000, payout: 25600 },
  { month: 'Sep', income: 41000, payout: 32800 },
  { month: 'Oct', income: 38000, payout: 30400 },
  { month: 'Nov', income: 52000, payout: 41600 },
  { month: 'Dec', income: 47000, payout: 37600 },
  { month: 'Jan', income: 63000, payout: 50400 },
  { month: 'Feb', income: 58000, payout: 46400 },
]

const transactions = [
  { id: 'TXN001', patient: 'Rekha Sharma', amount: 1500, type: 'credit', date: 'Feb 27, 2026', plan: '1 month plan', status: 'completed', initials: 'RS', color: '#f8eccc' },
  { id: 'TXN002', patient: 'Krishna Murthy', amount: 4500, type: 'credit', date: 'Feb 25, 2026', plan: '5 month plan', status: 'completed', initials: 'KM', color: '#e8f0fb' },
  { id: 'TXN003', patient: 'Priya Verma', amount: 10000, type: 'credit', date: 'Feb 22, 2026', plan: 'Yearly plan', status: 'completed', initials: 'PV', color: '#eee6fa' },
  { id: 'TXN004', patient: 'Clinic payout', amount: 46400, type: 'debit', date: 'Feb 20, 2026', plan: 'Bank transfer', status: 'processed', initials: 'PY', color: '#e7efe0' },
  { id: 'TXN005', patient: 'Arjun Reddy', amount: 750, type: 'credit', date: 'Feb 18, 2026', plan: '1 day plan', status: 'pending', initials: 'AR', color: '#fde8e2' },
  { id: 'TXN006', patient: 'Sunita Patel', amount: 1500, type: 'credit', date: 'Feb 15, 2026', plan: '1 month plan', status: 'completed', initials: 'SP', color: '#e7efe0' },
]

const statCards = [
  { label: 'Total earned', value: 'Rs 3.31L', foot: 'Across the last 7 months', tone: '#e7efe0', accent: '#73955f' },
  { label: 'This month', value: 'Rs 58,000', foot: 'Current cycle collections', tone: '#e8f0fb', accent: '#4d82b7' },
  { label: 'Pending payout', value: 'Rs 11,600', foot: 'Waiting for settlement', tone: '#f8eccc', accent: '#c9953b' },
  { label: 'Next payout', value: 'Mar 1', foot: 'Estimated transfer date', tone: '#eee6fa', accent: '#7a61b8' },
]

const CustomTooltip = ({ active, payload }) => (
  active && payload?.length ? (
    <div className="admin-chart-tooltip">
      <div>Income: <strong>Rs {payload[0]?.value?.toLocaleString('en-IN')}</strong></div>
      <div>Payout: <strong>Rs {payload[1]?.value?.toLocaleString('en-IN')}</strong></div>
    </div>
  ) : null
)

export default function AdminPayments() {
  const [activeFilter, setActiveFilter] = useState('All')
  const session = getNutritionistSession()
  const displayName = session.username || session.name || 'Nutritionist'

  const filteredTransactions = transactions.filter((transaction) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Received') return transaction.type === 'credit' && transaction.patient !== 'Clinic payout'
    if (activeFilter === 'Payouts') return transaction.patient === 'Clinic payout'
    return transaction.status === activeFilter.toLowerCase()
  })

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Billing workspace</div>
          <h1>Payments</h1>
        </div>

        <div className="page-header-right">
          <span className="badge badge-green">Collections healthy</span>
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
              <div className="eyebrow">Revenue workspace</div>
              <h2 className="hero-heading" style={{ marginTop: '0.55rem' }}>
                Collections, payouts, and transaction history now sit in the same calmer structure as the member app.
              </h2>
              <p className="hero-copy">
                The page keeps monthly performance, payout timing, and transaction status easy to
                scan without the older card clutter. You can read the whole payment story in one pass.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">86% payout ratio</span>
                <span className="badge badge-sky">Next settlement on Mar 1</span>
                <span className="badge badge-amber">1 pending payment</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Payout posture</h3>
                  <p>What is collected, what is cleared, and what is still in motion</p>
                </div>
                <Wallet size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>Rs 46,400</strong>
                  <span>last payout processed</span>
                </div>
                <div className="mini-metric">
                  <strong>Rs 1,208</strong>
                  <span>average per session</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                Income is trending upward. The only amount needing attention today is Arjun&apos;s
                pending plan payment before the next consult cycle begins.
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

        <div className="g-2-auto">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Revenue vs payouts</h3>
                <p>Monthly billing inflow compared with settled payouts</p>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} barSize={18} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ede6" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca38f' }} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Bar dataKey="income" fill="#73955f" radius={[8, 8, 0, 0]} />
                <Bar dataKey="payout" fill="#d8ddd2" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </section>

          <div className="admin-side-stack">
            <section className="payment-card admin-payment-card">
              <div className="admin-payment-card-top">
                <div>
                  <small>Poshan earnings</small>
                  <strong>{displayName}</strong>
                </div>
                <div className="admin-card-chip" />
              </div>

              <div className="admin-payment-amount">Rs 58,000</div>

              <div className="admin-payment-meta">
                <div>
                  <small>This month</small>
                  <span>February 2026</span>
                </div>
                <div>
                  <small>Next payout</small>
                  <span>Mar 1, 2026</span>
                </div>
              </div>
            </section>

            <section className="support-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Quick finance notes</h3>
                  <p>Small details that matter before payout day</p>
                </div>
              </div>

              <div className="signal-list">
                {[
                  { icon: TrendingUp, label: 'Plan revenue', value: 'Rs 46,500' },
                  { icon: Clock3, label: 'Pending payout', value: 'Rs 11,600' },
                  { icon: CreditCard, label: 'Refunds', value: 'Rs 0' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="signal-item">
                    <div className="signal-avatar" style={{ background: 'rgba(115, 149, 95, 0.12)' }}>
                      <Icon size={16} color="#73955f" />
                    </div>
                    <div>
                      <div className="signal-title">{label}</div>
                      <div className="signal-sub">Current practice value</div>
                    </div>
                    <div className="signal-meta">{value}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <section className="support-card admin-surface-card">
          <div className="admin-toolbar">
            <div>
              <h3 style={{ marginBottom: '0.2rem' }}>Transaction history</h3>
              <p style={{ color: '#8b907f', fontSize: '0.84rem' }}>
                Filter member payments and payout movements in one place
              </p>
            </div>

            <div className="filter-tabs">
              {['All', 'Received', 'Payouts', 'Pending'].map((filter) => (
                <button
                  key={filter}
                  className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="admin-table-card">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Patient</th>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>
                      <div>
                        <div className="admin-table-title">{transaction.id}</div>
                        <div className="admin-table-sub">
                          {transaction.type === 'credit' ? 'Member payment' : 'Clinic payout'}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-table-person">
                        <div className="admin-avatar-chip" style={{ background: transaction.color }}>
                          {transaction.initials}
                        </div>
                        <div className="admin-table-title">{transaction.patient}</div>
                      </div>
                    </td>
                    <td>
                      <span className="admin-table-sub">{transaction.plan}</span>
                    </td>
                    <td>
                      <span className="admin-table-title" style={{ color: transaction.type === 'credit' ? '#2f8d58' : '#7f8776' }}>
                        {transaction.type === 'credit' ? '+' : '-'}Rs {transaction.amount.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span className="admin-table-sub">{transaction.date}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          transaction.status === 'completed'
                            ? 'badge-green'
                            : transaction.status === 'processed'
                              ? 'badge-sky'
                              : 'badge-amber'
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}
