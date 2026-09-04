import { Link } from 'react-router-dom'
import { useSeo } from '@/hooks/useSeo'

export default function NotFound() {
  useSeo({
    title: 'Page not found  Mankaa Che',
    description: "The page you're looking for doesn't exist, or has moved.",
    noindex: true,
  })

  return (
    <section className="flex min-h-[80svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-gradient text-8xl font-medium">404</p>
      <h1 className="mt-6 font-display text-2xl font-medium text-ink">
        This page wandered off somewhere.
      </h1>
      <p className="mt-3 max-w-sm text-sm text-muted">
        The page you're looking for doesn't exist, or has moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-ink px-6 py-3 text-sm font-medium text-void"
      >
        Back to home
      </Link>
    </section>
  )
}
