import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  AtSign,
  Award,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Stethoscope,
  User,
} from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'
import { clearNutritionistSession } from '../lib/session'
import { registerNutritionist } from '../lib/memberApi'

const specializations = [
  'Clinical Nutrition',
  'Sports Nutrition',
  'Pediatric Nutrition',
  'Oncology Nutrition',
  'Renal Nutrition',
  'Bariatric Nutrition',
  'Diabetes Management',
  'Gut Health',
  'Weight Management',
  'General Dietetics',
]

export default function NutritionistRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    username: '',
    specialization: '',
    experience: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })

  useEffect(() => {
    clearNutritionistSession()
  }, [])

  const setField = (key, value) => {
    if (error) {
      setError('')
    }

    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleCreate = async (event) => {
    event.preventDefault()

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (form.password !== form.confirm) {
      setError('Password and confirm password must match.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const email = form.email.trim().toLowerCase()
      const username = form.username.trim().toLowerCase()

      await registerNutritionist({
        name: form.name.trim(),
        username,
        email,
        phone: form.phone.trim(),
        experience: form.experience ? Number(form.experience) : null,
        password: form.password,
        specialization: form.specialization,
      })

      navigate(`/verify-email?email=${encodeURIComponent(email)}&role=NUTRITIONIST`)
    } catch (requestError) {
      clearNutritionistSession()
      setError(requestError.message || 'Unable to create the nutritionist account right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-left-solid">
        <div className="auth-circle" style={{ width: 760, height: 760, left: '-20%', top: '-10%' }} />
        <div className="auth-circle" style={{ width: 420, height: 420, right: '-8%', top: '14%' }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
          <div className="auth-topline">
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div className="brand-name" style={{ fontSize: '1.9rem' }}>Poshan</div>
              <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Clinical onboarding</div>
            </div>
          </div>

          <h1 className="auth-heading">Set up your nutritionist practice account.</h1>
          <p className="auth-copy">
            Create your profile so members can discover you, book appointments, and connect with you through Poshan.
          </p>

          <ul className="feature-list" style={{ marginTop: '1.25rem' }}>
            <li><span className="feature-dot">&bull;</span><span>Show your specialization and experience in the expert directory.</span></li>
            <li><span className="feature-dot">&bull;</span><span>Receive appointment requests and member messages in your portal.</span></li>
            <li><span className="feature-dot">&bull;</span><span>Keep your roster, reports, and consultations organized in one place.</span></li>
          </ul>
        </div>
      </section>

      <section className="auth-right-panel">
        <div className="auth-form-card anim-fade-up">
          <button
            type="button"
            className="auth-back-link"
            onClick={() => (step === 1 ? navigate('/choice') : setStep(1))}
          >
            {step === 1 ? 'Back' : 'Back to details'}
          </button>

          <div className="auth-topline" style={{ marginTop: '1rem' }}>
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 26, height: 26 }} />
            </div>
            <div>
              <div className="eyebrow">Nutritionist account</div>
              <div className="brand-name" style={{ fontSize: '1.5rem' }}>
                {step === 1 ? 'Create your practice profile' : 'Secure portal access'}
              </div>
            </div>
          </div>

          <div className="auth-stepper">
            <span className={step >= 1 ? 'active' : 'idle'} />
            <span className={step >= 2 ? 'active' : 'idle'} />
          </div>

          {step === 1 ? (
            <form onSubmit={(event) => { event.preventDefault(); setStep(2) }}>
              <div className="form-group">
                <label className="form-label">Full name</label>
                <div className="form-input-icon-wrap">
                  <User size={18} className="form-input-icon" />
                  <input className="form-input" value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Dr. Your Name" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Portal username</label>
                <div className="form-input-icon-wrap">
                  <AtSign size={18} className="form-input-icon" />
                  <input className="form-input" value={form.username} onChange={(event) => setField('username', event.target.value.replace(/\s/g, '').toLowerCase())} placeholder="for example dr_bipasha" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Specialization</label>
                <div className="form-input-icon-wrap">
                  <Stethoscope size={18} className="form-input-icon" />
                  <select className="form-input" value={form.specialization} onChange={(event) => setField('specialization', event.target.value)} required>
                    <option value="">Select your specialization</option>
                    {specializations.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="g-2" style={{ marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Experience</label>
                  <div className="form-input-icon-wrap">
                    <Award size={18} className="form-input-icon" />
                    <input className="form-input" type="number" min="0" max="50" value={form.experience} onChange={(event) => setField('experience', event.target.value)} placeholder="Years" />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Work email</label>
                  <div className="form-input-icon-wrap">
                    <Mail size={18} className="form-input-icon" />
                    <input className="form-input" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="clinic@example.com" required />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Continue to access setup
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreate}>
              <div className="form-group">
                <label className="form-label">Phone number</label>
                <div className="form-input-icon-wrap">
                  <Phone size={18} className="form-input-icon" />
                  <input className="form-input" value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="+91 ..." />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="form-input-icon-wrap">
                  <Lock size={18} className="form-input-icon" />
                  <input
                    className="form-input"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setField('password', event.target.value)}
                    placeholder="Minimum 8 characters"
                    style={{ paddingRight: '3rem' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#97a08f' }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.3rem' }}>
                <label className="form-label">Confirm password</label>
                <div className="form-input-icon-wrap">
                  <Lock size={18} className="form-input-icon" />
                  <input className="form-input" type="password" value={form.confirm} onChange={(event) => setField('confirm', event.target.value)} placeholder="Re-enter password" required />
                </div>
              </div>

              <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
                <span className="feature-dot">&bull;</span>
                <span>You will need to verify your work email before your account becomes active.</span>
              </div>

              {error ? (
                <div className="auth-note" style={{ marginBottom: '1.2rem', color: '#bf5f47' }}>
                  <span className="feature-dot">&bull;</span>
                  <span>{error}</span>
                </div>
              ) : null}

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                {loading ? 'Creating nutritionist account...' : 'Create nutritionist account'}
                {!loading ? <ArrowRight size={16} /> : null}
              </button>
            </form>
          )}

          <p className="quiet-note">
            Already registered? <button type="button" className="link-button" onClick={() => navigate('/admin/login')}>Sign in to the portal</button>
          </p>
        </div>
      </section>
    </div>
  )
}
