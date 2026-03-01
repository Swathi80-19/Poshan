import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    Check, Bell, ShieldCheck, CreditCard, Smartphone,
    Building2, ChevronRight, Lock, ArrowLeft, CheckCircle2, Star, Zap, Info
} from 'lucide-react'

const plans = [
    {
        id: 'yearly',
        label: 'Yearly',
        badge: 'Best Value',
        badgeColor: '#22C55E',
        price: '₹10,000',
        priceNum: 10000,
        period: '/year',
        sub: '1 month free',
        perMonth: '₹833/mo',
        features: ['Unlimited consultations', 'Personalized meal plans', 'Priority support', '24/7 chat access', 'Progress tracking', 'Advanced reports'],
        popular: true,
        savings: 'Save ₹2,000',
    },
    {
        id: '5month',
        label: '5 Months',
        badge: 'Popular',
        badgeColor: '#3B82F6',
        price: '₹4,500',
        priceNum: 4500,
        period: '/5 months',
        sub: '7 days free',
        perMonth: '₹900/mo',
        features: ['Up to 20 consultations', 'Weekly meal plans', 'Standard support', 'Progress tracking'],
        popular: false,
        savings: 'Save ₹500',
    },
    {
        id: '1month',
        label: '1 Month',
        badge: null,
        price: '₹1,500',
        priceNum: 1500,
        period: '/month',
        sub: '1 day free',
        perMonth: '₹1,500/mo',
        features: ['4 consultations', 'Basic meal plan', 'Email support'],
        popular: false,
        savings: null,
    },
    {
        id: '1day',
        label: '1 Day',
        badge: null,
        price: '₹750',
        priceNum: 750,
        period: '/day',
        sub: 'Single appointment',
        perMonth: null,
        features: ['1 consultation', 'Basic recommendations'],
        popular: false,
        savings: null,
    },
]

const paymentMethods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
]

const banks = ['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB', 'BOB', 'Union']

function CardForm({ onPay, loading, consentBlocked }) {
    const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' })
    const fmt = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
    const fmtExp = (val) => val.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Cardholder Name</label>
                <input
                    placeholder="Krishna Kumar"
                    value={card.name}
                    onChange={e => setCard(p => ({ ...p, name: e.target.value }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
            </div>
            <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Card Number</label>
                <input
                    placeholder="1234 5678 9012 3456"
                    value={card.num}
                    onChange={e => setCard(p => ({ ...p, num: fmt(e.target.value) }))}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit', letterSpacing: '0.5px' }}
                />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Expiry Date</label>
                    <input
                        placeholder="MM/YY"
                        value={card.exp}
                        onChange={e => setCard(p => ({ ...p, exp: fmtExp(e.target.value) }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>CVV</label>
                    <input
                        placeholder="•••"
                        type="password"
                        maxLength={3}
                        value={card.cvv}
                        onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))}
                        style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                    />
                </div>
            </div>
            <button
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 4, opacity: consentBlocked ? 0.5 : 1, cursor: consentBlocked ? 'not-allowed' : 'pointer' }}
                onClick={onPay}
                disabled={loading || consentBlocked}
            >
                {loading ? '⏳ Processing...' : consentBlocked ? '🔒 Agree to data sharing first' : <><Lock size={15} /> Pay Securely</>}
            </button>
        </div>
    )
}

function UPIForm({ onPay, loading, consentBlocked }) {
    const [upi, setUpi] = useState('')
    const [activeApp, setActiveApp] = useState(null)
    const apps = [
        { id: 'gpay', label: 'GPay', color: '#4285F4', emoji: '💙' },
        { id: 'phonepe', label: 'PhonePe', color: '#6739B7', emoji: '💜' },
        { id: 'paytm', label: 'Paytm', color: '#00BAF2', emoji: '💙' },
    ]
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 10 }}>
                {apps.map(app => (
                    <button
                        key={app.id}
                        onClick={() => setActiveApp(app.id)}
                        style={{
                            flex: 1, padding: '12px 8px', borderRadius: 14, cursor: 'pointer',
                            border: activeApp === app.id ? `2px solid ${app.color}` : '1.5px solid #E5E7EB',
                            background: activeApp === app.id ? app.color + '12' : 'white',
                            fontSize: 12, fontWeight: 600, color: activeApp === app.id ? app.color : '#374151',
                            transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
                        }}
                    >
                        <span style={{ fontSize: 20 }}>{app.emoji}</span>
                        {app.label}
                    </button>
                ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 12, color: '#9CA3AF' }}>— or enter UPI ID —</div>
            <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>UPI ID</label>
                <input
                    placeholder="yourname@upi"
                    value={upi}
                    onChange={e => setUpi(e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
                />
            </div>
            <button
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: 15, opacity: consentBlocked ? 0.5 : 1, cursor: consentBlocked ? 'not-allowed' : 'pointer' }}
                onClick={onPay}
                disabled={loading || consentBlocked}
            >
                {loading ? '⏳ Sending request...' : consentBlocked ? '🔒 Agree to data sharing first' : <><Smartphone size={15} /> Pay via UPI</>}
            </button>
        </div>
    )
}

function NetBankingForm({ onPay, loading, consentBlocked }) {
    const [selectedBank, setSelectedBank] = useState(null)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 8, display: 'block' }}>Select Bank</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {banks.map(bank => (
                        <button
                            key={bank}
                            onClick={() => setSelectedBank(bank)}
                            style={{
                                padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
                                border: selectedBank === bank ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB',
                                background: selectedBank === bank ? '#E8F1E4' : 'white',
                                fontSize: 13, fontWeight: 600,
                                color: selectedBank === bank ? '#4D7A3E' : '#374151',
                                transition: 'all 0.2s', textAlign: 'left'
                            }}
                        >
                            🏦 {bank}
                        </button>
                    ))}
                </div>
            </div>
            <button
                className="btn btn-primary"
                style={{ width: '100%', padding: 14, fontSize: 15, opacity: consentBlocked ? 0.5 : 1, cursor: consentBlocked ? 'not-allowed' : 'pointer' }}
                onClick={onPay}
                disabled={loading || !selectedBank || consentBlocked}
            >
                {loading ? '⏳ Redirecting...' : consentBlocked ? '🔒 Agree to data sharing first' : <><Building2 size={15} /> Continue to {selectedBank || 'Bank'}</>}
            </button>
        </div>
    )
}

function SuccessScreen({ plan, navigate }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
            <div style={{ textAlign: 'center', maxWidth: 440 }}>
                <div style={{
                    width: 100, height: 100, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8BAF7C, #4D7A3E)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(139,175,124,0.4)'
                }}>
                    <CheckCircle2 size={48} color="white" />
                </div>
                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Payment Successful! 🎉</h2>
                <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
                    You're now on the <strong style={{ color: '#8BAF7C' }}>{plan?.label} Plan</strong>. Your wellness journey has officially begun!
                </p>
                <div style={{
                    background: '#F8FDF6', border: '1.5px solid #D4E0C8', borderRadius: 20, padding: 24, marginBottom: 28, textAlign: 'left'
                }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 12 }}>Order Summary</div>
                    {[
                        ['Plan', `${plan?.label} Plan`],
                        ['Amount', `₹${Math.round(plan?.priceNum * 1.18).toLocaleString()}`],
                        ['GST (18%)', `₹${Math.round(plan?.priceNum * 0.18).toLocaleString()}`],
                        ['Status', '✅ Paid'],
                        ['Transaction ID', '#TXN' + Math.floor(Math.random() * 9000000 + 1000000)],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E8F1E4', fontSize: 13 }}>
                            <span style={{ color: '#6B7280' }}>{k}</span>
                            <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/app/activity')}>
                        View Appointments
                    </button>
                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/app/dashboard')}>
                        Go to Dashboard
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ChoosePlanPage() {
    const navigate = useNavigate()
    const [selected, setSelected] = useState('yearly')
    const [payMethod, setPayMethod] = useState('card')
    const [loading, setLoading] = useState(false)
    const [paid, setPaid] = useState(false)
    const [step, setStep] = useState('plan') // 'plan' | 'payment'
    const [dataConsent, setDataConsent] = useState(false)

    const plan = plans.find(p => p.id === selected)
    const gst = Math.round(plan.priceNum * 0.18)
    const total = plan.priceNum + gst

    const handlePay = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setPaid(true)
        }, 2000)
    }

    if (paid) return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Congratulations!</span>
                    <span className="page-header-title">Order Confirmed</span>
                </div>
            </div>
            <div className="page-body">
                <SuccessScreen plan={plan} navigate={navigate} />
            </div>
        </div>
    )

    return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    {step === 'payment' && (
                        <button onClick={() => setStep('plan')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: 13, marginBottom: 4 }}>
                            <ArrowLeft size={14} /> Back to plans
                        </button>
                    )}
                    <span className="page-header-greeting">{step === 'plan' ? 'Invest in your health' : 'Secure Checkout'}</span>
                    <span className="page-header-title">{step === 'plan' ? 'Choose Your Plan' : 'Payment'}</span>
                </div>
                <div className="page-header-right">
                    <button className="header-icon-btn"><Bell size={18} /></button>
                    <div className="header-avatar">K</div>
                </div>
            </div>

            {/* Step indicator */}
            <div style={{ padding: '10px 32px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
                {['Choose Plan', 'Payment', 'Confirmation'].map((s, i) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                            width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 700,
                            background: (step === 'plan' && i === 0) || (step === 'payment' && i === 1) ? '#8BAF7C' : paid && i === 2 ? '#8BAF7C' : '#F3F4F6',
                            color: (step === 'plan' && i === 0) || (step === 'payment' && i === 1) ? 'white' : '#9CA3AF'
                        }}>
                            {i + 1}
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 600, color: (step === 'plan' && i === 0) || (step === 'payment' && i === 1) ? '#374151' : '#9CA3AF' }}>{s}</span>
                        {i < 2 && <div style={{ width: 28, height: 1.5, background: '#E5E7EB' }} />}
                    </div>
                ))}
            </div>

            <div className="page-body">
                {step === 'plan' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 28 }}>
                        {/* Plans */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <p style={{ fontSize: 14, color: '#6B7280', marginBottom: 4 }}>
                                Select a plan that fits your wellness journey. Cancel anytime.
                            </p>
                            {plans.map(plan => (
                                <div
                                    key={plan.id}
                                    className="plan-card"
                                    style={{
                                        border: selected === plan.id ? '2px solid #8BAF7C' : plan.popular ? '2px solid #D4E0C8' : '1.5px solid #E5E7EB',
                                        background: selected === plan.id ? '#F0F8EC' : 'white',
                                        cursor: 'pointer', position: 'relative', overflow: 'hidden'
                                    }}
                                    onClick={() => setSelected(plan.id)}
                                >
                                    {plan.savings && (
                                        <div style={{
                                            position: 'absolute', top: 0, right: 0,
                                            background: '#22C55E', color: 'white',
                                            fontSize: 10, fontWeight: 700, padding: '4px 10px',
                                            borderBottomLeftRadius: 10
                                        }}>
                                            {plan.savings}
                                        </div>
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                                            <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>{plan.label}</span>
                                            {plan.badge && (
                                                <span style={{
                                                    fontSize: 10, fontWeight: 700,
                                                    background: plan.badgeColor + '20', color: plan.badgeColor,
                                                    padding: '2px 8px', borderRadius: 20
                                                }}>
                                                    {plan.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p style={{ fontSize: 12, color: '#9CA3AF' }}>{plan.sub}</p>
                                        {selected === plan.id && (
                                            <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                                {plan.features.map(f => (
                                                    <span key={f} style={{ fontSize: 11, color: '#4D7A3E', background: '#E8F1E4', padding: '3px 8px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                        <Check size={10} strokeWidth={3} /> {f}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>{plan.price}</div>
                                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{plan.period}</div>
                                            {plan.perMonth && <div style={{ fontSize: 11, color: '#8BAF7C', fontWeight: 600 }}>{plan.perMonth}</div>}
                                        </div>
                                        <div style={{
                                            width: 24, height: 24, borderRadius: '50%',
                                            border: selected === plan.id ? 'none' : '2px solid #D1D5DB',
                                            background: selected === plan.id ? '#8BAF7C' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            {selected === plan.id && <Check size={14} color="white" strokeWidth={3} />}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center', lineHeight: 1.6, margin: '4px 0' }}>
                                Poshan protects your data with bank-grade encryption.<br />
                                <span style={{ cursor: 'pointer', color: '#8BAF7C', textDecoration: 'underline' }}>Terms & Conditions</span>
                                {' | '}
                                <span style={{ cursor: 'pointer', color: '#8BAF7C', textDecoration: 'underline' }}>Privacy Policy</span>
                            </p>
                        </div>

                        {/* Order Summary */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                        <h3 style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{plan.label} Plan</h3>
                                        {plan.badge && (
                                            <span style={{ fontSize: 10, fontWeight: 700, background: plan.badgeColor + '20', color: plan.badgeColor, padding: '2px 8px', borderRadius: 20 }}>
                                                {plan.badge}
                                            </span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: 13, color: '#9CA3AF' }}>{plan.sub}</p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                                    {plan.features.map(f => (
                                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#E8F1E4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                <Check size={12} color="#8BAF7C" strokeWidth={3} />
                                            </div>
                                            <span style={{ fontSize: 13, color: '#374151' }}>{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="divider" />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, margin: '16px 0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 14, color: '#6B7280' }}>Plan price</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{plan.price}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 14, color: '#6B7280' }}>GST (18%)</span>
                                        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>₹{gst.toLocaleString()}</span>
                                    </div>
                                    {plan.savings && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#22C55E' }}>
                                            <span style={{ fontSize: 14 }}>Savings</span>
                                            <span style={{ fontSize: 14, fontWeight: 600 }}>{plan.savings}</span>
                                        </div>
                                    )}
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '2px solid #F3F4F6' }}>
                                    <span style={{ fontSize: 16, fontWeight: 700, color: '#111827' }}>Total</span>
                                    <span style={{ fontSize: 22, fontWeight: 800, color: '#8BAF7C' }}>₹{total.toLocaleString()}</span>
                                </div>

                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', padding: 14, fontSize: 15, marginTop: 6 }}
                                    onClick={() => setStep('payment')}
                                >
                                    Continue to Payment <ChevronRight size={16} />
                                </button>

                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, justifyContent: 'center' }}>
                                    <ShieldCheck size={14} color="#9CA3AF" />
                                    <span style={{ fontSize: 11, color: '#9CA3AF' }}>256-bit SSL secured · Cancel anytime</span>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                                {['🔒 Secure', '⚡ Instant', '🔄 Cancel anytime'].map(b => (
                                    <div key={b} style={{ fontSize: 11, color: '#6B7280', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 20, padding: '4px 10px' }}>{b}</div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* === PAYMENT STEP === */
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 28 }}>
                        {/* Payment form */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                            {/* Method selector */}
                            <div className="card" style={{ padding: 20 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Payment Method</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                                        <button
                                            key={id}
                                            onClick={() => setPayMethod(id)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 14,
                                                padding: '14px 16px', borderRadius: 14, cursor: 'pointer',
                                                border: payMethod === id ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB',
                                                background: payMethod === id ? '#F0F8EC' : 'white',
                                                transition: 'all 0.2s', textAlign: 'left'
                                            }}
                                        >
                                            <div style={{
                                                width: 40, height: 40, borderRadius: 12,
                                                background: payMethod === id ? '#D4E8CB' : '#F3F4F6',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                <Icon size={18} color={payMethod === id ? '#4D7A3E' : '#6B7280'} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</div>
                                                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{desc}</div>
                                            </div>
                                            <div style={{
                                                width: 20, height: 20, borderRadius: '50%',
                                                border: payMethod === id ? 'none' : '2px solid #D1D5DB',
                                                background: payMethod === id ? '#8BAF7C' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                            }}>
                                                {payMethod === id && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Method-specific form */}
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 18 }}>
                                    {payMethod === 'card' ? '💳 Card Details' : payMethod === 'upi' ? '📱 UPI Payment' : '🏦 Net Banking'}
                                </div>
                                {payMethod === 'card' && <CardForm onPay={handlePay} loading={loading} consentBlocked={!dataConsent} />}
                                {payMethod === 'upi' && <UPIForm onPay={handlePay} loading={loading} consentBlocked={!dataConsent} />}
                                {payMethod === 'netbanking' && <NetBankingForm onPay={handlePay} loading={loading} consentBlocked={!dataConsent} />}
                            </div>

                            {/* Data Sharing Consent */}
                            <div style={{
                                padding: '16px 18px',
                                background: dataConsent ? '#F0FDF4' : '#FFFBEB',
                                border: `1.5px solid ${dataConsent ? '#86EFAC' : '#FDE68A'}`,
                                borderRadius: 16,
                                transition: 'all 0.3s'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                    <div
                                        onClick={() => setDataConsent(v => !v)}
                                        style={{
                                            width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                                            background: dataConsent ? '#22C55E' : 'white',
                                            border: `2px solid ${dataConsent ? '#22C55E' : '#D1D5DB'}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', transition: 'all 0.2s'
                                        }}>
                                        {dataConsent && <Check size={12} color="white" strokeWidth={3} />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 4 }}>📋 Data Sharing Acknowledgement</div>
                                        <div style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.6 }}>
                                            I acknowledge that by proceeding with this payment, my last{' '}
                                            <strong style={{ color: '#D97706' }}>3 days of health data</strong>{' '}
                                            (meals, activity, vitals, water intake) will be securely shared with my assigned nutritionist
                                            to help personalize my nutrition plan and consultations.
                                        </div>
                                        {!dataConsent && (
                                            <div style={{ fontSize: 11, color: '#D97706', marginTop: 6, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Info size={11} /> Please check this box to proceed with payment
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order review sidebar */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div className="card" style={{ padding: 24 }}>
                                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>Order Review</div>
                                <div style={{
                                    background: '#F8FDF6', border: '1px solid #D4E0C8', borderRadius: 14, padding: 16, marginBottom: 16
                                }}>
                                    <div style={{ fontSize: 16, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{plan.label} Plan</div>
                                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 10 }}>{plan.sub}</div>
                                    {plan.features.slice(0, 3).map(f => (
                                        <div key={f} style={{ fontSize: 12, color: '#374151', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                                            <Check size={11} color="#8BAF7C" strokeWidth={3} /> {f}
                                        </div>
                                    ))}
                                    {plan.features.length > 3 && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4 }}>+{plan.features.length - 3} more features</div>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {[['Subtotal', `${plan.price}`], ['GST (18%)', `₹${gst.toLocaleString()}`]].map(([k, v]) => (
                                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                            <span style={{ color: '#6B7280' }}>{k}</span>
                                            <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                                        </div>
                                    ))}
                                    {plan.savings && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                            <span style={{ color: '#22C55E' }}>Savings</span>
                                            <span style={{ fontWeight: 600, color: '#22C55E' }}>{plan.savings}</span>
                                        </div>
                                    )}
                                    <div style={{ height: 1, background: '#F3F4F6' }} />
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Total</span>
                                        <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>₹{total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Guarantees */}
                            <div className="card" style={{ padding: 20 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>Our Guarantees</div>
                                {[
                                    ['🔒', '256-bit SSL Encryption', 'Bank-grade security'],
                                    ['💰', 'Money-back Guarantee', '7-day refund policy'],
                                    ['🔄', 'Cancel Anytime', 'No questions asked'],
                                    ['📞', '24/7 Support', 'Always here to help'],
                                ].map(([icon, title, sub]) => (
                                    <div key={title} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                                        <span style={{ fontSize: 18 }}>{icon}</span>
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{title}</div>
                                            <div style={{ fontSize: 11, color: '#9CA3AF' }}>{sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
