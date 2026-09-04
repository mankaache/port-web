import { useEffect, useRef } from 'react'

export interface ScrollState {
  /** 0 at the top of the page, 1 at the bottom. */
  progress: number
  velocity: number
}

/**
 * Tracks scroll position in a mutable ref (not React state) so consumers 
 * typically a useFrame loop  can read the latest value every animation
 * frame without triggering a re-render on every scroll pixel.
 */
export function useScrollProgress() {
  const ref = useRef<ScrollState>({ progress: 0, velocity: 0 })

  useEffect(() => {
    let lastY = window.scrollY
    let lastT = performance.now()

    const read = () => {
      const now = performance.now()
      const y = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, y / maxScroll)) : 0
      const dt = Math.max(1, now - lastT)
      const velocity = (y - lastY) / dt
      ref.current = { progress, velocity }
      lastY = y
      lastT = now
    }

    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  return ref
}
