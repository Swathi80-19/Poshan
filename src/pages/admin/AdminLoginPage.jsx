import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield } from 'lucide-react'

export default function AdminLoginPage() {
    const navigate = useNavigate()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: '#0D1B0A',
            position: 'relative', overflow: 'hidden'
        }}>
            {/* Background blobs */}
            <div style={{
                position: 'absolute', width: 600, height: 600, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(127,168,112,0.08) 0%, transparent 70%)',
                top: -200, right: -200, pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(127,168,112,0.06) 0%, transparent 70%)',
                bottom: -100, left: -100, pointerEvents: 'none'
            }} />

            {/* Grid overlay */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `linear-gradient(rgba(127,168,112,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(127,168,112,0.04) 1px, transparent 1px)`,
                backgroundSize: '40px 40px', pointerEvents: 'none'
            }} />

            <div className="anim-scale" style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 2 }}>
                {/* Card */}
                <div style={{
                    background: 'rgba(255,255,255,0.04)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 28, padding: 44,
                    boxShadow: '0 32px 80px rgba(0,0,0,0.5)'
                }}>
                    {/* Logo */}
                    <div style={{ textAlign: 'center', marginBottom: 36 }}>
                        <div style={{
                            width: 64, height: 64, borderRadius: 20,
                            background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 16px', boxShadow: '0 12px 32px rgba(127,168,112,0.35)'
                        }}>
                            <Shield size={28} color="white" />
                        </div>
                        <h2 style={{ fontSize: 26, fontWeight: 700, color: 'white', letterSpacing: '-0.5px', marginBottom: 6 }}>
                            Nutritionist Portal
                        </h2>
                        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                            Sign in to manage your practice
                        </p>
                    </div>

                    {/* Credentials hint */}
                    <div style={{
                        padding: '10px 14px', borderRadius: 10,
                        background: 'rgba(127,168,112,0.08)',
                        border: '1px solid rgba(127,168,112,0.15)',
                        marginBottom: 24, display: 'flex', gap: 8, alignItems: 'center'
                    }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#9BBF8A', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Use any credentials to demo the nutritionist dashboard</span>
                    </div>

                    <form onSubmit={e => { e.preventDefault(); setLoading(true); setTimeout(() => navigate('/admin/dashboard'), 800) }}>
                        <div style={{ marginBottom: 16 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block', letterSpacing: '0.3px' }}>
                                EMAIL ADDRESS
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type="email" placeholder="dr.name@clinic.com"
                                    value={form.email}
                                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '13px 14px 13px 42px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        borderRadius: 12, color: 'white', fontSize: 14,
                                        outline: 'none', fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(127,168,112,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                                />
                            </div>
                        </div>
                        <div style={{ marginBottom: 24 }}>
                            <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block', letterSpacing: '0.3px' }}>
                                PASSWORD
                            </label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                                <input
                                    type={show ? 'text' : 'password'} placeholder="••••••••"
                                    value={form.password}
                                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                                    style={{
                                        width: '100%', padding: '13px 44px 13px 42px',
                                        background: 'rgba(255,255,255,0.06)',
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        borderRadius: 12, color: 'white', fontSize: 14,
                                        outline: 'none', fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={e => { e.target.style.borderColor = 'rgba(127,168,112,0.5)'; e.target.style.background = 'rgba(255,255,255,0.08)' }}
                                    onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.10)'; e.target.style.background = 'rgba(255,255,255,0.06)' }}
                                />
                                <button type="button" onClick={() => setShow(p => !p)} style={{
                                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex'
                                }}>
                                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>
                        <button type="submit" disabled={loading} style={{
                            width: '100%', padding: '14px', borderRadius: 50,
                            background: loading ? 'rgba(127,168,112,0.5)' : 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                            color: 'white', border: 'none', cursor: loading ? 'wait' : 'pointer',
                            fontSize: 15, fontWeight: 600,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                            boxShadow: '0 8px 24px rgba(127,168,112,0.30)',
                            fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif', transition: 'all 0.25s'
                        }}>
                            {loading ? 'Signing in...' : <>Access Portal <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <span
                            onClick={() => navigate('/choice')}
                            style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', cursor: 'pointer' }}
                        >
                            ← Back to home
                        </span>
                    </div>
                </div>

                {/* Trust indicators */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 24 }}>
                    {['🔐 Encrypted', '🔒 HIPAA Safe', '⚡ Fast Access'].map(t => (
                        <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{t}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
