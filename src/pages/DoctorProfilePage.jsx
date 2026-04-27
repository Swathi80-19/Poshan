import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Heart,
  MessageCircle,
  Share2,
} from 'lucide-react'
import { createAppointment, getNutritionists } from '../lib/memberApi'
import { getMemberSession } from '../lib/session'

function getInitials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'N'
}

function formatDateLabel(value) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(`${value}T00:00:00`))
}

function formatTimeLabel(value) {
  const [hours, minutes] = value.split(':').map(Number)
  const date = new Date()
  date.setHours(hours, minutes, 0, 0)
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date)
}

function buildDoctorProfile(item) {
  const years = typeof item.experience === 'number' && item.experience >= 0 ? item.experience : null

  return {
    id: item.id,
    name: item.name || item.username || 'Nutritionist',
    specialty: item.specialization || 'General Dietetics',
    email: item.email || '',
    username: item.username || '',
    expLabel: years === null ? 'Experience not shared' : `${years} year${years === 1 ? '' : 's'} experience`,
    initials: getInitials(item.name || item.username || 'Nutritionist'),
    about: `${item.name || 'This nutritionist'} is available for appointments through Poshan.`,
    specializations: [item.specialization || 'General Dietetics'],
    color: 'linear-gradient(135deg, #C8DAB8 0%, #8BAF7C 100%)',
  }
}

export default function DoctorProfilePage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [liked, setLiked] = useState(false)
  const [step, setStep] = useState('profile')
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [selectedTime, setSelectedTime] = useState('10:00')
  const [mode, setMode] = useState('VIDEO')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [doctor, setDoctor] = useState(null)
  const [bookedDetails, setBookedDetails] = useState(null)

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

  const handleBook = async () => {
    if (!doctor || !selectedDate || !selectedTime) {
      setError('Choose an appointment date and time before continuing.')
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

      const appointmentDate = new Date(`${selectedDate}T${selectedTime}:00`)
      const dateLabel = formatDateLabel(selectedDate)
      const timeLabel = formatTimeLabel(selectedTime)

      await createAppointment(session.accessToken, {
        nutritionistId: doctor.id,
        dateLabel,
        timeLabel,
        mode,
        scheduledAt: appointmentDate.toISOString().slice(0, 19),
        notes: notes.trim(),
      })

      setBookedDetails({
        dateLabel,
        timeLabel,
        mode,
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
              Your session with <strong style={{ color: '#8BAF7C' }}>{doctor.name}</strong> is scheduled for{' '}
              <strong>{bookedDetails?.dateLabel}</strong> at{' '}
              <strong>{bookedDetails?.timeLabel}</strong>.
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
                <div className="section-title" style={{ marginBottom: 16 }}>Choose date</div>
                <input
                  className="form-input"
                  type="date"
                  min={new Date().toISOString().slice(0, 10)}
                  value={selectedDate}
                  onChange={(event) => setSelectedDate(event.target.value)}
                />
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Choose time</div>
                <input
                  className="form-input"
                  type="time"
                  value={selectedTime}
                  onChange={(event) => setSelectedTime(event.target.value)}
                />
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Mode</div>
                <div className="filter-tabs">
                  {[
                    { value: 'VIDEO', label: 'Video' },
                    { value: 'CHAT', label: 'Chat' },
                    { value: 'IN_PERSON', label: 'In person' },
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`filter-tab ${mode === option.value ? 'active' : ''}`}
                      onClick={() => setMode(option.value)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <div className="section-title" style={{ marginBottom: 16 }}>Notes</div>
                <textarea
                  className="form-input tracker-textarea"
                  placeholder="Add anything you want to share before the session"
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                />
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
                    <div style={{ fontSize: 11, color: '#8BAF7C', fontWeight: 600, marginTop: 2 }}>{doctor.expLabel}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Date</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{selectedDate ? formatDateLabel(selectedDate) : 'Select a date'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Time</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{selectedTime ? formatTimeLabel(selectedTime) : 'Select a time'}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                    <span style={{ color: '#6B7280' }}>Mode</span>
                    <span style={{ fontWeight: 600, color: '#111827' }}>{mode.replaceAll('_', ' ')}</span>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginTop: 12 }} onClick={handleBook} disabled={submitting}>
                  {submitting ? 'Booking appointment...' : 'Confirm appointment'}
                </button>
              </div>
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
                  {[[Clock, doctor.expLabel, 'Experience', '#3B82F6'], [Calendar, doctor.specialty, 'Focus', '#8BAF7C']].map(([Icon, value, label, color]) => (
                    <div key={label} style={{ textAlign: 'center' }}>
                      <Icon size={15} color={color} style={{ marginBottom: 4 }} />
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#111827' }}>{value}</div>
                      <div style={{ fontSize: 10, color: '#9CA3AF' }}>{label}</div>
                    </div>
                  ))}
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
              <div className="section-title" style={{ marginBottom: 10 }}>Specialization</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {doctor.specializations.map((specialization) => (
                  <span key={specialization} className="pill pill-green">{specialization}</span>
                ))}
              </div>
            </div>

            <div className="doctor-cta" style={{ background: 'linear-gradient(135deg, #8BAF7C, #5A8A4A)', borderRadius: 20, padding: 26, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 5 }}>Ready to schedule your consultation?</h3>
                <p style={{ fontSize: 13, opacity: 0.85 }}>Choose a date, time, and mode that works for you.</p>
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
