import { useEffect, useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Calendar,
  MessageSquare,
  CreditCard,
  BarChart2,
  Settings,
  LogOut,
  Star,
} from 'lucide-react'
import poshanLogoWhite from '../../assets/poshan-logo-white.svg'
import {
  clearNutritionistSession,
  getNutritionistSession,
  NUTRITIONIST_SESSION_EVENT,
} from '../../lib/session'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/admin/dashboard' },
  { icon: Users, label: 'Patients', to: '/admin/patients' },
  { icon: Calendar, label: 'Appointments', to: '/admin/appointments' },
  { icon: MessageSquare, label: 'Messages', to: '/admin/messages' },
  { icon: CreditCard, label: 'Payments', to: '/admin/payments' },
  { icon: BarChart2, label: 'Reports', to: '/admin/reports' },
  { icon: Star, label: 'Profile', to: '/admin/profile' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [session, setSession] = useState(() => getNutritionistSession())

  useEffect(() => {
    const syncSession = () => setSession(getNutritionistSession())

    window.addEventListener(NUTRITIONIST_SESSION_EVENT, syncSession)
    window.addEventListener('storage', syncSession)

    return () => {
      window.removeEventListener(NUTRITIONIST_SESSION_EVENT, syncSession)
      window.removeEventListener('storage', syncSession)
    }
  }, [])

  const displayName = session.username || session.name || 'Nutritionist'
  const specialization = session.specialization || 'Clinical nutritionist'
  const initial = displayName.charAt(0).toUpperCase()

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div className="auth-mark" style={{ width: 46, height: 46 }}>
            <img src={poshanLogoWhite} alt="Poshan" style={{ width: 24, height: 24 }} />
          </div>
          <div>
            <div className="admin-logo-text">Poshan</div>
            <div className="admin-logo-tag">Nutritionist workspace</div>
          </div>
        </div>

        <div className="workspace-rail admin-rail">
          <div className="workspace-rail-top">
            <div>
              <div className="workspace-kicker">Clinical control</div>
              <h4>{specialization}</h4>
            </div>
            <span className="badge badge-amber">Practice</span>
          </div>
          <p>
            Member communication, appointments, reports, and profile management stay together in one practice hub.
          </p>
          <div className="workspace-chip-row">
            <span className="workspace-chip">Member roster</span>
            <span className="workspace-chip">Secure records</span>
          </div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Practice</div>
          {navItems.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <div className="admin-nav-icon">
                <Icon size={17} />
              </div>
              <span className="nav-label">{label}</span>
            </NavLink>
          ))}

          <div className="divider" style={{ margin: '0.55rem 0' }} />
          <div className="admin-nav-section">Account</div>

          <button type="button" className="admin-nav-item">
            <div className="admin-nav-icon">
              <Settings size={17} />
            </div>
            <span className="nav-label">Settings</span>
          </button>

          <button
            type="button"
            className="admin-nav-item"
            style={{ color: '#bf5f47' }}
            onClick={() => {
              clearNutritionistSession()
              navigate('/admin/login')
            }}
          >
            <div className="admin-nav-icon">
              <LogOut size={17} />
            </div>
            <span className="nav-label">Logout</span>
          </button>
        </nav>

        <div className="admin-bottom">
          <div className="admin-spotlight">
            <div className="eyebrow" style={{ marginBottom: '0.35rem' }}>Careboard</div>
            <h4>Calm clinic flow</h4>
            <p>
              Keep sessions, patients, payments, and reports easy to review throughout the day.
            </p>
          </div>

          <div className="admin-user-card">
            <div className="sidebar-user-avatar">{initial}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{displayName}</div>
              <div className="sidebar-user-role">{specialization}</div>
            </div>
            <div style={{ width: 9, height: 9, borderRadius: '999px', background: '#2f8d58' }} />
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="content-shell admin-shell">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
