import Reveal from '@/components/ui/Reveal'

const steps = [
  {
    number: '01',
    title: 'Understand',
    body: 'Every project starts with the business, not the design  goals, users, and what "success" actually looks like in numbers.',
  },
  {
    number: '02',
    title: 'Design & build',
    body: 'I design in the browser as much as possible, iterating on real components rather than static mockups that never quite translate.',
  },
  {
    number: '03',
    title: 'Optimize',
    body: 'Performance and SEO are built in from the start  structured data, clean markup, and a JS budget that respects the visitor.',
  },
  {
    number: '04',
    title: 'Support',
    body: 'Launch is the beginning, not the end. I stay on to maintain, monitor, and keep improving the site as the business grows.',
  },
]

export default function Process() {
  return (
    <section id="process" className="relative z-10 mx-auto max-w-6xl px-6 py-28 sm:py-36">
      <Reveal>
        <p className="mb-4 text-sm uppercase tracking-[0.25em] text-dim">How it works</p>
        <h2 className="max-w-2xl font-display text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">
          A process built for sites that need to last, not just launch.
        </h2>
      </Reveal>

      <div className="mt-16 grid gap-px overflow-hidden rounded-3xl border border-line/80 bg-line/40 md:grid-cols-4">
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.08} className="h-full">
            <div className="group h-full bg-surface/60 p-8 transition-colors hover:bg-surface-2/80">
              <span className="font-display text-sm text-dim">{step.number}</span>
              <h3 className="mt-6 font-display text-xl font-medium text-ink">{step.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
