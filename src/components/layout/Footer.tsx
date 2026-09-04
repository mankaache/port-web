import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { GithubIcon, XIcon } from '@/components/ui/SocialIcons'

export default function Footer() {
  const navigate = useNavigate()
  const location = useLocation()

  const goToSection = (hash: string) => {
    if (location.pathname !== '/') {
      navigate('/' + hash)
      return
    }
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="relative z-10 border-t border-line/80">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start justify-between gap-10 border-b border-line/80 pb-16 md:flex-row md:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-dim">Let's talk</p>
            <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              Got a site that needs building,{' '}
              <span className="text-gradient">fixing, or found.</span>
            </h2>
          </div>
          <a
            href="mailto:mankaache10@gmail.com"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-void transition-transform hover:-translate-y-0.5"
          >
            mankaache10@gmail.com
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-sm font-medium text-ink">Mankaa Che</p>
            <p className="mt-1 text-sm text-dim">
              Building, maintaining &amp; growing websites that earn their keep.
            </p>
          </div>

          <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted">
            <button onClick={() => goToSection('#work')} className="hover:text-ink">
              Work
            </button>
            <button onClick={() => goToSection('#services')} className="hover:text-ink">
              Services
            </button>
            <button onClick={() => goToSection('#about')} className="hover:text-ink">
              About
            </button>
            <Link to="/" className="hover:text-ink">
              Home
            </Link>
          </nav>

          <div className="flex items-center gap-4 text-muted">
            <a href="https://github.com/mankaache" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink" aria-label="GitHub">
              <GithubIcon size={18} />
            </a>
            {/* <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink" aria-label="LinkedIn">
              <LinkedinIcon size={18} />
            </a> */}
            <a href="https://x.com/mankaa_designer" target="_blank" rel="noreferrer" className="transition-colors hover:text-ink" aria-label="Twitter">
              <XIcon size={18} />
            </a>
          </div>
        </div>

        <p className="mt-14 text-xs text-dim">
          © {new Date().getFullYear()} Mankaa Che. Designed &amp; built by hand, one component at a time.
        </p>
      </div>
    </footer>
  )
}
