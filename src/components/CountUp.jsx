import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

export default function CountUp({ to, suffix = '', prefix = '', duration = 2.2, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [value, setValue] = useState(reduce ? to : 0)

  useEffect(() => {
    if (!inView || reduce) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    })
    return () => controls.stop()
  }, [inView, reduce, to, duration])

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value.toLocaleString('es-AR')}
      {suffix}
    </span>
  )
}
