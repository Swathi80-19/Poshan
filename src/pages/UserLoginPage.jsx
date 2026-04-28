import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Lock, Mail, Smartphone } from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'
import { clearMemberSession, saveMemberSession } from '../lib/session'
import {
  isEmailVerificationRequiredError,
  loginMember,
  resendPhoneOtp,
  verifyPhoneOtp,
} from '../lib/memberApi'

export default function UserLoginPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [verificationRequired, setVerificationRequired] = useState(false)
  const [phoneStep, setPhoneStep] = useState(null)
  const [otp, setOtp] = useState('')
  const [form, setForm] = useState({ identifier: '', password: '' })
  const showVerificationHelp = verificationRequired && form.identifier.includes('@')

  useEffect(() => {
    clearMemberSession()
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setVerificationRequired(false)

    try {
      const session = await loginMember({
        email: form.identifier.trim().toLowerCase(),
        password: form.password,
      })

      if (session.phoneVerificationRequired) {
        setPhoneStep(session)
        setOtp('')
        return
      }

      saveMemberSession(session)
      navigate(session.profileCompleted ? '/app/dashboard' : '/app/intake')
    } catch (requestError) {
      clearMemberSession()
      setVerificationRequired(isEmailVerificationRequiredError(requestError))
      setError(requestError.message || 'Unable to sign in right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    if (!phoneStep?.phoneVerificationChallengeId) {
      return
    }

    try {
      setLoading(true)
      setError('')
      const session = await verifyPhoneOtp({
        challengeId: phoneStep.phoneVerificationChallengeId,
        otp: otp.trim(),
      })
      saveMemberSession(session)
      navigate(session.profileCompleted ? '/app/dashboard' : '/app/intake')
    } catch (requestError) {
      setError(requestError.message || 'Unable to verify the phone code right now.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (!phoneStep?.phoneVerificationChallengeId) {
      return
    }

    try {
      setLoading(true)
      setError('')
      const nextStep = await resendPhoneOtp({
        challengeId: phoneStep.phoneVerificationChallengeId,
      })
      setPhoneStep(nextStep)
      setOtp('')
    } catch (requestError) {
      setError(requestError.message || 'Unable to resend the phone code right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-left-solid">
        <div className="auth-circle" style={{ width: 760, height: 760, left: '-22%', top: '-8%' }} />
        <div className="auth-circle" style={{ width: 420, height: 420, right: '-8%', top: '16%' }} />
        <div className="auth-circle" style={{ width: 460, height: 460, right: '-12%', bottom: '-18%' }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <div className="auth-topline">
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div className="brand-name" style={{ fontSize: '1.9rem' }}>Poshan</div>
              <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Member login</div>
            </div>
          </div>

          <h1 className="auth-heading">Return to a calmer daily care routine.</h1>
          <p className="auth-copy">
            Review your progress, track meals and recovery, and continue your nutrition plan from the same personal space.
          </p>

          <ul className="feature-list" style={{ marginTop: '1.25rem' }}>
            <li><span className="feature-dot">&bull;</span><span>Daily command center updates from your own saved account.</span></li>
            <li><span className="feature-dot">&bull;</span><span>Meals, activity, and recovery stay tied to your login.</span></li>
            <li><span className="feature-dot">&bull;</span><span>New accounts complete a body profile intake before the dashboard opens.</span></li>
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
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 26, height: 26 }} />
            </div>
            <div>
              <div className="eyebrow">Sign in</div>
              <div className="brand-name" style={{ fontSize: '1.5rem' }}>Welcome back</div>
            </div>
          </div>

          <p className="auth-copy">
            {phoneStep
              ? `Enter the code sent to ${phoneStep.maskedPhone || 'your phone'} to finish sign-in.`
              : 'Access your meal rhythm, care notes, and consultation history.'}
          </p>

          {!phoneStep ? (
            <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
              <span className="feature-dot">&bull;</span>
              <span>Your dashboard opens with your saved progress, consultations, and daily logs.</span>
            </div>
          ) : null}

          <form onSubmit={phoneStep ? handleVerifyOtp : handleSubmit}>
            {!phoneStep ? (
              <>
                <div className="form-group">
                  <label className="form-label">Email or dashboard name</label>
                  <div className="form-input-icon-wrap">
                    <Mail size={18} className="form-input-icon" />
                    <input
                      className="form-input"
                      placeholder="you@example.com or krishna_fit"
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
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.35rem' }}>
                  <div className="flex justify-between items-center">
                    <label className="form-label">Password</label>
                    <button type="button" className="link-button">Forgot?</button>
                  </div>
                  <div className="form-input-icon-wrap">
                    <Lock size={18} className="form-input-icon" />
                    <input
                      className="form-input"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
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
              </>
            ) : (
              <>
                <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
                  <Smartphone size={16} />
                  <span>{phoneStep.message || 'Phone verification is required to continue.'}</span>
                </div>

                {phoneStep.developmentOtp ? (
                  <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
                    <span className="feature-dot">&bull;</span>
                    <span>Dev code: {phoneStep.developmentOtp}</span>
                  </div>
                ) : null}

                <div className="form-group" style={{ marginBottom: '1.35rem' }}>
                  <label className="form-label">Verification code</label>
                  <div className="form-input-icon-wrap">
                    <Smartphone size={18} className="form-input-icon" />
                    <input
                      className="form-input"
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(event) => {
                        if (error) {
                          setError('')
                        }

                        setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
                      }}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {error ? (
              <div className="auth-note" style={{ marginBottom: '1.2rem', color: '#bf5f47' }}>
                <span className="feature-dot">&bull;</span>
                <span>{error}</span>
              </div>
            ) : null}

            {!phoneStep && showVerificationHelp ? (
              <button
                type="button"
                className="link-button"
                style={{ marginBottom: '1.2rem' }}
                onClick={() => navigate(`/verify-email?email=${encodeURIComponent(form.identifier.trim().toLowerCase())}&role=MEMBER`)}
              >
                Resend verification email
              </button>
            ) : null}

            <div className="auth-actions" style={{ marginTop: 0 }}>
              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ flex: 1 }}>
                {loading ? 'Please wait...' : phoneStep ? 'Verify phone and continue' : 'Enter member dashboard'}
                {!loading ? <ArrowRight size={16} /> : null}
              </button>
              {phoneStep ? (
                <button type="button" className="btn btn-outline btn-lg" onClick={handleResendOtp} disabled={loading}>
                  Resend code
                </button>
              ) : null}
            </div>
          </form>

          {phoneStep ? (
            <button
              type="button"
              className="link-button"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setPhoneStep(null)
                setOtp('')
                setError('')
              }}
            >
              <ArrowLeft size={14} />
              Back to credentials
            </button>
          ) : (
            <p className="quiet-note">
              New here? <button type="button" className="link-button" onClick={() => navigate('/register')}>Create a member account</button>
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
