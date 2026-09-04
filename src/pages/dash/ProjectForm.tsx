import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2, UploadCloud, X } from 'lucide-react'
import { useProjects } from '@/hooks/useProjects'
import { createProject, updateProject, type ProjectInput } from '@/lib/projects-repo'
import { isCloudinaryConfigured, uploadImage } from '@/lib/cloudinary'
import type { ProjectCategory, ProjectResult, ProjectStep } from '@/data/projects'

const ALL_CATEGORIES: ProjectCategory[] = ['Build', 'Maintain', 'SEO']

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}

interface FormState {
  slug: string
  title: string
  client: string
  year: string
  tagline: string
  categories: ProjectCategory[]
  stackText: string
  liveUrl: string
  gradientFrom: string
  gradientTo: string
  accent: string
  overview: string
  thinking: string
  process: ProjectStep[]
  results: ProjectResult[]
  coverImage: string
}

const emptyForm: FormState = {
  slug: '',
  title: '',
  client: '',
  year: String(new Date().getFullYear()),
  tagline: '',
  categories: [],
  stackText: '',
  liveUrl: '',
  gradientFrom: '#a06bff',
  gradientTo: '#4fe3d0',
  accent: '#a06bff',
  overview: '',
  thinking: '',
  process: [],
  results: [],
  coverImage: '',
}

const inputClass =
  'w-full rounded-xl border border-line bg-surface px-3.5 py-2.5 text-sm text-ink outline-none focus:border-violet/60'
const labelClass = 'mb-1.5 block text-xs text-muted'
const cardClass = 'glass rounded-2xl p-6'

export default function ProjectForm() {
  const { slug: paramSlug } = useParams()
  const isEditing = Boolean(paramSlug)
  const navigate = useNavigate()
  const projects = useProjects()
  const existing = paramSlug ? projects?.find((p) => p.slug === paramSlug) : undefined

  const [form, setForm] = useState<FormState>(emptyForm)
  const [slugTouched, setSlugTouched] = useState(false)
  const [initialized, setInitialized] = useState(!isEditing)
  const [notFound, setNotFound] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isEditing || initialized) return
    if (projects === null) return
    if (!existing) {
      setNotFound(true)
      return
    }
    setForm({
      slug: existing.slug,
      title: existing.title,
      client: existing.client,
      year: existing.year,
      tagline: existing.tagline,
      categories: existing.categories,
      stackText: existing.stack.join(', '),
      liveUrl: existing.liveUrl,
      gradientFrom: existing.gradient[0],
      gradientTo: existing.gradient[1],
      accent: existing.accent,
      overview: existing.overview,
      thinking: existing.thinking,
      process: existing.process,
      results: existing.results,
      coverImage: existing.coverImage ?? '',
    })
    setInitialized(true)
  }, [isEditing, initialized, projects, existing])

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const toggleCategory = (category: ProjectCategory) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }))
  }

  const handleTitleChange = (value: string) => {
    set('title', value)
    if (!isEditing && !slugTouched) {
      set('slug', slugify(value))
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    setUploading(true)
    try {
      const url = await uploadImage(file)
      set('coverImage', url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const updateStep = (index: number, key: keyof ProjectStep, value: string) => {
    setForm((prev) => ({
      ...prev,
      process: prev.process.map((step, i) => (i === index ? { ...step, [key]: value } : step)),
    }))
  }
  const addStep = () =>
    setForm((prev) => ({ ...prev, process: [...prev.process, { title: '', body: '' }] }))
  const removeStep = (index: number) =>
    setForm((prev) => ({ ...prev, process: prev.process.filter((_, i) => i !== index) }))

  const updateResult = (index: number, key: keyof ProjectResult, value: string) => {
    setForm((prev) => ({
      ...prev,
      results: prev.results.map((result, i) => (i === index ? { ...result, [key]: value } : result)),
    }))
  }
  const addResult = () =>
    setForm((prev) => ({ ...prev, results: [...prev.results, { label: '', value: '' }] }))
  const removeResult = (index: number) =>
    setForm((prev) => ({ ...prev, results: prev.results.filter((_, i) => i !== index) }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.title.trim() || !form.slug.trim()) {
      setError('Title and slug are required.')
      return
    }
    if (form.categories.length === 0) {
      setError('Select at least one category.')
      return
    }
    if (!isEditing && projects?.some((p) => p.slug === form.slug)) {
      setError('That slug is already used by another project  please choose a different one.')
      return
    }

    const payload: ProjectInput = {
      title: form.title.trim(),
      client: form.client.trim(),
      year: form.year.trim(),
      tagline: form.tagline.trim(),
      categories: form.categories,
      stack: form.stackText.split(',').map((s) => s.trim()).filter(Boolean),
      liveUrl: form.liveUrl.trim(),
      gradient: [form.gradientFrom, form.gradientTo],
      accent: form.accent,
      overview: form.overview.trim(),
      thinking: form.thinking.trim(),
      process: form.process.filter((step) => step.title.trim() || step.body.trim()),
      results: form.results.filter((result) => result.label.trim() || result.value.trim()),
      ...(form.coverImage ? { coverImage: form.coverImage } : {}),
    }

    setSaving(true)
    try {
      if (isEditing && paramSlug) {
        await updateProject(paramSlug, payload)
      } else {
        await createProject(form.slug.trim(), payload)
      }
      navigate('/dash')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong while saving.')
    } finally {
      setSaving(false)
    }
  }

  if (notFound) {
    return (
      <div className="text-center text-sm text-muted">
        <p>That project doesn't exist.</p>
        <Link to="/dash" className="mt-4 inline-block text-ink underline">
          Back to projects
        </Link>
      </div>
    )
  }

  if (isEditing && !initialized) {
    return <p className="text-sm text-muted">Loading project…</p>
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium text-ink">
          {isEditing ? `Edit ${existing?.title ?? ''}` : 'New project'}
        </h1>
        <Link to="/dash" className="text-sm text-muted hover:text-ink">
          Cancel
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-magenta/40 bg-magenta/10 px-4 py-3 text-sm text-magenta">
          {error}
        </div>
      )}

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-base font-medium text-ink">Basics</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Title</label>
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug (used in the URL)</label>
            <input
              className={`${inputClass} ${isEditing ? 'opacity-60' : ''}`}
              value={form.slug}
              disabled={isEditing}
              onChange={(e) => {
                setSlugTouched(true)
                set('slug', slugify(e.target.value))
              }}
              required
            />
          </div>
          <div>
            <label className={labelClass}>Client</label>
            <input className={inputClass} value={form.client} onChange={(e) => set('client', e.target.value)} />
          </div>
          <div>
            <label className={labelClass}>Year</label>
            <input className={inputClass} value={form.year} onChange={(e) => set('year', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Live site URL</label>
            <input
              type="url"
              placeholder="https://"
              className={inputClass}
              value={form.liveUrl}
              onChange={(e) => set('liveUrl', e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={labelClass}>Tagline (shown on the project card)</label>
            <textarea
              rows={2}
              className={inputClass}
              value={form.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Categories</label>
          <div className="flex gap-2">
            {ALL_CATEGORIES.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                  form.categories.includes(category)
                    ? 'border-violet/60 bg-violet/15 text-ink'
                    : 'border-line text-muted hover:text-ink'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClass}>Tech stack (comma separated)</label>
          <input
            className={inputClass}
            placeholder="React, TypeScript, Tailwind CSS"
            value={form.stackText}
            onChange={(e) => set('stackText', e.target.value)}
          />
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-base font-medium text-ink">Cover image</h2>
        {!isCloudinaryConfigured && (
          <p className="mb-4 text-xs text-amber">
            Cloudinary isn't configured yet  see /dash/setup. You can still save the project without an image.
          </p>
        )}
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-surface-2">
            {form.coverImage ? (
              <img src={form.coverImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <UploadCloud size={20} className="text-dim" />
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 text-sm text-ink transition-colors hover:border-violet/60 hover:bg-violet/10">
              <UploadCloud size={15} />
              {uploading ? 'Uploading…' : form.coverImage ? 'Replace image' : 'Upload image'}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading || !isCloudinaryConfigured}
                onChange={handleFileChange}
              />
            </label>
            {form.coverImage && (
              <button
                type="button"
                onClick={() => set('coverImage', '')}
                className="inline-flex w-fit items-center gap-1.5 text-xs text-dim hover:text-magenta"
              >
                <X size={12} />
                Remove image
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-base font-medium text-ink">Accent colors</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Gradient start</label>
            <input
              type="color"
              className="h-11 w-full rounded-xl border border-line bg-surface"
              value={form.gradientFrom}
              onChange={(e) => set('gradientFrom', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Gradient end</label>
            <input
              type="color"
              className="h-11 w-full rounded-xl border border-line bg-surface"
              value={form.gradientTo}
              onChange={(e) => set('gradientTo', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Accent</label>
            <input
              type="color"
              className="h-11 w-full rounded-xl border border-line bg-surface"
              value={form.accent}
              onChange={(e) => set('accent', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className="mb-5 font-display text-base font-medium text-ink">The case study</h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Overview</label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.overview}
              onChange={(e) => set('overview', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>The thinking</label>
            <textarea
              rows={4}
              className={inputClass}
              value={form.thinking}
              onChange={(e) => set('thinking', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-base font-medium text-ink">Process steps</h2>
          <button
            type="button"
            onClick={addStep}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <Plus size={15} />
            Add step
          </button>
        </div>
        <div className="space-y-4">
          {form.process.map((step, i) => (
            <div key={i} className="rounded-xl border border-line/70 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <input
                  className={inputClass}
                  placeholder="Step title"
                  value={step.title}
                  onChange={(e) => updateStep(i, 'title', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="shrink-0 text-dim hover:text-magenta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
              <textarea
                rows={2}
                className={inputClass}
                placeholder="What happened in this step"
                value={step.body}
                onChange={(e) => updateStep(i, 'body', e.target.value)}
              />
            </div>
          ))}
          {form.process.length === 0 && <p className="text-sm text-dim">No steps yet.</p>}
        </div>
      </div>

      <div className={cardClass}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-base font-medium text-ink">Results</h2>
          <button
            type="button"
            onClick={addResult}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
          >
            <Plus size={15} />
            Add result
          </button>
        </div>
        <div className="space-y-3">
          {form.results.map((result, i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
              <input
                className={inputClass}
                placeholder="Value, e.g. +68%"
                value={result.value}
                onChange={(e) => updateResult(i, 'value', e.target.value)}
              />
              <div className="flex items-center gap-3">
                <input
                  className={inputClass}
                  placeholder="Label, e.g. Organic traffic"
                  value={result.label}
                  onChange={(e) => updateResult(i, 'label', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeResult(i)}
                  className="shrink-0 text-dim hover:text-magenta"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
          {form.results.length === 0 && <p className="text-sm text-dim">No results yet.</p>}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <Link to="/dash" className="rounded-full border border-line px-5 py-2.5 text-sm text-ink">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={saving || uploading}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-void disabled:opacity-60"
        >
          {saving ? 'Saving…' : isEditing ? 'Save changes' : 'Create project'}
        </button>
      </div>
    </form>
  )
}
