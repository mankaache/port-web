import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { Lock } from 'lucide-react'
import { isFirebaseConfigured } from '@/lib/firebase'
import { auth } from '@/lib/firebase-auth'
import { useAuth } from '@/context/AuthContext'
import { useSeo } from '@/hooks/useSeo'

export default function DashLogin() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useSeo({ title: 'Sign in  Mankaa Che', description: 'Dashboard sign-in.', noindex: true })

  if (!isFirebaseConfigured) {
    return <Navigate to="/dash/setup" replace />
  }

  if (!loading && user) {
    return <Navigate to="/dash" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!auth) return
    setSubmitting(true)
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/dash', { replace: true })
    } catch {
      setError('Incorrect email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-void px-6">
      <div className="w-full max-w-sm">
        <div className="glass rounded-3xl p-8">
          <div className="mb-6 flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-sm font-bold text-void">
              MC
            </span>
            <div>
              <p className="font-display text-sm font-medium text-ink">Dashboard</p>
              <p className="text-xs text-dim">Sign in to manage projects</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs text-muted">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-violet/60"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs text-muted">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-violet/60"
              />
            </div>

            {error && <p className="text-sm text-magenta">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-void transition-opacity disabled:opacity-60"
            >
              <Lock size={14} />
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
