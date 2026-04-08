import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRightLeft, LogOut, Settings, ShieldAlert, Trash2 } from 'lucide-react'
import { deleteMemberAccount, logoutMember } from '../lib/memberApi'
import {
  clearMemberSession,
  deleteCurrentMemberLocalData,
  getMemberDisplayName,
  getMemberSession,
} from '../lib/session'

export default function MemberSettingsPage() {
  const navigate = useNavigate()
  const session = getMemberSession()
  const username = getMemberDisplayName()
  const [isWorking, setIsWorking] = useState(false)

  const goToLogin = () => {
    clearMemberSession()
    navigate('/login')
  }

  const handleLogout = async () => {
    if (isWorking) {
      return
    }

    setIsWorking(true)

    try {
      if (session.accessToken) {
        await logoutMember(session.accessToken)
      }
    } catch {
      // Keep logout resilient even if the backend token is already invalid.
    } finally {
      clearMemberSession()
      navigate('/choice')
      setIsWorking(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (isWorking) {
      return
    }

    const shouldDelete = window.confirm(
      'Delete this account permanently? This will remove your profile, tracker logs, payments, and session.',
    )

    if (!shouldDelete) {
      return
    }

    setIsWorking(true)

    try {
      if (session.accessToken) {
        await deleteMemberAccount(session.accessToken)
      }

      deleteCurrentMemberLocalData()
      window.alert('Your account has been deleted.')
      navigate('/choice')
    } catch (error) {
      window.alert(error.message || 'Unable to delete the account right now.')
      setIsWorking(false)
    }
  }

  return (
    <div className="animate-fade">
      <div className="page-header">
        <div className="page-header-left">
          <span className="page-header-greeting">Account controls</span>
          <span className="page-header-title">Settings</span>
        </div>
      </div>

      <div className="page-body">
        <div className="g-2-auto">
          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Session access</h3>
                <p>Manage how {username} enters or leaves the member workspace.</p>
              </div>
              <Settings size={18} color="#73955f" />
            </div>

            <div className="timeline-list" style={{ marginBottom: '1.2rem' }}>
              <div className="admin-note">
                Signed in as <strong>{session.email || username}</strong>
              </div>
            </div>

            <div className="auth-actions" style={{ marginTop: 0 }}>
              <button className="btn btn-outline" type="button" onClick={goToLogin}>
                <ArrowRightLeft size={16} />
                Login page
              </button>
              <button className="btn btn-primary" type="button" onClick={handleLogout} disabled={isWorking}>
                <LogOut size={16} />
                {isWorking ? 'Working...' : 'Logout'}
              </button>
            </div>
          </section>

          <section className="support-card">
            <div className="dashboard-panel-heading">
              <div>
                <h3>Danger zone</h3>
                <p>This permanently removes your member account and all related tracking data.</p>
              </div>
              <ShieldAlert size={18} color="#bf5f47" />
            </div>

            <div className="auth-note" style={{ marginBottom: '1.2rem', color: '#9f4236' }}>
              <span className="feature-dot">&bull;</span>
              <span>Deleting the account removes your profile, tracker logs, payments, appointments, and active session.</span>
            </div>

            <button
              className="btn btn-outline"
              type="button"
              onClick={handleDeleteAccount}
              disabled={isWorking}
              style={{ color: '#9f4236', borderColor: 'rgba(159, 66, 54, 0.25)' }}
            >
              <Trash2 size={16} />
              {isWorking ? 'Working...' : 'Delete account'}
            </button>
          </section>
        </div>
      </div>
    </div>
  )
}
