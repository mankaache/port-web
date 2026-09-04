import { Link, Outlet, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { LayoutDashboard, LogOut, ExternalLink } from 'lucide-react'
import { auth } from '@/lib/firebase-auth'
import { useAuth } from '@/context/AuthContext'
import { useSeo } from '@/hooks/useSeo'

export default function DashLayout() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useSeo({ title: 'Dashboard  Mankaa Che', description: 'Project management dashboard.', noindex: true })

  const handleSignOut = async () => {
    if (!auth) return
    await signOut(auth)
    navigate('/dash/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-void text-ink">
      <header className="border-b border-line/80 bg-surface/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <Link to="/dash" className="flex shrink-0 items-center gap-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-sm font-bold text-void">
              MC
            </span>
            <span className="hidden font-display text-sm font-medium sm:inline">Dashboard</span>
          </Link>

          <nav className="flex min-w-0 items-center gap-1 text-sm text-muted sm:gap-2">
            <Link
              to="/dash"
              title="Projects"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-ink sm:px-3"
            >
              <LayoutDashboard size={15} />
              <span className="hidden sm:inline">Projects</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              title="View site"
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 transition-colors hover:bg-white/5 hover:text-ink sm:px-3"
            >
              <ExternalLink size={15} />
              <span className="hidden sm:inline">View site</span>
            </a>
            {user?.email && (
              <span className="hidden max-w-[14ch] truncate pl-2 text-xs text-dim lg:inline">
                {user.email}
              </span>
            )}
            <button
              onClick={handleSignOut}
              title="Sign out"
              className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1.5 transition-colors hover:border-violet/60 hover:bg-violet/10 hover:text-ink sm:px-3"
            >
              <LogOut size={15} />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
