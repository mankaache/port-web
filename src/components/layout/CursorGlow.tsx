import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let targetX = x
    let targetY = y

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }

    const tick = () => {
      x += (targetX - x) * 0.12
      y += (targetY - y) * 0.12
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove)
    raf = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[420px] w-[420px] rounded-full opacity-[0.15] blur-[90px] md:block"
      style={{
        background:
          'radial-gradient(circle, var(--color-violet) 0%, var(--color-cyan) 45%, transparent 70%)',
      }}
    />
  )
}
