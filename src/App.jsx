import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'


import SplashPage from './pages/SplashPage'
import ChoicePage from './pages/ChoicePage'
import UserLoginPage from './pages/UserLoginPage'
import UserRegisterPage from './pages/UserRegisterPage'
import NutritionistRegisterPage from './pages/NutritionistRegisterPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'


import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import StatisticsPage from './pages/StatisticsPage'
import SearchPage from './pages/SearchPage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import ChoosePlanPage from './pages/ChoosePlanPage'
import ActivityPage from './pages/ActivityPage'
import PatientDetailPage from './pages/PatientDetailPage'
import MessagesPage from './pages/MessagesPage'
import ProfileIntakePage from './pages/ProfileIntakePage'
import MemberSettingsPage from './pages/MemberSettingsPage'

import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPatients from './pages/admin/AdminPatients'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReports from './pages/admin/AdminReports'
import AdminProfile from './pages/admin/AdminProfile'
import { getMemberSession, getNutritionistSession } from './lib/session'

function RequireMemberAuth({ children }) {
  const session = getMemberSession()

  if (!session.accessToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

function RequireNutritionistAuth({ children }) {
  const session = getNutritionistSession()

  if (!session.accessToken) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<SplashPage />} />
        <Route path="/choice" element={<ChoicePage />} />

        {/* User Auth */}
        <Route path="/login" element={<UserLoginPage />} />
        <Route path="/register" element={<UserRegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />

        {/* Nutritionist Auth */}
        <Route path="/nutritionist/register" element={<NutritionistRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* User App */}
        <Route
          path="/app"
          element={(
            <RequireMemberAuth>
              <AppLayout />
            </RequireMemberAuth>
          )}
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="doctor/:id" element={<DoctorProfilePage />} />
          <Route path="plan" element={<ChoosePlanPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="intake" element={<ProfileIntakePage />} />
          <Route path="patients" element={<PatientDetailPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="settings" element={<MemberSettingsPage />} />
        </Route>

        {/* Admin / Nutritionist App */}
        <Route
          path="/admin"
          element={(
            <RequireNutritionistAuth>
              <AdminLayout />
            </RequireNutritionistAuth>
          )}
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="patients" element={<AdminPatients />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
