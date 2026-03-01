import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
    const navigate = useNavigate()
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirm: ''
    })

    const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = e => {
        e.preventDefault()
        navigate('/app/dashboard')
    }

    return (
        <div className="auth-layout">
            <div style={{ display: 'flex', width: '100%', maxWidth: 1100, minHeight: '100vh', background: 'white', borderRadius: 0, overflow: 'hidden' }}>
                {/* Left panel - branding */}
                <div style={{
                    flex: 1,
                    background: 'linear-gradient(145deg, #C8DAB8 0%, #8BAF7C 100%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 60,
                    gap: 28
                }}>
                    <div style={{
                        width: 100, height: 100, borderRadius: '50%',
                        border: '3px solid rgba(255,255,255,0.6)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 32, fontWeight: 800, color: 'white', background: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(8px)'
                    }}>P</div>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: 'white', textAlign: 'center', lineHeight: 1.2 }}>
                        Your Nutrition<br />Journey Starts Here
                    </h1>
                    <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.85)', textAlign: 'center', maxWidth: 300, lineHeight: 1.6 }}>
                        Track your meals, connect with expert nutritionists, and achieve your health goals with Poshan.
                    </p>
                    <div style={{ display: 'flex', gap: 32, marginTop: 20 }}>
                        {[['500+', 'Dietitians'], ['10k+', 'Users'], ['4.9', 'Rating']].map(([val, lbl]) => (
                            <div key={lbl} style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: 24, fontWeight: 800, color: 'white' }}>{val}</div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{lbl}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right panel - form */}
                <div style={{
                    width: 480,
                    padding: 64,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    background: 'white'
                }}>
                    <div style={{ marginBottom: 40 }}>
                        <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 8 }}>Register</h2>
                        <p style={{ fontSize: 14, color: '#6B7280' }}>Create your Poshan account to get started.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        <div className="form-group">
                            <label className="form-label">Name*</label>
                            <input
                                className="form-input"
                                name="name"
                                placeholder="Your full name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">E-mail*</label>
                            <input
                                className="form-input"
                                name="email"
                                type="email"
                                placeholder="your@email.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">New Password*</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="form-input"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    placeholder="Create a password"
                                    value={form.password}
                                    onChange={handleChange}
                                    style={{ paddingRight: 44 }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', color: '#9CA3AF', cursor: 'pointer'
                                    }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password*</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    className="form-input"
                                    name="confirm"
                                    type={showConfirm ? 'text' : 'password'}
                                    placeholder="Confirm your password"
                                    value={form.confirm}
                                    onChange={handleChange}
                                    style={{ paddingRight: 44 }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(p => !p)}
                                    style={{
                                        position: 'absolute', right: 14, top: '50%',
                                        transform: 'translateY(-50%)', background: 'none',
                                        border: 'none', color: '#9CA3AF', cursor: 'pointer'
                                    }}
                                >
                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ marginBottom: 16 }}>
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 12,
                                padding: '11px 16px',
                                border: '1.5px solid #E5E7EB',
                                borderRadius: 12,
                                cursor: 'pointer',
                                justifyContent: 'center',
                                transition: 'all 0.2s'
                            }}
                                onClick={() => navigate('/app/dashboard')}
                            >
                                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" /><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" /><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" /><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" /></svg>
                                <span style={{ fontSize: 14, fontWeight: 500, color: '#374151' }}>Sign up with Google</span>
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: 15 }}>
                            Submit
                        </button>
                    </form>

                    <p style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9CA3AF' }}>
                        Already have an account?{' '}
                        <span
                            style={{ color: '#8BAF7C', fontWeight: 600, cursor: 'pointer' }}
                            onClick={() => navigate('/app/dashboard')}
                        >Sign in</span>
                    </p>
                </div>
            </div>
        </div>
    )
}
