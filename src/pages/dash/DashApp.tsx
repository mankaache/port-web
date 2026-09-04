import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import ProtectedRoute from '@/components/dash/ProtectedRoute'
import DashLayout from '@/pages/dash/DashLayout'
import DashLogin from '@/pages/dash/Login'
import DashSetup from '@/pages/dash/Setup'
import DashboardHome from '@/pages/dash/DashboardHome'
import ProjectForm from '@/pages/dash/ProjectForm'

export default function DashApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<DashLogin />} />
        <Route path="setup" element={<DashSetup />} />
        <Route
          element={
            <ProtectedRoute>
              <DashLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="new" element={<ProjectForm />} />
          <Route path=":slug/edit" element={<ProjectForm />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}
