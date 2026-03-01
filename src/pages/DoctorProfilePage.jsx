import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
    ArrowLeft, Heart, Share2, Star, Clock, Award,
    MessageCircle, Calendar, Check, Lock, ShieldCheck,
    CreditCard, Smartphone, Building2, ChevronRight, CheckCircle2
} from 'lucide-react'

const doctorData = {
    name: 'Dr. Bipasha',
    specialty: 'M.Sc in Nutrition & Dietetics',
    rating: 4.9,
    reviews: 99,
    exp: '12 years',
    fee: 799,
    initials: 'B',
    color: 'linear-gradient(135deg, #C8DAB8 0%, #8BAF7C 100%)',
    online: true,
    about: 'Bipasha Mukherjee is a certified nutritionist known for promoting balanced and sustainable eating habits. She specializes in clinical nutrition, weight management, and sports dietetics with over 12 years of hands-on experience helping patients achieve sustainable health transformations.',
    specializations: ['Weight Management', 'Sports Nutrition', 'Diabetes Diet', 'Gut Health', 'Pediatric Nutrition', 'PCOS Management'],
}

const timeSlots = [
    { id: 1, time: '9:00 AM', available: true },
    { id: 2, time: '9:30 AM', available: false },
    { id: 3, time: '10:00 AM', available: true },
    { id: 4, time: '10:30 AM', available: true },
    { id: 5, time: '11:00 AM', available: false },
    { id: 6, time: '11:30 AM', available: true },
    { id: 7, time: '12:00 PM', available: false },
    { id: 8, time: '2:00 PM', available: true },
    { id: 9, time: '2:30 PM', available: true },
    { id: 10, time: '3:00 PM', available: false },
    { id: 11, time: '3:30 PM', available: true },
    { id: 12, time: '4:00 PM', available: true },
]

const reviews = [
    { name: 'Ramesh K.', text: 'Amazing guidance on diet planning. Lost 8kg in 3 months following her plan!', rating: 5, date: '2 days ago' },
    { name: 'Priya M.', text: 'Very knowledgeable and patient. Explained everything clearly. Highly recommend.', rating: 5, date: '1 week ago' },
    { name: 'John D.', text: 'Great experience. The meal plans she provided were practical and easy to follow.', rating: 4, date: '2 weeks ago' },
]

const upcomingDates = [
    { label: 'Today', date: 'Feb 28' },
    { label: 'Tomorrow', date: 'Mar 1' },
    { label: 'Sat', date: 'Mar 2' },
    { label: 'Mon', date: 'Mar 4' },
    { label: 'Tue', date: 'Mar 5' },
]

const paymentMethods = [
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' },
]

function CardForm({ onPay, loading }) {
    const [card, setCard] = useState({ num: '', exp: '', cvv: '', name: '' })
    const fmt = v => v.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)
    const fmtExp = v => v.replace(/\D/g, '').replace(/^(\d{2})(\d)/, '$1/$2').slice(0, 5)
    const inp = { width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input style={inp} placeholder="Cardholder Name" value={card.name} onChange={e => setCard(p => ({ ...p, name: e.target.value }))} />
            <input style={{ ...inp, letterSpacing: '0.5px' }} placeholder="1234 5678 9012 3456" value={card.num} onChange={e => setCard(p => ({ ...p, num: fmt(e.target.value) }))} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input style={inp} placeholder="MM/YY" value={card.exp} onChange={e => setCard(p => ({ ...p, exp: fmtExp(e.target.value) }))} />
                <input style={inp} placeholder="CVV" type="password" maxLength={3} value={card.cvv} onChange={e => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g, '') }))} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14, marginTop: 4 }} onClick={onPay} disabled={loading}>
                {loading ? '⏳ Processing...' : <><Lock size={14} /> Pay ₹{Math.round(doctorData.fee * 1.18).toLocaleString()}</>}
            </button>
        </div>
    )
}

function UPIForm({ onPay, loading }) {
    const [upi, setUpi] = useState('')
    const [activeApp, setActiveApp] = useState(null)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 8 }}>
                {[{ id: 'gpay', l: 'GPay', e: '💙', c: '#4285F4' }, { id: 'phonepe', l: 'PhonePe', e: '💜', c: '#6739B7' }, { id: 'paytm', l: 'Paytm', e: '🔵', c: '#00BAF2' }].map(a => (
                    <button key={a.id} onClick={() => setActiveApp(a.id)} style={{ flex: 1, padding: '10px 4px', borderRadius: 12, cursor: 'pointer', border: activeApp === a.id ? `2px solid ${a.c}` : '1.5px solid #E5E7EB', background: activeApp === a.id ? a.c + '12' : 'white', fontSize: 11, fontWeight: 700, color: activeApp === a.id ? a.c : '#374151', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                        <span style={{ fontSize: 18 }}>{a.e}</span>{a.l}
                    </button>
                ))}
            </div>
            <div style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>— or enter UPI ID —</div>
            <input placeholder="yourname@upi" value={upi} onChange={e => setUpi(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: 12, border: '1.5px solid #E5E7EB', fontSize: 13, outline: 'none', fontFamily: 'inherit' }} />
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14 }} onClick={onPay} disabled={loading}>
                {loading ? '⏳ Sending request...' : <><Smartphone size={14} /> Pay via UPI</>}
            </button>
        </div>
    )
}

function NetBankingForm({ onPay, loading }) {
    const [sel, setSel] = useState(null)
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {['SBI', 'HDFC', 'ICICI', 'Axis', 'Kotak', 'PNB'].map(b => (
                    <button key={b} onClick={() => setSel(b)} style={{ padding: '9px 12px', borderRadius: 10, cursor: 'pointer', border: sel === b ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB', background: sel === b ? '#E8F1E4' : 'white', fontSize: 12, fontWeight: 600, color: sel === b ? '#4D7A3E' : '#374151', textAlign: 'left' }}>🏦 {b}</button>
                ))}
            </div>
            <button className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: 14 }} onClick={onPay} disabled={loading || !sel}>
                {loading ? '⏳ Redirecting...' : <><Building2 size={14} /> Continue to {sel || 'Bank'}</>}
            </button>
        </div>
    )
}

export default function DoctorProfilePage() {
    const navigate = useNavigate()
    const [liked, setLiked] = useState(false)
    const [step, setStep] = useState('profile') // 'profile' | 'booking' | 'payment' | 'success'
    const [selectedDate, setSelectedDate] = useState(0)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [payMethod, setPayMethod] = useState('upi')
    const [loading, setLoading] = useState(false)

    const gst = Math.round(doctorData.fee * 0.18)
    const total = doctorData.fee + gst

    const handlePay = () => {
        setLoading(true)
        setTimeout(() => { setLoading(false); setStep('success') }, 2000)
    }

    if (step === 'success') return (
        <div className="animate-fade">
            <div className="page-header">
                <div className="page-header-left">
                    <span className="page-header-greeting">Booking Confirmed!</span>
                    <span className="page-header-title">Appointment Booked</span>
                </div>
            </div>
            <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
                <div style={{ textAlign: 'center', maxWidth: 440 }}>
                    <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #8BAF7C, #4D7A3E)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(139,175,124,0.4)' }}>
                        <CheckCircle2 size={48} color="white" />
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Appointment Booked! 🎉</h2>
                    <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
                        Your session with <strong style={{ color: '#8BAF7C' }}>{doctorData.name}</strong> is confirmed for <strong>{upcomingDates[selectedDate].date}</strong> at <strong>{timeSlots.find(s => s.id === selectedSlot)?.time || '10:00 AM'}</strong>.
                    </p>
                    <div style={{ background: '#F8FDF6', border: '1.5px solid #D4E0C8', borderRadius: 18, padding: 22, marginBottom: 24, textAlign: 'left' }}>
                        {[['Doctor', doctorData.name], ['Date', `${upcomingDates[selectedDate].date}, ${timeSlots.find(s => s.id === selectedSlot)?.time}`], ['Consultation Fee', `₹${doctorData.fee}`], ['GST (18%)', `₹${gst}`], ['Total Paid', `₹${total.toLocaleString()}`], ['Status', '✅ Confirmed'], ['Txn ID', '#TXN' + Math.floor(Math.random() * 9000000 + 1000000)]].map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #E8F1E4', fontSize: 13 }}>
                                <span style={{ color: '#6B7280' }}>{k}</span>
                                <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12 }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/app/messages')}>💬 Message Doctor</button>
                        <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/app/activity')}>View Activity</button>
                    </div>
                </div>
            </div>
        </div>
    )

    if (step === 'booking') return (
        <div className="animate-fade">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="header-icon-btn" onClick={() => setStep('profile')}><ArrowLeft size={18} /></button>
                    <div>
                        <div className="page-header-greeting">Book Appointment</div>
                        <div className="page-header-title">{doctorData.name}</div>
                    </div>
                </div>
                <div className="page-header-right">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {['Choose Slot', 'Payment', 'Confirm'].map((s, i) => (
                            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{ width: 24, height: 24, borderRadius: '50%', background: (step === 'booking' && i === 0) || (step === 'payment' && i === 1) ? '#8BAF7C' : '#F3F4F6', color: (step === 'booking' && i === 0) || (step === 'payment' && i === 1) ? 'white' : '#9CA3AF', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</div>
                                <span style={{ fontSize: 11, fontWeight: 600, color: '#6B7280' }}>{s}</span>
                                {i < 2 && <div style={{ width: 20, height: 1.5, background: '#E5E7EB' }} />}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 }}>
                    {/* Slot picker */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="card" style={{ padding: 24 }}>
                            <div className="section-title" style={{ marginBottom: 16 }}>Select Date</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {upcomingDates.map((d, i) => (
                                    <button key={i} onClick={() => setSelectedDate(i)} style={{ flex: 1, padding: '12px 8px', borderRadius: 14, cursor: 'pointer', border: selectedDate === i ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB', background: selectedDate === i ? '#E8F1E4' : 'white', fontFamily: 'inherit', transition: 'all 0.2s' }}>
                                        <div style={{ fontSize: 11, color: selectedDate === i ? '#4D7A3E' : '#9CA3AF', fontWeight: 600, marginBottom: 4 }}>{d.label}</div>
                                        <div style={{ fontSize: 15, fontWeight: 800, color: selectedDate === i ? '#4D7A3E' : '#111827' }}>{d.date.split(' ')[1]}</div>
                                        <div style={{ fontSize: 10, color: selectedDate === i ? '#8BAF7C' : '#9CA3AF' }}>{d.date.split(' ')[0]}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: 24 }}>
                            <div className="section-title" style={{ marginBottom: 16 }}>Available Time Slots</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                                {timeSlots.map(slot => (
                                    <button key={slot.id} onClick={() => slot.available && setSelectedSlot(slot.id)} style={{
                                        padding: '10px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600, cursor: slot.available ? 'pointer' : 'not-allowed',
                                        border: selectedSlot === slot.id ? '2px solid #8BAF7C' : !slot.available ? '1.5px dashed #E5E7EB' : '1.5px solid #E5E7EB',
                                        background: selectedSlot === slot.id ? '#8BAF7C' : !slot.available ? '#FAFAFA' : 'white',
                                        color: selectedSlot === slot.id ? 'white' : !slot.available ? '#D1D5DB' : '#374151',
                                        fontFamily: 'inherit', transition: 'all 0.2s',
                                        textDecoration: !slot.available ? 'line-through' : 'none'
                                    }}>
                                        {slot.time}
                                    </button>
                                ))}
                            </div>
                            <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: '#6B7280' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#8BAF7C' }} />Selected</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: 'white', border: '1px solid #E5E7EB' }} />Available</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}><div style={{ width: 10, height: 10, borderRadius: 2, background: '#FAFAFA', border: '1px dashed #E5E7EB' }} />Booked</span>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 24 }}>
                            <div className="section-title" style={{ marginBottom: 10 }}>Appointment Type</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                {[{ id: 'video', l: '📹 Video Call', desc: 'Online consultation' }, { id: 'chat', l: '💬 Chat Session', desc: 'Text-based session' }].map(t => (
                                    <div key={t.id} style={{ flex: 1, padding: '14px 16px', borderRadius: 14, border: t.id === 'video' ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB', background: t.id === 'video' ? '#E8F1E4' : 'white', cursor: 'pointer' }}>
                                        <div style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{t.l}</div>
                                        <div style={{ fontSize: 11, color: '#6B7280' }}>{t.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Summary sidebar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="card" style={{ padding: 22 }}>
                            <div className="section-title" style={{ marginBottom: 14 }}>Booking Summary</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: 14, background: '#F9FAFB', borderRadius: 14 }}>
                                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #C8DAB8, #8BAF7C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>B</div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{doctorData.name}</div>
                                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{doctorData.specialty}</div>
                                    <div style={{ fontSize: 11, color: '#8BAF7C', fontWeight: 600, marginTop: 2 }}>⭐ {doctorData.rating} · {doctorData.exp} exp</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                                {[
                                    ['Date', selectedDate !== null ? `${upcomingDates[selectedDate].date}` : '—'],
                                    ['Time', selectedSlot ? timeSlots.find(s => s.id === selectedSlot)?.time : '—'],
                                    ['Mode', '📹 Video Consultation'],
                                    ['Duration', '45 minutes'],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                                        <span style={{ color: '#6B7280' }}>{k}</span>
                                        <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: 1, background: '#F3F4F6', margin: '8px 0' }} />
                            {[['Consultation Fee', `₹${doctorData.fee}`], ['GST (18%)', `₹${gst}`]].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8 }}>
                                    <span style={{ color: '#6B7280' }}>{k}</span>
                                    <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '2px solid #F3F4F6', marginTop: 8 }}>
                                <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Total</span>
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>₹{total.toLocaleString()}</span>
                            </div>
                            <button
                                className="btn btn-primary"
                                style={{ width: '100%', padding: '13px 0', fontSize: 14, marginTop: 16 }}
                                onClick={() => setStep('payment')}
                                disabled={!selectedSlot}
                            >
                                Continue to Payment <ChevronRight size={15} />
                            </button>
                            {!selectedSlot && <div style={{ textAlign: 'center', fontSize: 11, color: '#9CA3AF', marginTop: 8 }}>Please select a time slot to continue</div>}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                                <ShieldCheck size={13} color="#9CA3AF" />
                                <span style={{ fontSize: 11, color: '#9CA3AF' }}>256-bit SSL · Cancel 24h before</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    if (step === 'payment') return (
        <div className="animate-fade">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="header-icon-btn" onClick={() => setStep('booking')}><ArrowLeft size={18} /></button>
                    <div>
                        <div className="page-header-greeting">Secure Checkout</div>
                        <div className="page-header-title">Payment</div>
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 28 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {/* Method selector */}
                        <div className="card" style={{ padding: 22 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Select Payment Method</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                {paymentMethods.map(({ id, label, icon: Icon, desc }) => (
                                    <button key={id} onClick={() => setPayMethod(id)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 14, cursor: 'pointer', border: payMethod === id ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB', background: payMethod === id ? '#F0F8EC' : 'white', transition: 'all 0.2s', textAlign: 'left' }}>
                                        <div style={{ width: 40, height: 40, borderRadius: 12, background: payMethod === id ? '#D4E8CB' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <Icon size={17} color={payMethod === id ? '#4D7A3E' : '#6B7280'} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</div>
                                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{desc}</div>
                                        </div>
                                        <div style={{ width: 18, height: 18, borderRadius: '50%', border: payMethod === id ? 'none' : '2px solid #D1D5DB', background: payMethod === id ? '#8BAF7C' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            {payMethod === id && <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'white' }} />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="card" style={{ padding: 22 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
                                {payMethod === 'card' ? '💳 Card Details' : payMethod === 'upi' ? '📱 UPI Payment' : '🏦 Net Banking'}
                            </div>
                            {payMethod === 'card' && <CardForm onPay={handlePay} loading={loading} />}
                            {payMethod === 'upi' && <UPIForm onPay={handlePay} loading={loading} />}
                            {payMethod === 'netbanking' && <NetBankingForm onPay={handlePay} loading={loading} />}
                        </div>
                    </div>

                    {/* Order review */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <div className="card" style={{ padding: 22 }}>
                            <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Booking Review</div>
                            <div style={{ background: '#F0F8EC', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #C8DAB8, #8BAF7C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>B</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{doctorData.name}</div>
                                        <div style={{ fontSize: 11, color: '#9CA3AF' }}>{doctorData.specialty}</div>
                                    </div>
                                </div>
                                {[
                                    ['📅', `${upcomingDates[selectedDate]?.date}`],
                                    ['🕐', timeSlots.find(s => s.id === selectedSlot)?.time || '—'],
                                    ['📹', 'Video Consultation (45 min)'],
                                ].map(([icon, val]) => (
                                    <div key={val} style={{ fontSize: 12, color: '#374151', marginBottom: 5 }}>{icon} {val}</div>
                                ))}
                            </div>
                            {[['Consultation Fee', `₹${doctorData.fee}`], ['GST (18%)', `₹${gst}`]].map(([k, v]) => (
                                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                                    <span style={{ color: '#6B7280' }}>{k}</span>
                                    <span style={{ fontWeight: 600, color: '#111827' }}>{v}</span>
                                </div>
                            ))}
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '2px solid #F3F4F6' }}>
                                <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                                <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>₹{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="card" style={{ padding: 18 }}>
                            {[['🔒', '256-bit SSL Encryption'], ['💰', '24h Cancellation Refund'], ['🔄', 'Free Rescheduling'], ['📞', '24/7 Support']].map(([i, t]) => (
                                <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'center' }}>
                                    <span style={{ fontSize: 16 }}>{i}</span>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

    // === PROFILE VIEW ===
    return (
        <div className="animate-fade">
            <div className="page-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button className="header-icon-btn" onClick={() => navigate('/app/search')}><ArrowLeft size={18} /></button>
                    <div>
                        <div className="page-header-greeting">Expert Profile</div>
                        <div className="page-header-title">{doctorData.name}</div>
                    </div>
                </div>
                <div className="page-header-right">
                    <button className="header-icon-btn" onClick={() => setLiked(l => !l)}>
                        <Heart size={18} fill={liked ? '#EF4444' : 'none'} color={liked ? '#EF4444' : undefined} />
                    </button>
                    <button className="header-icon-btn"><Share2 size={18} /></button>
                </div>
            </div>

            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 28 }}>
                    {/* Profile card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div className="card" style={{ overflow: 'hidden' }}>
                            <div style={{ height: 200, background: doctorData.color, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
                                <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F1E4, #8BAF7C)', border: '4px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 46, fontWeight: 800, color: 'white', marginBottom: -40, zIndex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                                    {doctorData.initials}
                                </div>
                                <div style={{ position: 'absolute', top: 12, right: 12, background: '#22C55E', color: 'white', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'white' }} /> Online
                                </div>
                            </div>
                            <div style={{ padding: 22, paddingTop: 52, textAlign: 'center' }}>
                                <h2 style={{ fontSize: 19, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{doctorData.name}</h2>
                                <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 18 }}>{doctorData.specialty}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 16 }}>
                                    {[[Star, '4.9', 'Rating', '#EAB308'], [Clock, '12 yrs', 'Experience', '#3B82F6'], [Award, '99', 'Reviews', '#8BAF7C']].map(([Icon, val, lbl, clr]) => (
                                        <div key={lbl} style={{ textAlign: 'center' }}>
                                            <Icon size={15} color={clr} style={{ marginBottom: 4 }} />
                                            <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{val}</div>
                                            <div style={{ fontSize: 10, color: '#9CA3AF' }}>{lbl}</div>
                                        </div>
                                    ))}
                                </div>
                                {/* Fee highlight */}
                                <div style={{ background: '#F0F8EC', border: '1.5px solid #D4E0C8', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: 13, color: '#6B7280' }}>Consultation Fee</span>
                                    <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>₹{doctorData.fee}</span>
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => navigate('/app/messages')}>
                                        <MessageCircle size={14} /> Message
                                    </button>
                                    <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => setStep('booking')}>
                                        <Calendar size={14} /> Book
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 18 }}>
                            <div className="section-title" style={{ marginBottom: 12 }}>Availability</div>
                            {[['Mon – Fri', '9:00 AM – 5:00 PM'], ['Saturday', '10:00 AM – 2:00 PM'], ['Sunday', 'Closed']].map(([d, t]) => (
                                <div key={d} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                                    <span style={{ color: '#374151', fontWeight: 500 }}>{d}</span>
                                    <span style={{ color: t === 'Closed' ? '#EF4444' : '#8BAF7C', fontWeight: 600 }}>{t}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                        <div className="card" style={{ padding: 22 }}>
                            <div className="section-title" style={{ marginBottom: 12 }}>About</div>
                            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{doctorData.about}</p>
                            <div className="divider" />
                            <div className="section-title" style={{ marginBottom: 10 }}>Key Specializations</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {doctorData.specializations.map(s => <span key={s} className="pill pill-green">{s}</span>)}
                            </div>
                        </div>

                        <div className="card" style={{ padding: 22 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <span className="section-title" style={{ marginBottom: 0 }}>Patient Reviews</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={14} fill="#EAB308" color="#EAB308" />
                                    <span style={{ fontWeight: 700, color: '#111827' }}>4.9</span>
                                    <span style={{ color: '#9CA3AF', fontSize: 12 }}>(99)</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {reviews.map(({ name, text, rating, date }) => (
                                    <div key={name} style={{ padding: 14, background: '#F9FAFB', borderRadius: 12, border: '1px solid #F3F4F6' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, #C8DAB8, #8BAF7C)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 12 }}>{name[0]}</div>
                                                <span style={{ fontWeight: 600, fontSize: 13, color: '#111827' }}>{name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                {Array.from({ length: rating }).map((_, i) => <Star key={i} size={11} fill="#EAB308" color="#EAB308" />)}
                                                <span style={{ fontSize: 10, color: '#9CA3AF', marginLeft: 4 }}>{date}</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ background: 'linear-gradient(135deg, #8BAF7C, #5A8A4A)', borderRadius: 20, padding: 26, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div>
                                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 5 }}>Ready to start your nutrition journey?</h3>
                                <p style={{ fontSize: 13, opacity: 0.85 }}>Book now · Only ₹{doctorData.fee} per session</p>
                            </div>
                            <button className="btn" style={{ background: 'white', color: '#5A8A4A', padding: '11px 22px', fontSize: 13, flexShrink: 0 }} onClick={() => setStep('booking')}>
                                Book Appointment
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
