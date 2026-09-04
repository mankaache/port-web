import type { ReactNode, MouseEvent } from 'react'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface MagneticButtonProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  as?: 'button' | 'a'
  href?: string
}

export default function MagneticButton({
  children,
  className = '',
  onClick,
  as = 'button',
  href,
}: MagneticButtonProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    setPos({ x: relX * 0.35, y: relY * 0.45 })
  }

  const reset = () => setPos({ x: 0, y: 0 })

  const inner = (
    <motion.span
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: 'spring', stiffness: 150, damping: 12, mass: 0.4 }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  )

  if (as === 'a') {
    return (
      <a href={href} onMouseMove={handleMove} onMouseLeave={reset} className={`inline-flex ${className}`}>
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={`inline-flex ${className}`}
    >
      {inner}
    </button>
  )
}
