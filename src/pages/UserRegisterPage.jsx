import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight, Phone } from 'lucide-react'
import poshanLogo from '../assets/poshan-logo.svg'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

export default function UserRegisterPage() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1)
    const [showPass, setShowPass] = useState(false)
    const [form, setForm] = useState({ name: '', username: '', email: '', phone: '', password: '', confirm: '' })

    const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

    const handleCreate = (e) => {
        e.preventDefault()
        // Save username to localStorage so dashboard can read it
        localStorage.setItem('poshan_username', form.username || form.name)
        localStorage.setItem('poshan_name', form.name)
        navigate('/app/dashboard')
    }

    return (
        <div className="auth-screen">
            {/* Left — Visual (Solid Dark Green) */}
            <div className="auth-left-solid">
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
                    onClick={() => step === 1 ? navigate('/choice') : setStep(1)}
                    className="auth-back-link"
                >
                    ← {step === 1 ? 'Back to choices' : 'Previous step'}
                </button>

                <div className="anim-fade-up">
                    <div style={{ marginBottom: 36 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#7FA870', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img src={poshanLogoWhite} alt="Poshan" style={{ width: 24, height: 24 }} />
                            </div>
                            <span style={{ fontSize: 20, fontWeight: 800, color: '#0D1B0A' }}>Poshan</span>
                        </div>
                        <h2 style={{ fontSize: 32, fontWeight: 800, color: '#0D1B0A', letterSpacing: '-1px', marginBottom: 8 }}>
                            {step === 1 ? 'Create your account' : 'Secure your account'}
                        </h2>
                        <p style={{ fontSize: 15, color: '#6B7280' }}>
                            {step === 1 ? 'Fill in your details to get started' : 'Choose a strong, secure password'}
                        </p>
                    </div>

                    {/* Progress indicators moved here below header */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 32 }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{
                                height: 4, borderRadius: 4,
                                width: step === s ? 32 : 16,
                                background: step >= s ? '#7FA870' : '#E5E7EB',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                        <span style={{ fontSize: 13, color: '#9CA3AF', marginLeft: 6, lineHeight: '8px' }}>Step {step} of 2</span>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={e => { e.preventDefault(); setStep(2) }}>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>Full Name</label>
                                <div className="form-input-icon-wrap">
                                    <User size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" placeholder="Your full name"
                                        style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.name} onChange={e => set('name', e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>
                                    Username <span style={{ color: '#8BAF7C', fontSize: 11, fontWeight: 600 }}>(shown in dashboard)</span>
                                </label>
                                <div className="form-input-icon-wrap">
                                    <AtSign size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" placeholder="e.g. krishna_fit"
                                        style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.username} onChange={e => set('username', e.target.value.replace(/\s/g, '').toLowerCase())} required />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 16 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>Email Address</label>
                                <div className="form-input-icon-wrap">
                                    <Mail size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" type="email" placeholder="your@email.com"
                                        style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.email} onChange={e => set('email', e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 28 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>Phone Number</label>
                                <div className="form-input-icon-wrap">
                                    <Phone size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" placeholder="+91 ..."
                                        style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.phone} onChange={e => set('phone', e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '16px', borderRadius: 100,
                                background: '#7FA870', color: 'white',
                                border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s', fontFamily: 'inherit'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#6D9460'}
                                onMouseLeave={e => e.currentTarget.style.background = '#7FA870'}
                            >
                                Continue <ArrowRight size={18} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreate}>
                            <div className="form-group" style={{ marginBottom: 20 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>New Password</label>
                                <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                                    <Lock size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters"
                                        style={{ padding: '14px 46px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.password} onChange={e => set('password', e.target.value)} required />
                                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}>
                                        {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group" style={{ marginBottom: 24 }}>
                                <label className="form-label" style={{ fontWeight: 700, color: '#374151', marginBottom: 8 }}>Confirm Password</label>
                                <div className="form-input-icon-wrap">
                                    <Lock size={18} color="#9CA3AF" className="form-input-icon" style={{ left: 16 }} />
                                    <input className="form-input" type="password" placeholder="Re-enter password"
                                        style={{ padding: '14px 16px 14px 46px', border: '1px solid #E5E7EB', borderRadius: 12, background: 'white' }}
                                        value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 28, padding: '14px 16px', background: '#F4FAF1', borderRadius: 12, border: '1px solid #C8E8BA' }}>
                                <div style={{ width: 20, height: 20, borderRadius: 6, background: '#7FA870', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                                    <span style={{ color: 'white', fontSize: 12 }}>✓</span>
                                </div>
                                <span style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>
                                    I agree to Poshan's <span style={{ color: '#7FA870', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#7FA870', fontWeight: 600 }}>Privacy Policy</span>
                                </span>
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '16px', borderRadius: 100,
                                background: '#7FA870', color: 'white',
                                border: 'none', cursor: 'pointer', fontSize: 16, fontWeight: 700,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                transition: 'all 0.2s', fontFamily: 'inherit'
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#6D9460'}
                                onMouseLeave={e => e.currentTarget.style.background = '#7FA870'}
                            >
                                Create Account 🎉
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: 'center', marginTop: 32, fontSize: 14, color: '#9CA3AF', fontWeight: 500 }}>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} style={{ color: '#7FA870', fontWeight: 800, cursor: 'pointer' }}>Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
