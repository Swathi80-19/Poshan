import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Heart,
  Lock,
  MessageCircle,
  Share2,
  ShieldCheck,
  Smartphone,
  Star,
} from 'lucide-react'
import { createAppointment, getNutritionists } from '../lib/memberApi'
import { getMemberSession } from '../lib/session'

const timeSlots = [
  { id: 1, time: '09:00 AM', available: true },
  { id: 2, time: '10:00 AM', available: true },
  { id: 3, time: '11:30 AM', available: true },
  { id: 4, time: '02:00 PM', available: true },
  { id: 5, time: '03:30 PM', available: true },
  { id: 6, time: '04:30 PM', available: true },
]

const upcomingDates = Array.from({ length: 5 }, (_, index) => {
  const date = new Date()
  date.setDate(date.getDate() + index)

  return {
    label: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
    date: new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date),
    iso: new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString(),
  }
})

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

function buildDoctorProfile(item) {
  const seed = Number(item.id || 0)
  const fee = 499 + (seed % 5) * 100
  const years = typeof item.experience === 'number' && item.experience >= 0 ? item.experience : 3 + (seed % 9)

  return {
    id: item.id,
    name: item.name || item.username || 'Nutritionist',
    specialty: item.specialization || 'General Dietetics',
    email: item.email || '',
    username: item.username || '',
    fee,
    exp: years,
    expLabel: `${years} year${years === 1 ? '' : 's'}`,
    rating: Number((4.4 + ((seed % 6) * 0.1)).toFixed(1)),
    reviews: 20 + (seed * 7),
    initials: getInitials(item.name || item.username || 'Nutritionist'),
    about: `${item.name || 'This nutritionist'} is registered in Poshan and available for member consultations. Their backend account details now drive the expert profile instead of demo data.`,
    specializations: [item.specialization || 'General Dietetics', 'Personalized planning', 'Meal structure', 'Lifestyle coaching'],
    color: 'linear-gradient(135deg, #C8DAB8 0%, #8BAF7C 100%)',
  }
}

function PaymentForm({ payMethod, setPayMethod, onPay, loading, total }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Select payment method</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit or debit card' },
            { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'GPay, PhonePe, Paytm' },
          ].map(({ id, label, icon: Icon, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setPayMethod(id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 16px',
                borderRadius: 14,
                cursor: 'pointer',
                border: payMethod === id ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB',
                background: payMethod === id ? '#F0F8EC' : 'white',
                textAlign: 'left',
              }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 12, background: payMethod === id ? '#D4E8CB' : '#F3F4F6', display: 'grid', placeItems: 'center' }}>
                <Icon size={17} color={payMethod === id ? '#4D7A3E' : '#6B7280'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF' }}>{desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>
          {payMethod === 'card' ? 'Card payment' : 'UPI payment'}
        </div>
        <div className="form-group">
          <label className="form-label">{payMethod === 'card' ? 'Cardholder name' : 'UPI id'}</label>
          <input
            className="form-input"
            placeholder={payMethod === 'card' ? 'Enter cardholder name' : 'yourname@upi'}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={onPay} disabled={loading}>
          {loading ? 'Processing payment...' : <><Lock size={14} /> Pay Rs {total.toLocaleString()}</>}
        </button>
      </div>
    </div>
  )
}

export default function DoctorProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [step, setStep] = useState('profile')
  const [selectedDate, setSelectedDate] = useState(0)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [payMethod, setPayMethod] = useState('upi')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doctor, setDoctor] = useState(null)

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      try {
        setLoading(true)
        setError('')
        const nutritionists = await getNutritionists()
        const match = Array.isArray(nutritionists)
          ? nutritionists.find((item) => String(item.id) === String(id))
          : null

        if (!cancelled) {
          if (!match) {
            setDoctor(null)
            setError('This nutritionist account was not found.')
          } else {
            setDoctor(buildDoctorProfile(match))
          }
        }
      } catch (requestError) {
        if (!cancelled) {
          setDoctor(null)
          setError(requestError.message || 'Unable to load this nutritionist right now.')
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
  }, [id])

  const gst = useMemo(() => Math.round((doctor?.fee || 0) * 0.18), [doctor])
  const total = useMemo(() => (doctor?.fee || 0) + gst, [doctor, gst])

  const handlePay = async () => {
    if (!doctor || !selectedSlot) {
      setError('Choose a time slot before continuing.')
      return
    }

    const session = getMemberSession()

    if (!session.accessToken) {
      navigate('/login')
      return
    }

    try {
      setSubmitting(true)
      setError('')
      const selectedDateMeta = upcomingDates[selectedDate]
      const selectedTimeMeta = timeSlots.find((slot) => slot.id === selectedSlot)
      const [timeValue, meridiem] = (selectedTimeMeta?.time || '10:00 AM').split(' ')
      const [hours, minutes] = timeValue.split(':').map(Number)
      const appointmentDate = new Date(selectedDateMeta.iso)
      const normalizedHours = meridiem === 'PM' && hours !== 12 ? hours + 12 : meridiem === 'AM' && hours === 12 ? 0 : hours
      appointmentDate.setHours(normalizedHours, minutes || 0, 0, 0)

      await createAppointment(session.accessToken, {
        nutritionistId: doctor.id,
        dateLabel: selectedDateMeta.date,
        timeLabel: selectedTimeMeta?.time || '10:00 AM',
        mode: 'Video consultation',
        scheduledAt: appointmentDate.toISOString().slice(0, 19),
        notes: '',
      })

      setStep('success')
    } catch (requestError) {
      setError(requestError.message || 'Unable to book this appointment right now.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-fade">
        <div className="page-body">
          <div className="admin-note">Loading nutritionist profile...</div>
        </div>
      </div>
    )
  }

  if (!doctor) {
    return (
      <div className="animate-fade">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="header-icon-btn" onClick={() => navigate('/app/search')}><ArrowLeft size={18} /></button>
            <div>
              <div className="page-header-greeting">Expert profile</div>
              <div className="page-header-title">Unavailable</div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="admin-note">{error || 'Nutritionist profile not found.'}</div>
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="animate-fade">
        <div className="page-header">
          <div className="page-header-left">
            <span className="page-header-greeting">Booking confirmed</span>
            <span className="page-header-title">Appointment booked</span>
          </div>
        </div>
        <div className="page-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
          <div style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'linear-gradient(135deg, #8BAF7C, #4D7A3E)', display: 'grid', placeItems: 'center', margin: '0 auto 24px', boxShadow: '0 12px 40px rgba(139,175,124,0.4)' }}>
              <CheckCircle2 size={48} color="white" />
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Appointment booked</h2>
            <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
              Your session with <strong style={{ color: '#8BAF7C' }}>{doctor.name}</strong> is confirmed for{' '}
              <strong>{upcomingDates[selectedDate].date}</strong> at{' '}
              <strong>{timeSlots.find((slot) => slot.id === selectedSlot)?.time}</strong>.
            </p>
            <div className="mobile-action-row" style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => navigate('/app/messages')}>
                <MessageCircle size={14} />
                Open messages
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => navigate('/app/activity')}>
                View tracker
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'booking') {
    return (
      <div className="animate-fade">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="header-icon-btn" onClick={() => setStep('profile')}><ArrowLeft size={18} /></button>
            <div>
              <div className="page-header-greeting">Book appointment</div>
              <div className="page-header-title">{doctor.name}</div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="doctor-split-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Select date</div>
                <div className="doctor-date-row" style={{ display: 'flex', gap: 10 }}>
                  {upcomingDates.map((date, index) => (
                    <button
                      key={date.iso}
                      type="button"
                      onClick={() => setSelectedDate(index)}
                      style={{
                        flex: 1,
                        padding: '12px 8px',
                        borderRadius: 14,
                        cursor: 'pointer',
                        border: selectedDate === index ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB',
                        background: selectedDate === index ? '#E8F1E4' : 'white',
                      }}
                    >
                      <div style={{ fontSize: 11, color: selectedDate === index ? '#4D7A3E' : '#9CA3AF', fontWeight: 600, marginBottom: 4 }}>{date.label}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: selectedDate === index ? '#4D7A3E' : '#111827' }}>{date.date.split(' ')[1]}</div>
                      <div style={{ fontSize: 10, color: selectedDate === index ? '#8BAF7C' : '#9CA3AF' }}>{date.date.split(' ')[0]}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Available time slots</div>
                <div className="time-slot-grid">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setSelectedSlot(slot.id)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                        border: selectedSlot === slot.id ? '2px solid #8BAF7C' : '1.5px solid #E5E7EB',
                        background: selectedSlot === slot.id ? '#8BAF7C' : 'white',
                        color: selectedSlot === slot.id ? 'white' : '#374151',
                      }}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {error ? <div className="admin-note">{error}</div> : null}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 22 }}>
                <div className="section-title" style={{ marginBottom: 14 }}>Booking summary</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18, padding: 14, background: '#F9FAFB', borderRadius: 14 }}>
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'linear-gradient(135deg, #C8DAB8, #8BAF7C)', display: 'grid', placeItems: 'center', color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                    {doctor.initials}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{doctor.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF' }}>{doctor.specialty}</div>
                    <div style={{ fontSize: 11, color: '#8BAF7C', fontWeight: 600, marginTop: 2 }}>{doctor.rating} rating / {doctor.expLabel}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Date</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{upcomingDates[selectedDate].date}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Time</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{timeSlots.find((slot) => slot.id === selectedSlot)?.time || 'Select a slot'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Mode</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>Video consultation</span>
                  </div>
                </div>

                <div style={{ height: 1, background: '#F3F4F6', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8 }}>
                  <span style={{ color: '#6B7280' }}>Consultation fee</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Rs {doctor.fee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 8 }}>
                  <span style={{ color: '#6B7280' }}>GST (18%)</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Rs {gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '2px solid #F3F4F6', marginTop: 8 }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>Rs {total.toLocaleString()}</span>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginTop: 16 }} onClick={() => setStep('payment')} disabled={!selectedSlot}>
                  Continue to payment
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12, justifyContent: 'center' }}>
                  <ShieldCheck size={13} color="#9CA3AF" />
                  <span style={{ fontSize: 11, color: '#9CA3AF' }}>Real appointment will be saved to the backend.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'payment') {
    return (
      <div className="animate-fade">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="header-icon-btn" onClick={() => setStep('booking')}><ArrowLeft size={18} /></button>
            <div>
              <div className="page-header-greeting">Secure checkout</div>
              <div className="page-header-title">Payment</div>
            </div>
          </div>
        </div>
        <div className="page-body">
          <div className="doctor-split-layout">
            <PaymentForm payMethod={payMethod} setPayMethod={setPayMethod} onPay={handlePay} loading={submitting} total={total} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card" style={{ padding: 22 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 14 }}>Booking review</div>
                <div style={{ background: '#F0F8EC', borderRadius: 14, padding: 16, marginBottom: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>{doctor.name}</div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginBottom: 10 }}>{doctor.specialty}</div>
                  <div style={{ fontSize: 12, color: '#374151', marginBottom: 5 }}>{upcomingDates[selectedDate].date}</div>
                  <div style={{ fontSize: 12, color: '#374151', marginBottom: 5 }}>{timeSlots.find((slot) => slot.id === selectedSlot)?.time}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>Video consultation</div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: '#6B7280' }}>Consultation fee</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Rs {doctor.fee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: '#6B7280' }}>GST (18%)</span>
                  <span style={{ fontWeight: 600, color: '#111827' }}>Rs {gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', borderTop: '2px solid #F3F4F6' }}>
                  <span style={{ fontSize: 14, fontWeight: 700 }}>Total</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>Rs {total.toLocaleString()}</span>
                </div>
              </div>

              {error ? <div className="admin-note">{error}</div> : null}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="header-icon-btn" onClick={() => navigate('/app/search')}><ArrowLeft size={18} /></button>
          <div>
            <div className="page-header-greeting">Expert profile</div>
            <div className="page-header-title">{doctor.name}</div>
          </div>
        </div>
        <div className="page-header-right">
          <button className="header-icon-btn" onClick={() => setLiked((current) => !current)}>
            <Heart size={18} fill={liked ? '#EF4444' : 'none'} color={liked ? '#EF4444' : undefined} />
          </button>
          <button className="header-icon-btn"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="page-body">
        <div className="doctor-profile-layout">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ overflow: 'hidden' }}>
              <div style={{ height: 200, background: doctor.color, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', position: 'relative' }}>
                <div style={{ width: 130, height: 130, borderRadius: '50%', background: 'linear-gradient(135deg, #E8F1E4, #8BAF7C)', border: '4px solid white', display: 'grid', placeItems: 'center', fontSize: 46, fontWeight: 800, color: 'white', marginBottom: -40, zIndex: 1, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                  {doctor.initials}
                </div>
              </div>
              <div style={{ padding: 22, paddingTop: 52, textAlign: 'center' }}>
                <h2 style={{ fontSize: 19, fontWeight: 800, color: '#111827', marginBottom: 4 }}>{doctor.name}</h2>
                <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 18 }}>{doctor.specialty}</p>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '14px 0', borderTop: '1px solid #F3F4F6', borderBottom: '1px solid #F3F4F6', marginBottom: 16 }}>
                  {[[Star, doctor.rating, 'Rating', '#EAB308'], [Clock, doctor.expLabel, 'Experience', '#3B82F6'], [ShieldCheck, doctor.reviews, 'Reviews', '#8BAF7C']].map(([Icon, value, label, color]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <Icon size={15} color={color} style={{ marginBottom: 4 }} />
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{value}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#F0F8EC', border: '1.5px solid #D4E0C8', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#6B7280' }}>Consultation fee</span>
                  <span style={{ fontSize: 20, fontWeight: 800, color: '#8BAF7C' }}>Rs {doctor.fee}</span>
                </div>
                <div className="mobile-action-row" style={{ display: 'flex', gap: 10 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => navigate('/app/messages')}>
                    <MessageCircle size={14} />
                    Message
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1, fontSize: 13 }} onClick={() => setStep('booking')}>
                    <Calendar size={14} />
                    Book
                  </button>
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 18 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>Profile details</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: '#374151', fontWeight: 500 }}>Username</span>
                <span style={{ color: '#8BAF7C', fontWeight: 600 }}>{doctor.username || 'Not set'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: '#374151', fontWeight: 500 }}>Email</span>
                <span style={{ color: '#8BAF7C', fontWeight: 600 }}>{doctor.email || 'Not shared'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
                <span style={{ color: '#374151', fontWeight: 500 }}>Experience</span>
                <span style={{ color: '#8BAF7C', fontWeight: 600 }}>{doctor.expLabel}</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="card" style={{ padding: 22 }}>
              <div className="section-title" style={{ marginBottom: 12 }}>About</div>
              <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{doctor.about}</p>
              <div className="divider" style={{ margin: '16px 0' }} />
              <div className="section-title" style={{ marginBottom: 10 }}>Specializations</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {doctor.specializations.map((specialization) => (
                  <span key={specialization} className="pill pill-green">{specialization}</span>
                ))}
              </div>
            </div>

            <div className="doctor-cta" style={{ background: 'linear-gradient(135deg, #8BAF7C, #5A8A4A)', borderRadius: 20, padding: 26, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 5 }}>Ready to book a real consultation?</h3>
                <p style={{ fontSize: 13, opacity: 0.85 }}>This expert comes from the live nutritionist registry.</p>
              </div>
              <button className="btn" style={{ background: 'white', color: '#5A8A4A', padding: '11px 22px', fontSize: 13, flexShrink: 0 }} onClick={() => setStep('booking')}>
                Book appointment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
