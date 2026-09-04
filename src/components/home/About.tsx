import { motion } from 'framer-motion'
import Reveal from '@/components/ui/Reveal'
import aboutPortrait from '@/assets/mankaa-about.webp'

const stats = [
  { value: '30+', label: 'Sites shipped' },
  { value: '5 yrs', label: 'Freelancing' },
  { value: '99.9%', label: 'Avg. client uptime' },
  { value: '4.9/5', label: 'Client rating' },
]

const stack = [
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Next.js',
  'Three.js',
  'Framer Motion',
  'Node.js',
  'Sanity',
  'Shopify',
  'Google Search Console',
]

function AboutPortrait() {
  return (
    <div className="relative mx-auto w-full max-w-70 lg:mx-0">
      <div
        aria-hidden
        className="animate-blob absolute -inset-8 bg-linear-to-br from-cyan/35 via-violet/25 to-magenta/30 opacity-60 blur-3xl [animation-delay:-4s]"
      />
      <div
        aria-hidden
        className="animate-spin-slow pointer-events-none absolute -inset-5 rounded-[45%] border border-dashed border-violet/25"
      />

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="animate-morph relative aspect-4/5 w-full overflow-hidden border border-white/10 bg-surface shadow-[0_25px_70px_-25px_rgba(79,227,208,0.35)]"
      >
        <img
          src={aboutPortrait}
          alt="Mankaa Che at work"
          className="h-full w-full object-cover object-[center_16%]"
          loading="lazy"
          width={760}
          height={1013}
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-void/80 via-void/0 to-transparent" />
      </motion.div>

      <div className="glass absolute -bottom-5 right-2 rounded-2xl px-4 py-3 text-center sm:-right-6">
        <p className="font-display text-lg font-medium text-ink">Mankaa Che</p>
        <p className="text-[10px] uppercase tracking-wide text-dim">Web dev &amp; SEO</p>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <Reveal>
          <AboutPortrait />
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-dim">About</p>
          <h2 className="font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
            I'm Mankaa a one-person studio for people who'd rather not think about their website.
          </h2>
          <div className="mt-8 space-y-5 text-muted">
            <p>
              I've spent the last five years as an independent web developer,
              working directly with founders, small teams, and agencies who
              need a site that's built properly the first time and kept
              that way.
            </p>
            <p>
              My work sits across three things: building new sites from the
              ground up, maintaining and improving sites that already exist,
              and making sure search engines and real people can actually
              find them. Most freelancers pick one. I think all three are the
              same job, just at different points in a site's life.
            </p>
            <p>
              I care about performance and craft in equal measure a site
              that loads instantly but looks forgettable is a wasted
              opportunity, and so is the reverse.
            </p>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.15} className="mt-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -4 }}
              className="glass rounded-2xl p-4 sm:p-6"
            >
              <p className="font-display text-2xl font-medium text-gradient sm:text-3xl lg:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-muted sm:text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="glass mt-4 rounded-2xl p-6">
          <p className="mb-4 text-sm text-muted">Tools &amp; technologies</p>
          <div className="flex flex-wrap gap-2">
            {stack.map((item) => (
              <span
                key={item}
                className="rounded-full border border-line px-3 py-1.5 text-xs text-ink/80"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  )
}
