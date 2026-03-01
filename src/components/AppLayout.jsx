import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
    LayoutDashboard, BarChart2, Search, Calendar,
    MessageSquare, Settings, LogOut
} from 'lucide-react'
import poshanLogo from '../assets/poshan-logo.svg'

const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/app/dashboard' },
    { icon: BarChart2, label: 'Statistics', to: '/app/statistics' },
    { icon: Search, label: 'Experts', to: '/app/search' },
    { icon: Calendar, label: 'Activity', to: '/app/activity' },
    { icon: MessageSquare, label: 'Messages', to: '/app/messages', badge: 3 },
]

export default function AppLayout() {
    const navigate = useNavigate()
    const username = localStorage.getItem('poshan_username') || 'Krishna'
    const initial = username.charAt(0).toUpperCase()

    return (
        <div className="app-layout">
            <aside className="sidebar anim-slide-l">
                {/* Logo */}
                <div className="sidebar-logo">
                    <img src={poshanLogo} alt="Poshan" style={{ width: 44, height: 44 }} />
                    <div>
                        <div className="sidebar-logo-text">Poshan</div>
                        <div className="sidebar-logo-sub">Nutrition Platform</div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="sidebar-nav">
                    <div className="sidebar-section-title">MAIN MENU</div>
                    {navItems.map(({ icon: Icon, label, to, badge }) => (
                        <NavLink
                            key={to} to={to}
                            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                        >
                            <div className="sidebar-nav-icon">
                                <Icon size={17} />
                            </div>
                            <span style={{ flex: 1 }}>{label}</span>
                            {badge && <span className="nav-badge">{badge}</span>}
                        </NavLink>
                    ))}

                    <div className="divider" style={{ margin: '12px 0' }} />
                    <div className="sidebar-section-title">ACCOUNT</div>
                    <div className="sidebar-nav-item" onClick={() => { }}>
                        <div className="sidebar-nav-icon"><Settings size={17} /></div>
                        <span>Settings</span>
                    </div>
                    <div className="sidebar-nav-item" style={{ color: '#F43F5E' }}
                        onClick={() => navigate('/choice')}>
                        <div className="sidebar-nav-icon"><LogOut size={17} /></div>
                        <span>Logout</span>
                    </div>
                </nav>

                {/* User pill */}
                <div className="sidebar-bottom">
                    <div className="sidebar-user-card">
                        <div className="sidebar-user-avatar">{initial}</div>
                        <div className="sidebar-user-info">
                            <div className="sidebar-user-name">{username}</div>
                            <div className="sidebar-user-role">Premium Member · ✓</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <Outlet />
            </main>
        </div>
    )
}
