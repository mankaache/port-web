import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'

const links = [
  { label: 'Work', hash: '#work' },
  { label: 'Services', hash: '#services' },
  { label: 'Process', hash: '#process' },
  { label: 'About', hash: '#about' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const goToSection = (hash: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate('/' + hash)
      return
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-full px-5 transition-all duration-500 sm:px-6 ${
          scrolled ? 'glass-nav py-2.5' : 'py-1'
        }`}
      >
        <Link to="/" className="group flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-sm font-bold text-void">
            MC
          </span>
          <span className="font-display text-sm font-medium tracking-tight text-ink">
            Mankaa Che
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <button
              key={link.hash}
              onClick={() => goToSection(link.hash)}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={() => goToSection('#contact')}
            className="group inline-flex items-center gap-1.5 rounded-full border border-line bg-surface/60 px-4 py-2 text-sm text-ink transition-colors hover:border-violet/60 hover:bg-violet/10"
          >
            Start a project
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </button>
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-nav mx-4 mt-2 flex flex-col gap-1 rounded-2xl p-4 md:hidden"
        >
          {links.map((link) => (
            <button
              key={link.hash}
              onClick={() => goToSection(link.hash)}
              className="rounded-lg px-3 py-2.5 text-left text-sm text-muted hover:bg-white/5 hover:text-ink"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => goToSection('#contact')}
            className="mt-1 rounded-lg bg-gradient-to-r from-violet to-cyan px-3 py-2.5 text-left text-sm font-medium text-void"
          >
            Start a project
          </button>
        </motion.div>
      )}
    </header>
  )
}
