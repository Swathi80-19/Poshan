import { useEffect, useMemo, useState } from 'react'
import { Bell, CreditCard, Download, Wallet } from 'lucide-react'
import { getNutritionistPayments } from '../../lib/memberApi'
import { getNutritionistSession } from '../../lib/session'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatDate(value) {
  if (!value) return 'Pending'

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default function AdminPayments() {
  const session = getNutritionistSession()
  const displayName = session.username || session.name || 'Nutritionist'
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    if (!session.accessToken) {
      setLoading(false)
      setError('Sign in as a nutritionist to view your payments.')
      return undefined
    }

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const response = await getNutritionistPayments(session.accessToken)

        if (!cancelled) {
          setPayments(Array.isArray(response) ? response : [])
        }
      } catch (requestError) {
        if (!cancelled) {
          setPayments([])
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

  const totalCollected = payments.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
  const totalBaseAmount = payments.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  const recentSessions = useMemo(
    () => [...payments].sort((left, right) => new Date(right.paidAt) - new Date(left.paidAt)).slice(0, 5),
    [payments],
  )

  const statCards = [
    { label: 'Billing records', value: payments.length, foot: 'Real member payments linked to this account', tone: '#e7efe0', accent: '#73955f' },
    { label: 'Total collected', value: formatCurrency(totalCollected), foot: 'Gross value including total paid', tone: '#e8f0fb', accent: '#4d82b7' },
    { label: 'Base plan value', value: formatCurrency(totalBaseAmount), foot: 'Pre-tax plan amount across payments', tone: '#f8eccc', accent: '#c9953b' },
    { label: 'Latest payer', value: recentSessions[0]?.memberName || 'None yet', foot: 'Most recent payment record', tone: '#eee6fa', accent: '#7a61b8' },
  ]

  return (
    <div className="animate-fade">
      <div className="admin-page-header">
        <div>
          <div className="page-header-greeting">Payments</div>
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
                Review payment activity connected to your members.
              </h2>
              <p className="hero-copy">
                Track payments, recent buyers, and plan activity in one clear view.
              </p>

              <div className="pill-row">
                <span className="badge badge-green">{payments.length} payment records</span>
                <span className="badge badge-amber">{formatCurrency(totalCollected)} collected</span>
                <span className="badge badge-sky">{recentSessions[0] ? `Latest: ${recentSessions[0].memberName}` : 'No payments yet'}</span>
              </div>
            </div>

            <div className="focus-card">
              <div className="dashboard-panel-heading">
                <div>
                  <h3>Billing status</h3>
                  <p>Payment totals and recent activity appear here for quick review.</p>
                </div>
                <Wallet size={18} color="#73955f" />
              </div>

              <div className="mini-metric-grid">
                <div className="mini-metric">
                  <strong>{displayName}</strong>
                  <span>nutritionist account</span>
                </div>
                <div className="mini-metric">
                  <strong>{payments.length}</strong>
                  <span>payment entries</span>
                </div>
              </div>

              <div className="admin-note" style={{ marginTop: '1rem' }}>
                {payments.length
                  ? 'Your latest payment totals are ready to review here.'
                  : 'No payment records are connected to this nutritionist yet.'}
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

        {loading ? <div className="admin-note">Loading payments...</div> : null}
        {error ? <div className="admin-note">{error}</div> : null}

        <div className="g-2-auto">
          <section className="support-card admin-surface-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Recent payments</h3>
                <p>The latest member payments linked to your account.</p>
              </div>
              <Wallet size={18} color="#73955f" />
            </div>

            {!loading && !error && !recentSessions.length ? (
              <div className="admin-note">Payments will appear here once members complete a plan purchase linked to your practice.</div>
            ) : null}

            {!!recentSessions.length && (
              <div className="signal-list">
                {recentSessions.map((payment) => (
                  <div key={payment.id} className="signal-item">
                    <div className="signal-avatar" style={{ background: '#e7efe0' }}>
                      {payment.memberName?.charAt(0)?.toUpperCase() || 'M'}
                    </div>
                    <div>
                      <div className="signal-title">{payment.memberName}</div>
                      <div className="signal-sub">{payment.planLabel || 'Plan'} | {formatDate(payment.paidAt)}</div>
                    </div>
                    <div className="signal-meta">{formatCurrency(payment.total)}</div>
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
                  <p>Transaction-level detail for each recorded payment.</p>
                </div>
              </div>

              {!payments.length ? (
                <div className="admin-note">
                  No transaction history is available yet.
                </div>
              ) : (
                <div className="signal-list">
                  {payments.slice(0, 6).map((payment) => (
                    <div key={payment.id} className="signal-item">
                      <div className="signal-avatar" style={{ background: 'rgba(115, 149, 95, 0.12)' }}>
                        <CreditCard size={16} color="#73955f" />
                      </div>
                      <div>
                        <div className="signal-title">{payment.memberName}</div>
                        <div className="signal-sub">{payment.transactionId}</div>
                      </div>
                      <div className="signal-meta">{formatCurrency(payment.total)}</div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
