import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import poshanLogoWhite from '../assets/poshan-logo-white.svg'

export default function SplashPage() {
    const navigate = useNavigate()
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
        const t = setTimeout(() => navigate('/choice'), 2800)
        return () => clearTimeout(t)
    }, [navigate])

    return (
        <div
            className="animated-bg"
            style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 0,
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
            }}
            onClick={() => navigate('/choice')}
        >
            {/* Decorative circles */}
            <div style={{
                position: 'absolute', width: 600, height: 600,
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.06)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
            }} />
            <div style={{
                position: 'absolute', width: 420, height: 420,
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)'
            }} />
            <div style={{
                position: 'absolute', width: 260, height: 260,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(127,168,112,0.15) 0%, transparent 70%)',
                top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                animation: 'glow 3s ease-in-out infinite'
            }} />

            {/* Logo container */}
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'all 0.8s cubic-bezier(0.4,0,0.2,1)',
                position: 'relative', zIndex: 2
            }}>
                {/* Logo mark */}
                <div style={{
                    width: 110, height: 110,
                    borderRadius: 32,
                    background: 'rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(20px)',
                    border: '1.5px solid rgba(255,255,255,0.20)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.3)',
                    animation: visible ? 'float 4s ease-in-out infinite' : 'none',
                    animationDelay: '0.5s'
                }}>
                    <img src={poshanLogoWhite} alt="Poshan" style={{ width: 64, height: 64 }} />
                </div>

                {/* Brand name */}
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{
                        fontSize: 52, fontWeight: 700, color: 'white',
                        letterSpacing: '-2px', lineHeight: 1,
                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                        textShadow: '0 4px 24px rgba(0,0,0,0.2)'
                    }}>
                        Poshan
                    </h1>
                    <p style={{
                        fontSize: 16, color: 'rgba(255,255,255,0.65)',
                        marginTop: 10, fontWeight: 400, letterSpacing: '0.5px'
                    }}>
                        Your premium nutrition companion
                    </p>
                </div>

                {/* Loading dots */}
                <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: 6, height: 6, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.5)',
                            animation: 'pulse-ring 1.4s ease-in-out infinite',
                            animationDelay: `${i * 0.2}s`
                        }} />
                    ))}
                </div>
            </div>

            {/* Bottom tagline */}
            <p style={{
                position: 'absolute', bottom: 40,
                fontSize: 12, color: 'rgba(255,255,255,0.35)',
                letterSpacing: '1px', textTransform: 'uppercase',
                fontWeight: 500
            }}>
                Nourish · Balance · Thrive
            </p>
        </div>
    )
}
