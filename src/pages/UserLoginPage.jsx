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
            {/* Left — Visual */}
            <div className="auth-left animated-bg">
                {/* Floating circles */}
                {[
                    { s: 500, op: 0.06, t: '10%', l: '5%' },
                    { s: 300, op: 0.08, t: '60%', l: '60%' },
                    { s: 200, op: 0.10, t: '20%', l: '65%' },
                ].map((c, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: c.s, height: c.s,
                        borderRadius: '50%', border: `1px solid rgba(255,255,255,${c.op})`,
                        top: c.t, left: c.l, pointerEvents: 'none'
                    }} />
                ))}

                <div className="anim-fade" style={{ textAlign: 'center', position: 'relative', zIndex: 2, padding: '0 60px' }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: 24,
                        background: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(16px)',
                        border: '1.5px solid rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 28px', boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
                        animation: 'float 4s ease-in-out infinite'
                    }}>
                        <img src={poshanLogoWhite} alt="Poshan" style={{ width: 44, height: 44 }} />
                    </div>

                    <h1 style={{ fontSize: 42, fontWeight: 700, color: 'white', letterSpacing: '-1.5px', marginBottom: 14, lineHeight: 1.1 }}>
                        Nourish your<br />healthiest self.
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 340, margin: '0 auto 48px' }}>
                        Track meals, connect with expert nutritionists, and transform your health with Poshan.
                    </p>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 32, justifyContent: 'center' }}>
                        {[['10K+', 'Active Users'], ['500+', 'Dietitians'], ['4.9★', 'App Rating']].map(([v, l]) => (
                            <div key={l} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.5px' }}>{v}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{l}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right — Form */}
            <div className="auth-right">
                <div className="anim-fade-up">
                    {/* Back to choice */}
                    <button
                        onClick={() => navigate('/choice')}
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
                    >
                        ← Back to choices
                    </button>

                    <div style={{ marginBottom: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #7FA870, #4D7A3E)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 22, height: 22 }} />
                            </div>
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#0D1B0A' }}>Poshan</span>
                        </div>
                        <h2 style={{ fontSize: 30, fontWeight: 700, color: '#0D1B0A', letterSpacing: '-0.8px', marginBottom: 8 }}>
                            Welcome back 👋
                        </h2>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Sign in to your account to continue</p>
                    </div>

                    {/* Google */}
                    <button
                        onClick={() => navigate('/app/dashboard')}
                        style={{
                            width: '100%', padding: '13px', borderRadius: 14,
                            background: 'white', border: '1.5px solid #E5E7EB',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                            cursor: 'pointer', fontSize: 14, fontWeight: 500, color: '#374151',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: 24,
                            transition: 'all 0.2s', fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" /></svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
                        <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                        <span style={{ fontSize: 12, color: '#D1D5DB', fontWeight: 500 }}>or sign in with email</span>
                        <div style={{ flex: 1, height: 1, background: '#F3F4F6' }} />
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Email address</label>
                            <div className="form-input-icon-wrap">
                                <Mail size={16} className="form-input-icon" />
                                <input className="form-input" type="email" placeholder="your@email.com"
                                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
                            </div>
                        </div>
                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                                <label className="form-label" style={{ marginBottom: 0 }}>Password</label>
                                <span style={{ fontSize: 12, color: '#7FA870', cursor: 'pointer', fontWeight: 600 }}>Forgot password?</span>
                            </div>
                            <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                                <Lock size={16} className="form-input-icon" />
                                <input className="form-input" type={show ? 'text' : 'password'} placeholder="Your password"
                                    style={{ paddingRight: 44 }}
                                    value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
                                <button type="button" onClick={() => setShow(p => !p)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex'
                                }}>
                                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px', borderRadius: 50,
                                background: loading ? '#B8D4A8' : 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                                color: 'white', border: 'none', cursor: loading ? 'wait' : 'pointer',
                                fontSize: 15, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(127,168,112,0.35)',
                                transition: 'all 0.25s', fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                marginTop: 4
                            }}
                        >
                            {loading ? 'Signing in...' : <>Sign In <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#9CA3AF' }}>
                        Don't have an account?{' '}
                        <span onClick={() => navigate('/register')} style={{ color: '#7FA870', fontWeight: 700, cursor: 'pointer' }}>
                            Create one
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}
