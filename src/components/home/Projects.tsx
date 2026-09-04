import Reveal from '@/components/ui/Reveal'
import ProjectCard from '@/components/home/ProjectCard'
import { useProjects } from '@/hooks/useProjects'

export default function Projects() {
  const projects = useProjects()

  return (
    <section id="work" className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-dim">Selected work</p>
            <h2 className="max-w-xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
              Real sites, real problems, real numbers.
            </h2>
          </div>
          <p className="max-w-xs text-sm text-muted">
            A handful of recent projects  click through for the thinking, the
            process, and the live result.
          </p>
        </div>
      </Reveal>

      <div className="mt-16 grid gap-8 md:grid-cols-2">
        {projects === null &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[28rem] animate-pulse rounded-3xl border border-line/60 bg-surface/40" />
          ))}

        {projects?.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}

        {projects !== null && projects.length === 0 && (
          <p className="text-sm text-muted">Projects are on the way  check back soon.</p>
        )}
      </div>
    </section>
  )
}
