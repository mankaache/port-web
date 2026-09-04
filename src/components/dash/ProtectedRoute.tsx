import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { isFirebaseConfigured } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (!isFirebaseConfigured) {
    return <Navigate to="/dash/setup" replace />
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void text-sm text-muted">
        Checking session…
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/dash/login" replace />
  }

  return <>{children}</>
}
