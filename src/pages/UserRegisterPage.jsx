import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, AtSign, Eye, EyeOff, Lock, Mail, Phone, User } from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'
import { saveMemberSession } from '../lib/session'

export default function UserRegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  })

  const setField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleCreate = (event) => {
    event.preventDefault()

    saveMemberSession({
      name: form.name,
      username: form.username || form.name,
      email: form.email,
    })

    navigate('/app/intake')
  }

  return (
    <div className="auth-screen">
      <section className="auth-left-solid">
        <div className="auth-circle" style={{ width: 780, height: 780, left: '-24%', top: '-12%' }} />
        <div className="auth-circle" style={{ width: 460, height: 460, right: '-10%', top: '18%' }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
          <div className="auth-topline">
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div className="brand-name" style={{ fontSize: '1.9rem' }}>Poshan</div>
              <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Personal onboarding</div>
            </div>
          </div>

          <h1 className="auth-heading">Build a nutrition space that feels organized from day one.</h1>
          <p className="auth-copy">
            We&apos;ll set up your member profile, name your dashboard, and prepare a clearer careboard for meals,
            movement, hydration, and expert follow-up.
          </p>

          <ul className="feature-list" style={{ marginTop: '1.25rem' }}>
            <li><span className="feature-dot">•</span><span>Readable daily care summaries.</span></li>
            <li><span className="feature-dot">•</span><span>Body-profile intake before your first dashboard visit.</span></li>
            <li><span className="feature-dot">•</span><span>Account-based tracking instead of sample demo data.</span></li>
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
              <div className="eyebrow">Create account</div>
              <div className="brand-name" style={{ fontSize: '1.5rem' }}>
                {step === 1 ? 'Set your profile' : 'Secure your account'}
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
                  <input className="form-input" value={form.name} onChange={(event) => setField('name', event.target.value)} placeholder="Your full name" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Dashboard name</label>
                <div className="form-input-icon-wrap">
                  <AtSign size={18} className="form-input-icon" />
                  <input
                    className="form-input"
                    value={form.username}
                    onChange={(event) => setField('username', event.target.value.replace(/\s/g, '').toLowerCase())}
                    placeholder="for example krishna_fit"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email address</label>
                <div className="form-input-icon-wrap">
                  <Mail size={18} className="form-input-icon" />
                  <input className="form-input" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} placeholder="you@example.com" required />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.3rem' }}>
                <label className="form-label">Phone number</label>
                <div className="form-input-icon-wrap">
                  <Phone size={18} className="form-input-icon" />
                  <input className="form-input" value={form.phone} onChange={(event) => setField('phone', event.target.value)} placeholder="+91 ..." />
                </div>
              </div>

              <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
                <span className="feature-dot">•</span>
                <span>After account creation, Poshan will collect your age, height, weight, activity level, and goal details.</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Continue to security
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreate}>
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
                <span className="feature-dot">✓</span>
                <span>You agree to the Poshan terms, privacy standards, and the personalized nutrition care experience.</span>
              </div>

              <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                Create member account
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <p className="quiet-note">
            Already registered? <button type="button" className="link-button" onClick={() => navigate('/login')}>Sign in instead</button>
          </p>
        </div>
      </section>
    </div>
  )
}
