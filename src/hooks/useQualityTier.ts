import { useEffect, useState } from 'react'

export type QualityTier = 'high' | 'low'

function computeTier(): QualityTier {
  if (typeof window === 'undefined') return 'high'
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isNarrow = window.innerWidth < 768
  return reducedMotion || isNarrow ? 'low' : 'high'
}

/**
 * A cheap heuristic ("low" on phones or when the OS asks for reduced motion,
 * "high" otherwise) used to scale back particle counts, disable bloom, and
 * cap device pixel ratio on the persistent 3D background, so it stays smooth
 * on the devices most likely to struggle with it.
 */
export function useQualityTier(): QualityTier {
  const [tier, setTier] = useState<QualityTier>(computeTier)

  useEffect(() => {
    const onResize = () => setTier(computeTier())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return tier
}
