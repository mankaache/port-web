import { motion } from 'framer-motion'
import { Code2, Search, Wrench } from 'lucide-react'
import Reveal from '@/components/ui/Reveal'

const services = [
  {
    icon: Code2,
    title: 'Build',
    description:
      'Custom-built sites in React, TypeScript and Tailwind  designed and developed from scratch to fit the brand, not the other way around.',
    points: ['Marketing & product sites', 'Headless e-commerce', 'Design systems & component libraries'],
    color: '#a06bff',
  },
  {
    icon: Wrench,
    title: 'Maintain',
    description:
      'Ongoing care so the site keeps running the way it did on launch day  updates, monitoring, and fixes before they become emergencies.',
    points: ['Security & dependency updates', 'Uptime & performance monitoring', 'Content & feature iteration'],
    color: '#4fe3d0',
  },
  {
    icon: Search,
    title: 'Rank',
    description:
      'Technical and content SEO that treats search as an engineering problem  structure, speed, and relevance working together.',
    points: ['Technical SEO audits', 'On-page & local SEO', 'Structured data & analytics'],
    color: '#ff5fb0',
  },
]

export default function Services() {
  return (
    <section id="services" className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-dim">What I do</p>
        <h2 className="max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
          Three disciplines. One person who actually cares about all of them.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {services.map((service, i) => {
          const Icon = service.icon
          return (
            <Reveal key={service.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ type: 'spring', stiffness: 250, damping: 20 }}
                className="glass group relative h-full overflow-hidden rounded-3xl p-8"
              >
                <div
                  className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: service.color }}
                />
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10"
                  style={{ background: `${service.color}1a`, color: service.color }}
                >
                  <Icon size={22} />
                </div>
                <h3 className="font-display text-2xl font-medium text-ink">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{service.description}</p>
                <ul className="mt-6 space-y-2.5 border-t border-line/70 pt-6">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-muted">
                      <span
                        className="mt-1.5 h-1 w-1 shrink-0 rounded-full"
                        style={{ background: service.color }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
