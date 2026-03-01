import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

export default function UserLoginPage() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)

    const handleSubmit = e => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => navigate('/app/dashboard'), 800)
    }

    return (
        <div className="auth-screen">
            {/* Left — Visual (Solid Dark Green) */}
            <div className="auth-left-solid">
                {/* Large Subtle Circles */}
                <div className="auth-circle" style={{ width: 800, height: 800, left: '-20%', top: '-10%' }} />
                <div className="auth-circle" style={{ width: 400, height: 400, right: '-5%', top: '15%' }} />
                <div className="auth-circle" style={{ width: 500, height: 500, right: '-15%', bottom: '-20%' }} />

                <div className="anim-fade" style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 60px' }}>
                    <div style={{
                        width: 72, height: 72, borderRadius: 20,
                        background: 'rgba(255,255,255,0.1)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 32px'
                    }}>
                        <img src={poshanLogoWhite} alt="Poshan" style={{ width: 36, height: 36 }} />
                    </div>

                    <h1 style={{ fontSize: 46, fontWeight: 700, color: 'white', letterSpacing: '-1.5px', marginBottom: 20, lineHeight: 1.1 }}>
                        Nourish your<br />healthiest self.
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 360, margin: '0 auto 64px' }}>
                        Track meals, connect with expert<br />nutritionists, and transform your health<br />with Poshan.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 40, justifyContent: 'center' }}>
                        {[['10K+', 'Active Users'], ['500+', 'Dietitians'], ['4.9★', 'App Rating']].map(([v, l]) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>{v}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 6 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form Component */}
            <div className="auth-right-panel">
                <button
                    onClick={() => navigate('/choice')}
                    className="auth-back-link"
                >
                    ← Back to choices
                </button>

                <div className="anim-fade-up">
                    <div style={{ marginBottom: 40 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#7FA870', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 24, height: 24 }} />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, color: '#0D1B0A' }}>Poshan</span>
                        </div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0D1B0A', letterSpacing: '-1px', marginBottom: 12 }}>
                            Welcome back 👋
                        </h2>
                        <p style={{ fontSize: 15, color: '#6B7280' }}>Sign in to your account to continue</p>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={() => navigate('/app/dashboard')}
                        style={{
                            width: '100%', padding: '14px', borderRadius: 16,
                            background: 'white', border: '1px solid #E5E7EB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                            cursor: 'pointer', fontSize: 15, fontWeight: 600, color: '#374151',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)', marginBottom: 28,
                            fontFamily: 'inherit'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" /></svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                        <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                        <span style={{ fontSize: 13, color: '#D1D5DB', fontWeight: 500 }}>or sign in with email</span>
                        <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: 20 }}>
                            <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>Email address</label>
                            <div className="form-input-icon-wrap">
                                <Mail size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                <input className="form-input" type="email" placeholder="your@email.com"
                                    style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                            </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: 28 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 0 }}>Password</label>
                                <span style={{ fontSize: 13, color: '#7FA870', cursor: 'pointer', fontWeight: 700 }}>Forgot password?</span>
                            </div>
                            <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                                <Lock size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                <input className="form-input" type={show ? 'text' : 'password'} placeholder="Your password"
                                    style={{ padding: '14px 46px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                                <button type="button" onClick={() => setShow(p => !p)} style={{
                                    position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex'
                                }}>
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '16px', borderRadius: 100,
                                background: loading ? '#B8D4A8' : '#7FA870',
                                color: 'white', border: 'none', cursor: loading ? 'wait' : 'pointer',
                                fontSize: 16, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s', fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => !loading && (e.currentTarget.style.background = '#6D9460')}
                            onMouseLeave={e => !loading && (e.currentTarget.style.background = '#7FA870')}
                        >
                            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')} style={{ color: '#7FA870', fontWeight: 800, cursor: 'pointer' }}>
                            Create one
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
