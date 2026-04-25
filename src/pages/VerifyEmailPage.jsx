import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, MailCheck, RefreshCcw } from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'
import { getVerificationStatus, resendVerificationEmail, verifyEmailToken } from '../lib/memberApi'

const verificationRequestCache = new Map()

function normalizeRole(role) {
  return (role || 'MEMBER').trim().toUpperCase() === 'NUTRITIONIST' ? 'NUTRITIONIST' : 'MEMBER'
}

function verifyEmailTokenOnce(token) {
  if (!verificationRequestCache.has(token)) {
    verificationRequestCache.set(
      token,
      verifyEmailToken({ token }).catch((error) => {
        verificationRequestCache.delete(token)
        throw error
      })
    )
  }

  return verificationRequestCache.get(token)
}

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const emailFromQuery = searchParams.get('email') || ''
  const roleFromQuery = normalizeRole(searchParams.get('role'))
  const [status, setStatus] = useState(token ? 'verifying' : 'pending')
  const [message, setMessage] = useState(
    token
      ? 'Checking your verification link...'
      : 'We sent a verification link to your inbox. Open it to activate your account.'
  )
  const [resolvedEmail, setResolvedEmail] = useState(emailFromQuery)
  const [resolvedRole, setResolvedRole] = useState(roleFromQuery)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loginPath = useMemo(
    () => (resolvedRole === 'NUTRITIONIST' ? '/admin/login' : '/login'),
    [resolvedRole]
  )

  useEffect(() => {
    if (!token) {
      return
    }

    let active = true

    async function runVerification() {
      try {
        const response = await verifyEmailTokenOnce(token)

        if (!active) {
          return
        }

        setResolvedEmail(response.email || emailFromQuery)
        setResolvedRole(normalizeRole(response.role || roleFromQuery))
        setMessage(response.message || 'Email verified successfully.')
        setStatus('success')
        setError('')
      } catch (requestError) {
        if (emailFromQuery) {
          try {
            const verificationStatus = await getVerificationStatus({
              email: emailFromQuery.trim().toLowerCase(),
              role: roleFromQuery,
            })

            if (!active) {
              return
            }

            if (verificationStatus.emailVerified) {
              setResolvedEmail(verificationStatus.email || emailFromQuery)
              setResolvedRole(normalizeRole(verificationStatus.role || roleFromQuery))
              setMessage('This email is already verified. You can sign in now.')
              setStatus('success')
              setError('')
              return
            }
          } catch {
            // Fall through to the original verification error below.
          }
        }

        if (!active) {
          return
        }

        setError(requestError.message || 'Unable to verify this email right now.')
        setStatus('error')
      }
    }

    runVerification()

    return () => {
      active = false
    }
  }, [token, emailFromQuery, roleFromQuery])

  useEffect(() => {
    if (token || !resolvedEmail) {
      return
    }

    let active = true

    async function loadStatus() {
      try {
        const response = await getVerificationStatus({
          email: resolvedEmail.trim().toLowerCase(),
          role: resolvedRole,
        })

        if (!active) {
          return
        }

        if (response.emailVerified) {
          setMessage('This email is already verified. You can sign in now.')
          setStatus('success')
          setError('')
        }
      } catch (requestError) {
        if (!active) {
          return
        }

        setError(requestError.message || 'Unable to load verification status right now.')
      }
    }

    loadStatus()

    return () => {
      active = false
    }
  }, [token, resolvedEmail, resolvedRole])

  const handleResend = async () => {
    if (!resolvedEmail) {
      setError('Use the email address from signup so we know where to send the verification link.')
      return
    }

    try {
      setLoading(true)
      setError('')
      const response = await resendVerificationEmail({
        email: resolvedEmail.trim().toLowerCase(),
        role: resolvedRole,
      })
      setResolvedEmail(response.email || resolvedEmail)
      setResolvedRole(normalizeRole(response.role || resolvedRole))
      setMessage(response.message || 'A fresh verification email has been sent.')
      setStatus(response.emailVerified ? 'success' : 'pending')
    } catch (requestError) {
      setError(requestError.message || 'Unable to resend the verification email right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-left-solid">
        <div className="auth-circle" style={{ width: 760, height: 760, left: '-22%', top: '-8%' }} />
        <div className="auth-circle" style={{ width: 420, height: 420, right: '-8%', top: '16%' }} />

        <div className="anim-fade" style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}>
          <div className="auth-topline">
            <div className="auth-mark">
              <img src={poshanLogoWhite} alt="Poshan" style={{ width: 28, height: 28 }} />
            </div>
            <div>
              <div className="brand-name" style={{ fontSize: '1.9rem' }}>Poshan</div>
              <div className="eyebrow" style={{ marginTop: '0.2rem' }}>Email verification</div>
            </div>
          </div>

          <h1 className="auth-heading">Only verified email addresses can unlock a Poshan account.</h1>
          <p className="auth-copy">
            This step proves the inbox belongs to the person creating the account, so logins only work after the email link is confirmed.
          </p>

          <ul className="feature-list" style={{ marginTop: '1.25rem' }}>
            <li><span className="feature-dot">&bull;</span><span>Signup stores the account, but access waits for email verification.</span></li>
            <li><span className="feature-dot">&bull;</span><span>Expired links can be replaced with one fresh resend.</span></li>
            <li><span className="feature-dot">&bull;</span><span>Both member and nutritionist accounts follow the same verification rule.</span></li>
          </ul>
        </div>
      </section>

      <section className="auth-right-panel">
        <div className="auth-form-card anim-fade-up">
          <div className="auth-topline" style={{ marginBottom: '1rem' }}>
            <div className="auth-mark">
              <MailCheck size={22} color="white" />
            </div>
            <div>
              <div className="eyebrow">Secure access</div>
              <div className="brand-name" style={{ fontSize: '1.5rem' }}>
                {status === 'success' ? 'Email verified' : 'Check your inbox'}
              </div>
            </div>
          </div>

          <p className="auth-copy">{message}</p>

          {resolvedEmail ? (
            <div className="auth-note" style={{ marginBottom: '1.2rem' }}>
              <span className="feature-dot">&bull;</span>
              <span>Verification email: {resolvedEmail}</span>
            </div>
          ) : null}

          {error ? (
            <div className="auth-note" style={{ marginBottom: '1.2rem', color: '#bf5f47' }}>
              <span className="feature-dot">&bull;</span>
              <span>{error}</span>
            </div>
          ) : null}

          {status === 'success' ? (
            <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={() => navigate(loginPath)}>
              Continue to sign in
              <ArrowRight size={16} />
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleResend} disabled={loading}>
                {loading ? 'Sending verification email...' : 'Resend verification email'}
                {!loading ? <RefreshCcw size={16} /> : null}
              </button>

              <button
                type="button"
                className="btn btn-outline btn-lg"
                style={{ width: '100%', marginTop: '0.8rem' }}
                onClick={() => navigate(loginPath)}
              >
                Back to sign in
              </button>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
