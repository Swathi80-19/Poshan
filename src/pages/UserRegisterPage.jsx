import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, AtSign, ArrowRight, Phone } from 'lucide-react'
import poshanLogo from '../assets/poshan-logo.svg'

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
            {/* Left */}
            <div className="auth-left animated-bg" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.1)' }} />
                {[300, 200, 120].map((s, i) => (
                    <div key={i} style={{
                        position: 'absolute', width: s, height: s,
                        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
                        top: `${20 + i * 25}%`, right: `${5 + i * 10}%`, pointerEvents: 'none'
                    }} />
                ))}
                <div className="anim-fade" style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 60px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 36 }}>
                        {['🥑', '🥗', '🍎', '💧'].map((e, i) => (
                            <div key={i} style={{
                                width: 52, height: 52, borderRadius: 16,
                                background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
                                marginLeft: i === 0 ? 0 : -8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                                animation: `float 3s ease-in-out infinite`, animationDelay: `${i * 0.4}s`
                            }}>
                                {e}
                            </div>
                        ))}
                    </div>
                    <h1 style={{ fontSize: 38, fontWeight: 700, color: 'white', letterSpacing: '-1.2px', lineHeight: 1.15, marginBottom: 16 }}>
                        Start your wellness<br />journey today.
                    </h1>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 320, margin: '0 auto' }}>
                        Join thousands of users achieving their nutrition goals with expert guidance.
                    </p>
                    {/* Progress */}
                    <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 48 }}>
                        {[1, 2].map(s => (
                            <div key={s} style={{
                                height: 4, borderRadius: 4,
                                width: step === s ? 32 : 16,
                                background: step >= s ? 'white' : 'rgba(255,255,255,0.25)',
                                transition: 'all 0.3s'
                            }} />
                        ))}
                    </div>
                    <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>Step {step} of 2</p>
                </div>
            </div>

            {/* Right */}
            <div className="auth-right">
                <div className="anim-fade-up">
                    <button
                        onClick={() => step === 1 ? navigate('/choice') : setStep(1)}
                        style={{ background: 'none', border: 'none', color: '#9CA3AF', fontSize: 13, cursor: 'pointer', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 6, padding: 0 }}
                    >
                        ← {step === 1 ? 'Back to choices' : 'Previous step'}
                    </button>

                    <div style={{ marginBottom: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                            <img src={poshanLogo} alt="Poshan" style={{ width: 38, height: 38 }} />
                            <span style={{ fontSize: 18, fontWeight: 700, color: '#0D1B0A' }}>Poshan</span>
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#0D1B0A', letterSpacing: '-0.6px', marginBottom: 4 }}>
                            {step === 1 ? 'Create your account' : 'Secure your account'}
                        </h2>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>
                            {step === 1 ? 'Fill in your details to get started' : 'Choose a strong, secure password'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={e => { e.preventDefault(); setStep(2) }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="form-input-icon-wrap">
                                    <User size={16} className="form-input-icon" />
                                    <input className="form-input" placeholder="Your full name" value={form.name} onChange={e => set('name', e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">
                                    Username <span style={{ color: '#8BAF7C', fontSize: 11 }}>(shown in dashboard)</span>
                                </label>
                                <div className="form-input-icon-wrap">
                                    <AtSign size={16} className="form-input-icon" />
                                    <input className="form-input" placeholder="e.g. krishna_fit" value={form.username} onChange={e => set('username', e.target.value.replace(/\s/g, '').toLowerCase())} required />
                                </div>
                                {form.username && (
                                    <div style={{ fontSize: 11, color: '#8BAF7C', marginTop: 4, marginLeft: 2 }}>
                                        ✓ Your dashboard will greet: <strong>{form.username}</strong>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <div className="form-input-icon-wrap">
                                    <Mail size={16} className="form-input-icon" />
                                    <input className="form-input" type="email" placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)} required />
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <div className="form-input-icon-wrap">
                                    <Phone size={16} className="form-input-icon" />
                                    <input className="form-input" placeholder="+91 ..." value={form.phone} onChange={e => set('phone', e.target.value)} />
                                </div>
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '14px', borderRadius: 50,
                                background: 'linear-gradient(135deg, #7FA870, #4D7A3E)', color: 'white',
                                border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(127,168,112,0.35)',
                                fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif', marginTop: 8
                            }}>
                                Continue <ArrowRight size={16} />
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleCreate}>
                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <div className="form-input-icon-wrap" style={{ position: 'relative' }}>
                                    <Lock size={16} className="form-input-icon" />
                                    <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min 8 characters" style={{ paddingRight: 44 }} value={form.password} onChange={e => set('password', e.target.value)} required />
                                    <button type="button" onClick={() => setShowPass(p => !p)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', display: 'flex' }}>
                                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="form-input-icon-wrap">
                                    <Lock size={16} className="form-input-icon" />
                                    <input className="form-input" type="password" placeholder="Re-enter password" value={form.confirm} onChange={e => set('confirm', e.target.value)} required />
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, padding: '12px 14px', background: '#F4FAF1', borderRadius: 12, border: '1px solid #C8E8BA' }}>
                                <div style={{ width: 18, height: 18, borderRadius: 6, background: '#7FA870', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, flexShrink: 0 }}>
                                    <span style={{ color: 'white', fontSize: 10 }}>✓</span>
                                </div>
                                <span style={{ fontSize: 12, color: '#6B7280', lineHeight: 1.5 }}>
                                    I agree to Poshan's <span style={{ color: '#7FA870', fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: '#7FA870', fontWeight: 600 }}>Privacy Policy</span>
                                </span>
                            </div>
                            <button type="submit" style={{
                                width: '100%', padding: '14px', borderRadius: 50,
                                background: 'linear-gradient(135deg, #7FA870, #4D7A3E)', color: 'white',
                                border: 'none', cursor: 'pointer', fontSize: 15, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                boxShadow: '0 8px 24px rgba(127,168,112,0.35)',
                                fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif'
                            }}>
                                Create Account 🎉
                            </button>
                        </form>
                    )}

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#9CA3AF' }}>
                        Already have an account?{' '}
                        <span onClick={() => navigate('/login')} style={{ color: '#7FA870', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
