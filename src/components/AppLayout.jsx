import { useEffect, useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BarChart2,
  Search,
  Calendar,
  MessageSquare,
  Settings,
} from 'lucide-react'
import poshanLogo from '../assets/poshan-logo.svg'
import { getMemberSession, MEMBER_SESSION_EVENT } from '../lib/session'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/app/dashboard' },
  { icon: BarChart2, label: 'Statistics', to: '/app/statistics' },
  { icon: Search, label: 'Experts', to: '/app/search' },
  { icon: Calendar, label: 'Tracker', to: '/app/activity' },
  { icon: MessageSquare, label: 'Messages', to: '/app/messages', badge: 3 },
]

export default function AppLayout() {
  const [session, setSession] = useState(() => getMemberSession())
  const username = session.username || session.name || 'Member'
  const initial = username.charAt(0).toUpperCase()

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined
    }

    const syncSession = () => setSession(getMemberSession())
    window.addEventListener(MEMBER_SESSION_EVENT, syncSession)
    return () => window.removeEventListener(MEMBER_SESSION_EVENT, syncSession)
  }, [])

  return (
    <div className="app-layout">
      <aside className="sidebar anim-slide-l">
        <div className="sidebar-logo">
          <img src={poshanLogo} alt="Poshan" style={{ width: 42, height: 42 }} />
          <div>
            <div className="sidebar-logo-text">Poshan</div>
            <div className="sidebar-logo-sub">Personal Nutrition Desk</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section-title">Workspace</div>
          {navItems.map(({ icon: Icon, label, to, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="sidebar-nav-icon">
                <Icon size={17} />
              </div>
              <span className="nav-label">{label}</span>
              {badge ? <span className="nav-badge">{badge}</span> : null}
            </NavLink>
          ))}

          <div className="divider" style={{ margin: '0.55rem 0' }} />
          <div className="sidebar-section-title">Account</div>

          <NavLink
            to="/app/settings"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="sidebar-nav-icon">
              <Settings size={17} />
            </div>
            <span className="nav-label">Settings</span>
          </NavLink>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-spotlight">
            <div className="eyebrow" style={{ marginBottom: '0.35rem' }}>Today Focus</div>
            <h4>Balanced rhythm</h4>
            <p>Hydrate before lunch, hold protein pace, and review your notes before the 3 PM consult.</p>
          </div>

          <div className="sidebar-user-card">
            <div className="sidebar-user-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{username}</div>
              <div className="sidebar-user-role">Premium care plan active</div>
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
