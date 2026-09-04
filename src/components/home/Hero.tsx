import { Suspense, lazy, useState } from 'react'
import type { MouseEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'
import MagneticButton from '@/components/ui/MagneticButton'
import heroPortrait from '@/assets/mankaa-hero.webp'

const HeroCanvas = lazy(() => import('@/components/three/HeroCanvas'))

const words = ['Build.', 'Maintain.', 'Rank.']

function HeroPortrait() {
  const [hovered, setHovered] = useState(false)
  const mouseX = useMotionValue(0.5)
  const mouseY = useMotionValue(0.5)

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 150, damping: 16 })
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 150, damping: 16 })

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width)
    mouseY.set((e.clientY - rect.top) / rect.height)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-[320px] sm:max-w-[380px] lg:mx-0 lg:ml-auto"
    >
      <div
        aria-hidden
        className="animate-blob absolute -inset-10 bg-gradient-to-br from-violet/40 via-cyan/20 to-magenta/35 opacity-70 blur-3xl"
      />

      <div
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false)
          mouseX.set(0.5)
          mouseY.set(0.5)
        }}
        style={{ perspective: 900 }}
        className="animate-float-slow relative"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          className="relative rounded-[2.25rem] bg-gradient-to-br from-violet-light/70 via-cyan/60 to-magenta/70 p-[2px] shadow-[0_30px_80px_-20px_rgba(160,107,255,0.45)]"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2.2rem] bg-surface">
            <img
              src={heroPortrait}
              alt="Portrait of Mankaa Che"
              className="h-full w-full object-cover object-[center_14%] transition-transform duration-700"
              style={{ transform: hovered ? 'scale(1.045)' : 'scale(1)' }}
              fetchPriority="high"
              width={900}
              height={1200}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/85 via-void/0 to-void/0" />
            <div className="grid-overlay pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.1 }}
          className="glass absolute -left-6 bottom-8 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs text-ink sm:-left-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          Available for new projects
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25 }}
          className="glass absolute -right-4 -top-6 rounded-2xl px-4 py-3 text-center sm:-right-8"
        >
          <p className="font-display text-xl font-medium text-gradient">30+</p>
          <p className="text-[10px] uppercase tracking-wide text-dim">sites shipped</p>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20 lg:pt-28 [@media(max-height:640px)]:min-h-0 [@media(max-height:640px)]:pt-24 [@media(max-height:640px)]:pb-12">
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-void via-void/20 to-transparent" />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl gap-16 px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-8">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-4 py-1.5 text-xs text-muted"
          >
            <Sparkles size={13} className="text-violet-light" />
            Freelance web developer & SEO specialist
          </motion.div>

          <h1 className="font-display max-w-4xl text-[15vw] font-medium leading-[0.98] tracking-tight text-ink sm:text-7xl md:text-8xl lg:text-7xl xl:text-8xl">
            {words.map((word, i) => (
              <motion.span
                key={word}
                initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className={`block ${i === 2 ? 'text-gradient' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-8 max-w-lg text-lg text-muted"
          >
            I'm Mankaa Che. I design and build fast websites, keep them running
            smoothly, and make sure the people who need to find them, do 
            through search.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <MagneticButton
              as="a"
              href="#work"
              className="rounded-full bg-ink px-7 py-3.5 text-sm font-medium text-void transition-transform hover:scale-[1.02]"
            >
              View my work
            </MagneticButton>
            <MagneticButton
              as="a"
              href="#contact"
              className="rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-violet/60 hover:bg-violet/10"
            >
              Start a project
            </MagneticButton>
          </motion.div>
        </div>

        <HeroPortrait />
      </div>

      {/* <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs text-dim sm:flex [@media(max-height:640px)]:hidden!"
      >
        <span className="tracking-[0.2em]">SCROLL</span>
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.8, repeat: Infinity }}>
          <ArrowDown size={14} />
        </motion.div>
      </motion.div> */}
    </section>
  )
}
