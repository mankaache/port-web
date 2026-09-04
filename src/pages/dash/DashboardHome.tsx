import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2, ExternalLink, ImageOff } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { deleteProject } from '@/lib/projects-repo'

export default function DashboardHome() {
  const projects = useProjects()
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return
    setError(null)
    setDeletingSlug(slug)
    try {
      await deleteProject(slug)
    } catch {
      setError('Could not delete that project. Please try again.')
    } finally {
      setDeletingSlug(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-medium text-ink">Projects</h1>
          <p className="mt-1 text-sm text-muted">
            Add, edit, or remove the case studies shown on the site.
          </p>
        </div>
        <Link
          to="/dash/new"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-void"
        >
          <Plus size={16} />
          New project
        </Link>
      </div>

      {error && <p className="mt-6 text-sm text-magenta">{error}</p>}

      <div className="mt-8 overflow-hidden rounded-2xl border border-line/80">
        {projects === null && (
          <div className="p-10 text-center text-sm text-muted">Loading projects…</div>
        )}

        {projects !== null && projects.length === 0 && (
          <div className="p-10 text-center text-sm text-muted">
            No projects yet  add your first one.
          </div>
        )}

        {projects !== null &&
          projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-wrap items-center gap-4 border-b border-line/60 bg-surface/40 p-4 last:border-b-0 sm:flex-nowrap"
            >
              <div
                className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2"
                style={{
                  background: project.coverImage
                    ? undefined
                    : `linear-gradient(135deg, ${project.gradient[0]}33, ${project.gradient[1]}22)`,
                }}
              >
                {project.coverImage ? (
                  <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageOff size={16} className="text-dim" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-base font-medium text-ink">{project.title}</p>
                <p className="truncate text-xs text-dim">
                  {project.categories.join(' · ')}  {project.year}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <a
                  href={`/projects/${project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-ink"
                  title="View on site"
                >
                  <ExternalLink size={15} />
                </a>
                <Link
                  to={`/dash/${project.slug}/edit`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-violet/60 hover:text-ink"
                  title="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(project.slug, project.title)}
                  disabled={deletingSlug === project.slug}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-magenta/60 hover:text-magenta disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
