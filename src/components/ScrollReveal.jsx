import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)'])
  return (
    <motion.span style={{ opacity, filter: blur }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

// Las palabras se van "encendiendo" a medida que scrolleás (estilo ScrollReveal).
export default function ScrollReveal({ text, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })

  if (reduce) return <p className={className}>{text}</p>

  const words = text.split(' ')
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length
        const end = start + 1 / words.length
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]}>
            {w}
          </Word>
        )
      })}
    </p>
  )
}
