import { useState } from 'react'
import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/data/projects'

interface ProjectCardProps {
  project: Project
  index: number
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [7, -7]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-7, 7]), { stiffness: 200, damping: 20 })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <Link to={`/projects/${project.slug}`} className="block">
      <motion.article
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          mouseX.set(0.5)
          mouseY.set(0.5)
        }}
        style={{ perspective: 1000 }}
        className="group relative"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="glass relative overflow-hidden rounded-3xl"
        >
          <div
            className="relative flex h-64 items-center justify-center overflow-hidden sm:h-80"
            style={{
              background: `linear-gradient(135deg, ${project.gradient[0]}33, ${project.gradient[1]}22)`,
            }}
          >
            {project.coverImage ? (
              <motion.img
                src={project.coverImage}
                alt=""
                animate={{ scale: hovered ? 1.06 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <motion.div
                animate={{ rotate: hovered ? 8 : 0, scale: hovered ? 1.08 : 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-40 w-40 rounded-[40%] opacity-70 blur-2xl sm:h-56 sm:w-56"
                style={{
                  background: `linear-gradient(135deg, ${project.gradient[0]}, ${project.gradient[1]})`,
                }}
              />
            )}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-surface/90 via-transparent to-transparent" />
            <div className="grid-overlay pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_0%,transparent_100%)]" />
            <span
              className="font-display pointer-events-none absolute bottom-5 right-6 text-7xl font-semibold opacity-[0.14] sm:text-8xl"
              style={{ color: project.accent }}
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>

          <div className="p-7 sm:p-8" style={{ transform: 'translateZ(30px)' }}>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              {project.categories.map((cat) => (
                <span
                  key={cat}
                  className="rounded-full border border-line px-2.5 py-1 text-[11px] uppercase tracking-wide text-muted"
                >
                  {cat}
                </span>
              ))}
              <span className="text-[11px] text-dim">{project.year}</span>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h3 className="font-display text-2xl font-medium text-ink sm:text-3xl">
                {project.title}
              </h3>
              <motion.span
                animate={{ x: hovered ? 0 : -6, y: hovered ? 0 : 6, opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ink"
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">{project.tagline}</p>
          </div>
        </motion.div>
      </motion.article>
    </Link>
  )
}
