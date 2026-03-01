import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

// Auth / Landing
import SplashPage from './pages/SplashPage'
import ChoicePage from './pages/ChoicePage'
import UserLoginPage from './pages/UserLoginPage'
import UserRegisterPage from './pages/UserRegisterPage'
import NutritionistRegisterPage from './pages/NutritionistRegisterPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'

// User App Layout
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import StatisticsPage from './pages/StatisticsPage'
import SearchPage from './pages/SearchPage'
import DoctorProfilePage from './pages/DoctorProfilePage'
import ChoosePlanPage from './pages/ChoosePlanPage'
import ActivityPage from './pages/ActivityPage'
import PatientDetailPage from './pages/PatientDetailPage'
import MessagesPage from './pages/MessagesPage'

// Admin / Nutritionist Layout
import AdminLayout from './components/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminPatients from './pages/admin/AdminPatients'
import AdminAppointments from './pages/admin/AdminAppointments'
import AdminPayments from './pages/admin/AdminPayments'
import AdminReports from './pages/admin/AdminReports'
import AdminProfile from './pages/admin/AdminProfile'

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

        {/* Nutritionist Auth */}
        <Route path="/nutritionist/register" element={<NutritionistRegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* User App */}
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="doctor/:id" element={<DoctorProfilePage />} />
          <Route path="plan" element={<ChoosePlanPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="patients" element={<PatientDetailPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>

        {/* Admin / Nutritionist App */}
        <Route path="/admin" element={<AdminLayout />}>
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
