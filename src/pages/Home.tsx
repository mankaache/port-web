import { Suspense, lazy, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '@/components/home/Hero'
import Services from '@/components/home/Services'
import Process from '@/components/home/Process'
import About from '@/components/home/About'
import { useSeo } from '@/hooks/useSeo'

const Projects = lazy(() => import('@/components/home/Projects'))

function ProjectsFallback() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-112 animate-pulse rounded-3xl border border-line/60 bg-surface/40" />
        ))}
      </div>
    </section>
  )
}

const DESCRIPTION =
  'Mankaa Che is a freelance web developer and SEO specialist who builds, maintains, and optimizes fast, search-ready websites.'

export default function Home() {
  const location = useLocation()

  useSeo({
    title: 'Mankaa Che  Web Developer & SEO Specialist',
    description: DESCRIPTION,
    path: '/',
    jsonLd: {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Mankaa Che',
      jobTitle: 'Freelance Web Developer & SEO Specialist',
      description: DESCRIPTION,
      knowsAbout: ['Web development', 'Website maintenance', 'Search engine optimization'],
    },
  })

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash)
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80)
      }
    }
  }, [location.hash])

  return (
    <>
      <Hero />
      <Suspense fallback={<ProjectsFallback />}>
        <Projects />
      </Suspense>
      <Services />
      <Process />
      <About />
    </>
  )
}
