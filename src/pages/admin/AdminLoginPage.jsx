import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from 'lucide-react'
import poshanLogoWhite from '../../assets/poshan-logo-white.svg'
import { clearNutritionistSession, saveNutritionistSession } from '../../lib/session'
import { isEmailVerificationRequiredError, loginNutritionist } from '../../lib/memberApi'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationRequired, setVerificationRequired] = useState(false)
  const [form, setForm] = useState({ identifier: '', password: '' })
  const showVerificationHelp = verificationRequired && form.identifier.includes('@')

  useEffect(() => {
    clearNutritionistSession()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setVerificationRequired(false)

    try {
      const session = await loginNutritionist({
        email: form.identifier.trim().toLowerCase(),
        password: form.password,
      })

      saveNutritionistSession(session)
      navigate('/admin/dashboard')
    } catch (requestError) {
      clearNutritionistSession()
      setVerificationRequired(isEmailVerificationRequiredError(requestError))
      setError(requestError.message || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-left-solid">
        <div className="auth-circle" style={{ width: 760, height: 760, left: '-24%', top: '-12%' }} />
        <div className="auth-circle" style={{ width: 460, height: 460, right: '-10%', top: '18%' }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 1, maxWidth: 540 }}>
          <div className="auth-topline">
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div className="brand-name" style={{ fontSize: '1.9rem' }}>Poshan</div>
              <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Nutritionist portal</div>
            </div>
          </div>

          <h1 className="auth-heading">Sign into the real clinical workspace.</h1>
          <p className="auth-copy">
            The nutritionist portal now uses backend authentication, so dashboard, patients, and appointments follow the actual registered account.
          </p>

          <ul className="feature-list" style={{ marginTop: '1.25rem' }}>
            <li><span className="feature-dot">•</span><span>Uses the same backend auth flow as the member workspace.</span></li>
            <li><span className="feature-dot">•</span><span>Shows only patients and appointments tied to the logged-in nutritionist.</span></li>
            <li><span className="feature-dot">•</span><span>Removes the old local demo sign-in shortcut.</span></li>
          </ul>
        </div>
      </section>

      <section className="auth-right-panel">
        <div className="auth-form-card anim-fade-up">
          <button type="button" className="auth-back-link" onClick={() => navigate('/choice')}>
            Back
          </button>

          <div className="auth-topline" style={{ marginBottom: '1rem' }}>
            <div className="auth-mark">
              <ShieldCheck size={22} color="white" />
            </div>
            <div>
              <div className="eyebrow">Secure access</div>
              <div className="brand-name" style={{ fontSize: '1.5rem' }}>Nutritionist portal sign in</div>
            </div>
          </div>

          <p className="auth-copy">Sign in to your clinical workspace and continue your patient review flow.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Work email or username</label>
              <div className="form-input-icon-wrap">
                <Mail size={18} className="form-input-icon" />
                <input
                  className="form-input"
                  value={form.identifier}
                  onChange={(event) => {
                    if (error) {
                      setError('')
                    }

                    if (verificationRequired) {
                      setVerificationRequired(false)
                    }

                    setForm((current) => ({ ...current, identifier: event.target.value }))
                  }}
                  placeholder="doctor@clinic.com or dr_bipasha"
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.3rem' }}>
              <label className="form-label">Password</label>
              <div className="form-input-icon-wrap">
                <Lock size={18} className="form-input-icon" />
                <input
                  className="form-input"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => {
                    if (error) {
                      setError('')
                    }

                    if (verificationRequired) {
                      setVerificationRequired(false)
                    }

                    setForm((current) => ({ ...current, password: event.target.value }))
                  }}
                  placeholder="Enter your password"
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

            {error ? (
              <div className="auth-note" style={{ marginBottom: '1.2rem', color: '#bf5f47' }}>
                <span className="feature-dot">•</span>
                <span>{error}</span>
              </div>
            ) : null}

            {showVerificationHelp ? (
              <button
                type="button"
                className="link-button"
                style={{ marginBottom: '1.2rem' }}
                onClick={() => navigate(`/verify-email?email=${encodeURIComponent(form.identifier.trim().toLowerCase())}&role=NUTRITIONIST`)}
              >
                Resend verification email
              </button>
            ) : null}

            <div className="auth-actions" style={{ marginTop: 0 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Accessing portal...' : 'Access clinical workspace'}
                {!loading ? <ArrowRight size={16} /> : null}
              </button>
              <button type="button" className="btn btn-outline btn-lg" onClick={() => navigate('/nutritionist/register')}>
                Create account
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
