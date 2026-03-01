import { useNavigate } from 'react-router-dom'
import { User, Stethoscope, ArrowRight } from 'lucide-react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

const choices = [
    {
        type: 'user',
        icon: User,
        emoji: '🥗',
        title: 'I\'m a User',
        subtitle: 'Track nutrition, book dietitian consultations, and achieve your health goals.',
        features: ['Meal Tracking', 'Expert Consultations', 'Health Statistics', 'Progress Charts'],
        loginPath: '/login',
        registerPath: '/register',
        gradient: 'linear-gradient(145deg, #E8F5E2, #C8E8BA)',
        iconColor: '#4D7A3E',
        accent: '#7FA870',
        cta: 'Continue as User',
    },
    {
        type: 'nutritionist',
        icon: Stethoscope,
        emoji: '🩺',
        title: 'I\'m a Nutritionist',
        subtitle: 'Manage patients, schedules, appointments, payments, and grow your practice.',
        features: ['Patient Management', 'Appointment Calendar', 'Payment Tracking', 'Detailed Reports'],
        loginPath: '/admin/login',
        registerPath: '/nutritionist/register',
        gradient: 'linear-gradient(145deg, #0D1B0A, #1E3A18)',
        iconColor: '#9BBF8A',
        accent: '#7FA870',
        cta: 'Continue as Nutritionist',
        dark: true,
    },
]

export default function ChoicePage() {
    const navigate = useNavigate()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(145deg, #F4FAF1 0%, #E8F5E2 50%, #D0E8C4 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 24px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Background decoration */}
            <div style={{
                position: 'absolute', top: -100, right: -100,
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(127,168,112,0.12) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />
            <div style={{
                position: 'absolute', bottom: -80, left: -80,
                width: 300, height: 300, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(77,122,62,0.10) 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            {/* Logo */}
            <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 48 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{
                        width: 48, height: 48, borderRadius: 16,
                        background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px rgba(127,168,112,0.35)',
                    }}>
                        <img src={poshanLogoWhite} alt="Poshan" style={{ width: 34, height: 34 }} />
                    </div>
                    <span style={{ fontSize: 30, fontWeight: 700, color: '#1a2e14', letterSpacing: '-1px' }}>Poshan</span>
                </div>
                <h1 style={{ fontSize: 32, fontWeight: 700, color: '#0D1B0A', letterSpacing: '-0.8px', marginBottom: 8 }}>
                    Welcome! Who are you?
                </h1>
                <p style={{ fontSize: 16, color: '#6B7280', fontWeight: 400 }}>
                    Choose your experience to get started
                </p>
            </div>

            {/* Choice cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, maxWidth: 900, width: '100%' }}>
                {choices.map((c, idx) => (
                    <div
                        key={c.type}
                        className="anim-fade-up"
                        style={{
                            animationDelay: `${idx * 0.12}s`,
                            background: c.dark ? '#0D1B0A' : 'white',
                            borderRadius: 28,
                            padding: 36,
                            border: c.dark ? '1px solid rgba(127,168,112,0.2)' : '1px solid #E5EDE1',
                            boxShadow: c.dark
                                ? '0 24px 64px rgba(0,0,0,0.25)'
                                : '0 12px 40px rgba(127,168,112,0.12)',
                            display: 'flex', flexDirection: 'column', gap: 0,
                            cursor: 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
                            position: 'relative', overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-6px)'
                            e.currentTarget.style.boxShadow = c.dark
                                ? '0 32px 80px rgba(0,0,0,0.35)'
                                : '0 20px 56px rgba(127,168,112,0.20)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = c.dark
                                ? '0 24px 64px rgba(0,0,0,0.25)'
                                : '0 12px 40px rgba(127,168,112,0.12)'
                        }}
                    >
                        {/* Decorative blur circle */}
                        <div style={{
                            position: 'absolute', top: -40, right: -40,
                            width: 160, height: 160, borderRadius: '50%',
                            background: `radial-gradient(circle, ${c.accent}20 0%, transparent 70%)`,
                            pointerEvents: 'none'
                        }} />

                        {/* Emoji badge */}
                        <div style={{
                            width: 72, height: 72, borderRadius: 20,
                            background: c.dark ? 'rgba(127,168,112,0.12)' : '#E8F5E2',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 36, marginBottom: 24,
                            border: c.dark ? '1px solid rgba(127,168,112,0.2)' : '1px solid #C8E8BA',
                        }}>
                            {c.emoji}
                        </div>

                        <h2 style={{ fontSize: 24, fontWeight: 700, color: c.dark ? 'white' : '#0D1B0A', marginBottom: 10, letterSpacing: '-0.4px' }}>
                            {c.title}
                        </h2>
                        <p style={{ fontSize: 14, color: c.dark ? 'rgba(255,255,255,0.55)' : '#6B7280', lineHeight: 1.6, marginBottom: 24 }}>
                            {c.subtitle}
                        </p>

                        {/* Features */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
                            {c.features.map(f => (
                                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <div style={{
                                        width: 20, height: 20, borderRadius: 6,
                                        background: c.dark ? 'rgba(127,168,112,0.2)' : '#E8F5E2',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0,
                                        border: c.dark ? '1px solid rgba(127,168,112,0.25)' : '1px solid #C8E8BA'
                                    }}>
                                        <span style={{ fontSize: 10, color: c.accent }}>✓</span>
                                    </div>
                                    <span style={{ fontSize: 13, color: c.dark ? 'rgba(255,255,255,0.6)' : '#374151', fontWeight: 500 }}>{f}</span>
                                </div>
                            ))}
                        </div>

                        {/* CTA buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 'auto' }}>
                            <button
                                style={{
                                    padding: '13px 20px',
                                    borderRadius: 50,
                                    background: c.dark
                                        ? 'linear-gradient(135deg, #7FA870, #4D7A3E)'
                                        : 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                                    color: 'white', border: 'none', cursor: 'pointer',
                                    fontSize: 15, fontWeight: 600,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                    boxShadow: '0 8px 24px rgba(127,168,112,0.35)',
                                    transition: 'all 0.25s',
                                    fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                }}
                                onClick={() => navigate(c.loginPath)}
                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                {c.cta}
                                <ArrowRight size={16} />
                            </button>
                            {c.type === 'user' && (
                                <button
                                    style={{
                                        padding: '11px 20px', borderRadius: 50,
                                        background: 'transparent', color: c.iconColor,
                                        border: `1.5px solid ${c.accent}40`, cursor: 'pointer',
                                        fontSize: 13, fontWeight: 500,
                                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => navigate(c.registerPath)}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E2' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                                >
                                    Create new account
                                </button>
                            )}
                            {c.type === 'nutritionist' && (
                                <button
                                    style={{
                                        padding: '11px 20px', borderRadius: 50,
                                        background: 'transparent', color: 'rgba(255,255,255,0.7)',
                                        border: `1.5px solid rgba(127,168,112,0.35)`, cursor: 'pointer',
                                        fontSize: 13, fontWeight: 500,
                                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                        transition: 'all 0.2s'
                                    }}
                                    onClick={() => navigate(c.registerPath)}
                                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(127,168,112,0.15)' }}
                                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                                >
                                    Create nutritionist account
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <p style={{ marginTop: 32, fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
                © 2025 Poshan · Your health, our mission
            </p>
        </div>
    )
}
