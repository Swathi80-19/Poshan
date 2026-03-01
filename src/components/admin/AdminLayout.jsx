import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, Users, Calendar, CreditCard,
    BarChart2, Settings, LogOut, Bell, Star
} from 'lucide-react'

import poshanLogoWhite from '../../assets/poshan-logo-white.svg'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
    { icon: Users, label: 'Patients', to: '/admin/patients' },
    { icon: Calendar, label: 'Appointments', to: '/admin/appointments' },
    { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
    { icon: BarChart2, label: 'Reports', to: '/admin/reports' },
    { icon: Star, label: 'My Profile', to: '/admin/profile' },
]

export default function AdminLayout() {
    const navigate = useNavigate()

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                {/* Logo */}
                <div className="admin-sidebar-logo">
                    <div className="admin-logo-mark">
                        <img src={poshanLogoWhite} alt="Poshan" style={{ width: 22, height: 22 }} />
                    </div>
                    <div>
                        <div className="admin-logo-text">Poshan</div>
                        <div className="admin-logo-tag">NUTRITIONIST</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="admin-nav">
                    <div className="admin-nav-section">PRACTICE</div>
                    {navItems.map(({ icon: Icon, label, to }) => (
                        <NavLink
                            key={to} to={to}
                            className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="admin-nav-icon">
                                <Icon size={17} color="currentColor" />
                            </div>
                            <span>{label}</span>
                        </NavLink>
                    ))}

                    <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '12px 0' }} />
                    <div className="admin-nav-section">ACCOUNT</div>
                    <div className="admin-nav-item" onClick={() => { }}>
                        <div className="admin-nav-icon"><Settings size={17} /></div>
                        <span>Settings</span>
                    </div>
                    <div className="admin-nav-item" style={{ color: 'rgba(244,63,94,0.8)' }}
                        onClick={() => navigate('/choice')}>
                        <div className="admin-nav-icon"><LogOut size={17} /></div>
                        <span>Logout</span>
                    </div>
                </nav>

                {/* Bottom user */}
                <div className="admin-bottom">
                    <div className="admin-user-card">
                        <div style={{
                            width: 36, height: 36, borderRadius: 12,
                            background: 'linear-gradient(135deg, #7FA870, #4D7A3E)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontWeight: 700, fontSize: 14, flexShrink: 0
                        }}>B</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>Dr. Bipasha</div>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>Online · M.Sc Nutrition</div>
                        </div>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E', flexShrink: 0 }} />
                    </div>
                </div>
            </aside>

            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    )
}
