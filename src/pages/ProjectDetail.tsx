import { useEffect } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, Globe } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'
import MagneticButton from '@/components/ui/MagneticButton'
import { useProjects } from '@/hooks/useProjects'
import { useSeo } from '@/hooks/useSeo'

export default function ProjectDetail() {
  const { slug } = useParams()
  const projects = useProjects()
  const project = projects?.find((p) => p.slug === slug)

  useSeo({
    title: project ? `${project.title}  Mankaa Che` : 'Mankaa Che',
    description: project?.tagline ?? 'Case study by Mankaa Che, freelance web developer and SEO specialist.',
    path: `/projects/${slug ?? ''}`,
    image: project?.coverImage,
    type: 'article',
    noindex: !project,
    jsonLd: project
      ? {
          '@context': 'https://schema.org',
          '@type': 'CreativeWork',
          name: project.title,
          description: project.tagline,
          image: project.coverImage,
          dateCreated: project.year,
          creator: { '@type': 'Person', name: 'Mankaa Che' },
          about: project.overview,
        }
      : undefined,
  })

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [slug])

  if (projects === null) {
    return (
      <div className="flex min-h-[60svh] items-center justify-center text-sm text-muted">
        Loading project…
      </div>
    )
  }

  if (!project) {
    return <Navigate to="/" replace />
  }

  const currentIndex = projects.findIndex((p) => p.slug === project.slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]

  return (
    <article>
      <section className="relative overflow-hidden pt-36 pb-20 sm:pt-44">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-30"
          style={{
            background: `radial-gradient(60% 50% at 50% 0%, ${project.gradient[0]}44, transparent 70%)`,
          }}
        />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <Reveal>
            <Link
              to="/#work"
              className="mb-10 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
            >
              <ArrowLeft size={15} />
              Back to work
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted"
                >
                  {cat}
                </span>
              ))}
              <span className="text-[11px] text-dim">{project.client} · {project.year}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-5xl font-medium leading-[1.05] text-ink sm:text-6xl">
              {project.title}
            </h1>
          </Reveal>

          <Reveal delay={0.18}>
            <p className="mt-6 max-w-2xl text-lg text-muted">{project.tagline}</p>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <MagneticButton
                as="a"
                href={project.liveUrl}
                className="group rounded-full bg-ink px-6 py-3 text-sm font-medium text-void"
              >
                <span className="inline-flex items-center gap-2">
                  <Globe size={15} />
                  Visit live site
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </MagneticButton>
              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span key={tech} className="rounded-full border border-line px-3 py-1.5 text-xs text-muted">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Reveal>
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div
            className="relative flex h-72 items-center justify-center overflow-hidden rounded-3xl border border-line/80 sm:h-[26rem]"
            style={{
              background: `linear-gradient(135deg, ${project.gradient[0]}2e, ${project.gradient[1]}22)`,
            }}
          >
            {project.coverImage ? (
              <img
                src={project.coverImage}
                alt={project.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <motion.div
                animate={{ rotate: [0, 10, -6, 0], scale: [1, 1.05, 0.98, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                className="h-52 w-52 rounded-[40%] opacity-70 blur-3xl sm:h-72 sm:w-72"
                style={{ background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})` }}
              />
            )}
            <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_0%,transparent_100%)]" />
          </div>
        </div>
      </Reveal>

      <section className="relative z-10 mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <div className="grid gap-16 sm:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-dim">Overview</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-ink/90">{project.overview}</p>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-16 border-t border-line/70 pt-16 sm:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="text-sm uppercase tracking-[0.25em] text-dim">The thinking</p>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-lg leading-relaxed text-ink/90">{project.thinking}</p>
          </Reveal>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-20 sm:pb-28">
        <Reveal>
          <p className="mb-10 text-sm uppercase tracking-[0.25em] text-dim">How it was done</p>
        </Reveal>
        <div className="space-y-px overflow-hidden rounded-3xl border border-line/80 bg-line/40">
          {project.process.map((step, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="grid gap-4 bg-surface/60 p-8 sm:grid-cols-[auto_1fr] sm:gap-10 sm:p-10">
                <span className="font-display text-2xl text-dim">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-display text-xl font-medium text-ink">{step.title}</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{step.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-4xl px-6 pb-24 sm:pb-32">
        <Reveal>
          <p className="mb-10 text-sm uppercase tracking-[0.25em] text-dim">Results</p>
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-3">
          {project.results.map((result, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="glass rounded-2xl p-8">
                <p className="text-gradient font-display text-4xl font-medium">{result.value}</p>
                <p className="mt-3 text-sm text-muted">{result.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {projects.length > 1 && (
        <section className="relative z-10 border-t border-line/80">
          <Link to={`/projects/${nextProject.slug}`} className="group block">
            <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-6 px-6 py-16 sm:flex-row sm:items-center sm:py-20">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-dim">Next project</p>
                <h3 className="mt-3 font-display text-3xl font-medium text-ink transition-colors group-hover:text-gradient sm:text-4xl">
                  {nextProject.title}
                </h3>
              </div>
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line text-ink transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                <ArrowUpRight size={18} />
              </span>
            </div>
          </Link>
        </section>
      )}
    </article>
  )
}
