import { Suspense, lazy } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'

const ScrollUniverse = lazy(() => import('@/components/three/ScrollUniverse'))

export default function PageBackdrop() {
  const scrollRef = useScrollProgress()

  return (
    <>
      <div className="fixed inset-0 z-0 bg-void" />
      <Suspense fallback={null}>
        <ScrollUniverse scrollRef={scrollRef} />
      </Suspense>
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="animate-blob absolute -left-40 top-[-10%] h-[32rem] w-[32rem] bg-violet/20 blur-[140px]" />
        <div className="animate-blob absolute right-[-15%] top-[20%] h-[28rem] w-[28rem] bg-cyan/10 blur-[140px] [animation-delay:-6s]" />
        <div className="animate-blob absolute bottom-[-15%] left-[20%] h-[26rem] w-[26rem] bg-magenta/10 blur-[150px] [animation-delay:-3s]" />
      </div>
      <div className="grid-overlay pointer-events-none fixed inset-0 z-0 [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="noise-overlay" />
    </>
  )
}
