import { useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

// El contenido se "pega" levemente al puntero (estilo Magnet). Solo con mouse.
export default function Magnet({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.3 })

  const onMove = (e) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div className={`-m-4 inline-block p-4 ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      <motion.div ref={ref} style={{ x: sx, y: sy }} className="inline-block">
        {children}
      </motion.div>
    </div>
  )
}
