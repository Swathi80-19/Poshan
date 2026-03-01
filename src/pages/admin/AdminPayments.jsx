import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, TrendingUp, Download, CreditCard, ArrowUpRight, ArrowDownLeft, DollarSign, Clock } from 'lucide-react'
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts'

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
    { id: 'TXN001', patient: 'Rekha Sharma', amount: 1500, type: 'credit', date: 'Feb 27, 2026', plan: '1 Month Plan', status: 'completed', initials: 'RS', color: '#FEF9C3' },
    { id: 'TXN002', patient: 'Krishna Murthy', amount: 4500, type: 'credit', date: 'Feb 25, 2026', plan: '5 Month Plan', status: 'completed', initials: 'KM', color: '#DBEAFE' },
    { id: 'TXN003', patient: 'Priya Verma', amount: 10000, type: 'credit', date: 'Feb 22, 2026', plan: 'Yearly Plan', status: 'completed', initials: 'PV', color: '#EDE9FE' },
    { id: 'TXN004', patient: 'Payout', amount: 46400, type: 'debit', date: 'Feb 20, 2026', plan: 'Bank Transfer', status: 'processed', initials: '🏦', color: '#ECFDF5' },
    { id: 'TXN005', patient: 'Arjun Reddy', amount: 750, type: 'credit', date: 'Feb 18, 2026', plan: '1 Day Plan', status: 'pending', initials: 'AR', color: '#FEE2E2' },
    { id: 'TXN006', patient: 'Sunita Patel', amount: 1500, type: 'credit', date: 'Feb 15, 2026', plan: '1 Month Plan', status: 'completed', initials: 'SP', color: '#ECFDF5' },
]

const CustomTooltip = ({ active, payload }) =>
    active && payload?.length ? (
        <div style={{ background: '#0D1B0A', padding: '10px 14px', borderRadius: 12, fontSize: 12, border: '1px solid rgba(127,168,112,0.2)' }}>
            <div style={{ color: '#9BBF8A' }}>Income: <span style={{ color: 'white', fontWeight: 700 }}>₹{payload[0]?.value?.toLocaleString()}</span></div>
            <div style={{ color: '#9CA3AF' }}>Payout: <span style={{ color: 'white', fontWeight: 700 }}>₹{payload[1]?.value?.toLocaleString()}</span></div>
        </div>
    ) : null

export default function AdminPayments() {
    const [activeFilter, setActiveFilter] = useState('All')

    const filtered = transactions.filter(t =>
        activeFilter === 'All' ? true :
            activeFilter === 'Received' ? t.type === 'credit' && t.patient !== 'Payout' :
                activeFilter === 'Payouts' ? t.patient === 'Payout' :
                    t.status === activeFilter.toLowerCase()
    )

    return (
        <div className="anim-fade">
            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Track your earnings</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A' }}>Payments</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="icon-btn"><Bell size={17} /></button>
                    <button style={{
                        padding: '9px 18px', borderRadius: 50,
                        background: '#F4FAF1', color: '#4D7A3E',
                        border: '1.5px solid #C8E8BA', cursor: 'pointer',
                        fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6,
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                    }}>
                        <Download size={14} /> Export Report
                    </button>
                </div>
            </div>

            <div className="page-body">
                {/* Payment summary cards */}
                <div className="grid-4" style={{ marginBottom: 24 }}>
                    {[
                        { label: 'Total Earned', val: '₹3.31L', sub: 'Last 7 months', icon: DollarSign, bg: '#E8F5E2', ic: '#4D7A3E', up: true },
                        { label: 'This Month', val: '₹58,000', sub: 'Feb 2026', icon: TrendingUp, bg: '#DBEAFE', ic: '#1D4ED8', up: true },
                        { label: 'Pending Payout', val: '₹11,600', sub: 'Processing', icon: Clock, bg: '#FEF9C3', ic: '#92400E', up: false },
                        { label: 'Next Payout', val: 'Mar 1', sub: 'Estimated', icon: CreditCard, bg: '#EDE9FE', ic: '#5B21B6', up: true },
                    ].map(({ label, val, sub, icon: Icon, bg, ic, up }) => (
                        <div key={label} className="stat-widget">
                            <div className="stat-widget-icon" style={{ background: bg }}>
                                <Icon size={20} color={ic} />
                            </div>
                            <div className="stat-widget-value" style={{ fontSize: 22 }}>{val}</div>
                            <div className="stat-widget-label">{label}</div>
                            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>{sub}</div>
                        </div>
                    ))}
                </div>

                {/* Virtual payment card + chart */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, marginBottom: 24 }}>
                    {/* Revenue chart */}
                    <div className="card" style={{ padding: 26 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
                            <div className="section-title">Revenue vs Payouts</div>
                            <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                                {[['#7FA870', 'Income'], ['#D1D5DB', 'Payout']].map(([c, l]) => (
                                    <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280' }}>
                                        <div style={{ width: 10, height: 10, borderRadius: 3, background: c }} />
                                        {l}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={monthlyData} barSize={18} barGap={4}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis hide />
                                <Tooltip content={<CustomTooltip />} cursor={false} />
                                <Bar dataKey="income" fill="#7FA870" radius={[6, 6, 0, 0]} />
                                <Bar dataKey="payout" fill="#E5E7EB" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Virtual payment card */}
                    <div>
                        <div className="payment-card" style={{ marginBottom: 16 }}>
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                                    <div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 500, letterSpacing: '0.5px' }}>POSHAN EARNINGS</div>
                                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>Dr. Bipasha</div>
                                    </div>
                                    <div style={{ width: 40, height: 28, borderRadius: 6, background: 'rgba(127,168,112,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#7FA870', opacity: 0.8 }} />
                                    </div>
                                </div>
                                <div style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: 16 }}>
                                    ₹58,000
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>THIS MONTH</div>
                                        <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>February 2026</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>NEXT PAYOUT</div>
                                        <div style={{ fontSize: 13, color: '#9BBF8A', fontWeight: 600 }}>Mar 1, 2026</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick stats */}
                        <div className="card" style={{ padding: 16 }}>
                            {[
                                { label: 'Avg. per Session', val: '₹1,208', icon: '📊' },
                                { label: 'Plan Revenue', val: '₹46,500', icon: '💳' },
                                { label: 'Refunds', val: '₹0', icon: '↩️' },
                            ].map(({ label, val, icon }) => (
                                <div key={label} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '9px 0', borderBottom: '1px solid #F9FAFB'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#6B7280' }}>
                                        <span>{icon}</span>{label}
                                    </div>
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{val}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Transactions */}
                <div className="card" style={{ overflow: 'hidden' }}>
                    <div style={{ padding: '18px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div className="section-title">Transaction History</div>
                        <div className="filter-tabs">
                            {['All', 'Received', 'Payouts', 'Pending'].map(f => (
                                <button key={f} className={`filter-tab btn-sm ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                            ))}
                        </div>
                    </div>
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
                            {filtered.map(t => (
                                <tr key={t.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: 10,
                                                background: t.type === 'credit' ? '#E8F5E2' : '#FFF7ED',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {t.type === 'credit'
                                                    ? <ArrowDownLeft size={14} color="#4D7A3E" />
                                                    : <ArrowUpRight size={14} color="#9A3412" />
                                                }
                                            </div>
                                            <span style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500 }}>{t.id}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{
                                                width: 30, height: 30, borderRadius: 8,
                                                background: t.color, display: 'flex', alignItems: 'center',
                                                justifyContent: 'center', fontSize: t.id === 'TXN004' ? 14 : 11,
                                                fontWeight: 700, color: '#374151'
                                            }}>{t.initials}</div>
                                            <span style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>{t.patient}</span>
                                        </div>
                                    </td>
                                    <td><span style={{ fontSize: 12, color: '#9CA3AF' }}>{t.plan}</span></td>
                                    <td>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: t.type === 'credit' ? '#4D7A3E' : '#374151' }}>
                                            {t.type === 'credit' ? '+' : '-'}₹{t.amount.toLocaleString()}
                                        </span>
                                    </td>
                                    <td><span style={{ fontSize: 13, color: '#9CA3AF' }}>{t.date}</span></td>
                                    <td>
                                        <span className={`badge ${t.status === 'completed' ? 'badge-green' : t.status === 'processed' ? 'badge-sky' : 'badge-amber'}`}>
                                            {t.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
