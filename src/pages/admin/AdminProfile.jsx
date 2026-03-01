import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, Camera, Star, Award, Users, CreditCard, Clock, Edit2, Check, Linkedin, Globe } from 'lucide-react'

const specializations = ['Weight Management', 'Sports Nutrition', 'Diabetes Diet', 'Gut Health', 'PCOS', 'Pediatric Nutrition']
const certifications = [
    { name: 'RDN — Registered Dietitian Nutritionist', year: '2014', issuer: 'Academy of Nutrition' },
    { name: 'M.Sc Nutrition & Dietetics', year: '2012', issuer: 'AIIMS, New Delhi' },
    { name: 'Sports Nutrition Certificate', year: '2018', issuer: 'NSCA' },
]

const reviews = [
    { name: 'Rekha S.', text: 'Dr. Bipasha changed my relationship with food completely. Lost 12kg!', rating: 5, date: '2 days ago' },
    { name: 'Krishna M.', text: 'Very professional, data-driven approach. Highly recommend.', rating: 5, date: '1 week ago' },
    { name: 'Priya V.', text: 'My PCOS symptoms improved significantly with her guidance.', rating: 5, date: '2 weeks ago' },
]

export default function AdminProfile() {
    const [editMode, setEditMode] = useState(false)
    const [bio, setBio] = useState('Bipasha Mukherjee is a certified nutritionist known for promoting balanced and sustainable eating habits. With 12+ years of clinical experience, she has helped over 500 patients achieve their health goals through evidence-based nutrition science.')

    return (
        <div className="anim-fade">
            <div className="admin-page-header">
                <div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 2 }}>Your professional presence</div>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#0D1B0A' }}>My Profile</div>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                    <button className="icon-btn"><Bell size={17} /></button>
                    <button
                        onClick={() => setEditMode(p => !p)}
                        style={{
                            padding: '9px 18px', borderRadius: 50,
                            background: editMode ? 'linear-gradient(135deg, #7FA870, #4D7A3E)' : '#F4FAF1',
                            color: editMode ? 'white' : '#4D7A3E',
                            border: editMode ? 'none' : '1.5px solid #C8E8BA',
                            cursor: 'pointer', fontSize: 13, fontWeight: 600,
                            display: 'flex', alignItems: 'center', gap: 6,
                            fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                            boxShadow: editMode ? '0 4px 16px rgba(127,168,112,0.30)' : 'none'
                        }}
                    >
                        {editMode ? <><Check size={14} /> Save Changes</> : <><Edit2 size={14} /> Edit Profile</>}
                    </button>
                </div>
            </div>

            <div className="page-body">
                <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24 }}>
                    {/* Left — Profile card */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* Main profile card */}
                        <div className="card" style={{ overflow: 'hidden' }}>
                            {/* Cover */}
                            <div style={{
                                height: 100,
                                background: 'linear-gradient(145deg, #0D1B0A 0%, #2C5220 60%, #7FA870 100%)',
                                position: 'relative'
                            }}>
                                <button style={{
                                    position: 'absolute', top: 12, right: 12,
                                    width: 32, height: 32, borderRadius: 10,
                                    background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', color: 'white'
                                }}>
                                    <Camera size={15} />
                                </button>
                            </div>

                            {/* Avatar */}
                            <div style={{ padding: '0 24px 24px', marginTop: -36 }}>
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                                    <div style={{
                                        width: 80, height: 80, borderRadius: '50%',
                                        background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                                        border: '4px solid white', display: 'flex', alignItems: 'center',
                                        justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white',
                                        boxShadow: '0 8px 24px rgba(127,168,112,0.3)'
                                    }}>B</div>
                                    <div style={{
                                        position: 'absolute', bottom: 4, right: 4,
                                        width: 16, height: 16, borderRadius: '50%',
                                        background: '#22C55E', border: '3px solid white'
                                    }} />
                                </div>

                                <h2 style={{ fontSize: 20, fontWeight: 700, color: '#0D1B0A', marginBottom: 3, letterSpacing: '-0.3px' }}>
                                    Dr. Bipasha Mukherjee
                                </h2>
                                <p style={{ fontSize: 13, color: '#9CA3AF', marginBottom: 12 }}>
                                    M.Sc in Nutrition & Dietetics · RDN
                                </p>

                                {/* Rating row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill={i <= 5 ? '#F59E0B' : '#E5E7EB'} color={i <= 5 ? '#F59E0B' : '#E5E7EB'} />)}
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>4.9</span>
                                    <span style={{ fontSize: 12, color: '#9CA3AF' }}>(99 reviews)</span>
                                </div>

                                {/* Stats */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: '#F3F4F6', borderRadius: 14, overflow: 'hidden' }}>
                                    {[
                                        { val: '12+', label: 'Years', bg: '#F4FAF1' },
                                        { val: '500+', label: 'Patients', bg: '#F8FFFE' },
                                        { val: '99', label: 'Reviews', bg: '#F8F7FF' },
                                    ].map(({ val, label, bg }) => (
                                        <div key={label} style={{ textAlign: 'center', padding: '12px 8px', background: bg }}>
                                            <div style={{ fontSize: 18, fontWeight: 800, color: '#111827' }}>{val}</div>
                                            <div style={{ fontSize: 10, color: '#9CA3AF', fontWeight: 500 }}>{label}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Social links */}
                                <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
                                    {[Linkedin, Globe].map((Icon, i) => (
                                        <button key={i} style={{
                                            width: 36, height: 36, borderRadius: 10,
                                            background: '#F9FAFB', border: '1px solid #E5E7EB',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            cursor: 'pointer', color: '#6B7280', transition: 'all 0.2s'
                                        }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#E8F5E2'; e.currentTarget.style.color = '#4D7A3E'; e.currentTarget.style.borderColor = '#C8E8BA' }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#6B7280'; e.currentTarget.style.borderColor = '#E5E7EB' }}
                                        >
                                            <Icon size={15} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Availability */}
                        <div className="card" style={{ padding: 22 }}>
                            <div className="section-title" style={{ marginBottom: 14 }}>Availability</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {[
                                    { day: 'Mon – Fri', time: '9:00 AM – 5:00 PM', available: true },
                                    { day: 'Saturday', time: '10:00 AM – 2:00 PM', available: true },
                                    { day: 'Sunday', time: 'Closed', available: false },
                                ].map(({ day, time, available }) => (
                                    <div key={day} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F9FAFB' }}>
                                        <span style={{ fontSize: 13, color: '#374151', fontWeight: 500 }}>{day}</span>
                                        <span style={{ fontSize: 12, color: available ? '#4D7A3E' : '#EF4444', fontWeight: 600, background: available ? '#F4FAF1' : '#FFF1F2', padding: '3px 10px', borderRadius: 20 }}>{time}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ marginTop: 14, padding: '10px 14px', background: '#F4FAF1', borderRadius: 12, border: '1px solid #C8E8BA' }}>
                                <div style={{ fontSize: 12, color: '#4D7A3E', fontWeight: 600, marginBottom: 2 }}>🟢 Currently accepting new patients</div>
                                <div style={{ fontSize: 11, color: '#6B7280' }}>Next available slot: Tomorrow, 10:00 AM</div>
                            </div>
                        </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        {/* About */}
                        <div className="card" style={{ padding: 26 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                                <div className="section-title">About</div>
                                {editMode && <span style={{ fontSize: 11, color: '#9CA3AF' }}>Editing...</span>}
                            </div>
                            {editMode ? (
                                <textarea
                                    value={bio} onChange={e => setBio(e.target.value)}
                                    style={{
                                        width: '100%', minHeight: 100, padding: '12px 14px',
                                        border: '1.5px solid #7FA870', borderRadius: 12, fontSize: 14,
                                        color: '#374151', lineHeight: 1.7, outline: 'none', resize: 'vertical',
                                        fontFamily: 'Chillax, Plus Jakarta Sans, sans-serif',
                                        background: '#F4FAF1'
                                    }}
                                />
                            ) : (
                                <p style={{ fontSize: 14, color: '#6B7280', lineHeight: 1.7 }}>{bio}</p>
                            )}

                            <div className="divider" />

                            <div className="section-title" style={{ marginBottom: 12 }}>Specializations</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {specializations.map(s => (
                                    <span key={s} style={{
                                        padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500,
                                        background: '#E8F5E2', color: '#2C5220', border: '1px solid #C8E8BA'
                                    }}>{s}</span>
                                ))}
                                {editMode && (
                                    <button style={{
                                        padding: '6px 14px', borderRadius: 50, fontSize: 12, fontWeight: 500,
                                        background: 'transparent', color: '#9CA3AF', border: '1.5px dashed #D1D5DB',
                                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                                    }}>+ Add</button>
                                )}
                            </div>
                        </div>

                        {/* Certifications */}
                        <div className="card" style={{ padding: 26 }}>
                            <div className="section-title" style={{ marginBottom: 16 }}>Certifications & Education</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {certifications.map(cert => (
                                    <div key={cert.name} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 14,
                                        padding: '14px 16px', background: '#F9FAFB', borderRadius: 14, border: '1px solid #F3F4F6'
                                    }}>
                                        <div style={{
                                            width: 40, height: 40, borderRadius: 12,
                                            background: '#E8F5E2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                                        }}>
                                            <Award size={18} color="#4D7A3E" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: 14, fontWeight: 600, color: '#111827', marginBottom: 2 }}>{cert.name}</div>
                                            <div style={{ fontSize: 12, color: '#9CA3AF' }}>{cert.issuer} · {cert.year}</div>
                                        </div>
                                        <span style={{ fontSize: 11, color: '#9CA3AF', flexShrink: 0 }}>{cert.year}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="card" style={{ padding: 26 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                <div className="section-title">Patient Reviews</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <Star size={15} fill="#F59E0B" color="#F59E0B" />
                                    <span style={{ fontWeight: 700, color: '#111827' }}>4.9</span>
                                    <span style={{ color: '#9CA3AF', fontSize: 12 }}>/5.0</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                {reviews.map(({ name, text, rating, date }) => (
                                    <div key={name} style={{ padding: '14px 16px', background: '#F9FAFB', borderRadius: 14, border: '1px solid #F3F4F6' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{
                                                    width: 30, height: 30, borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #D4E0C8, #7FA870)',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    color: 'white', fontWeight: 700, fontSize: 12
                                                }}>{name[0]}</div>
                                                <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{name}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                                                {Array.from({ length: rating }).map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
                                                <span style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>{date}</span>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.5 }}>{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
