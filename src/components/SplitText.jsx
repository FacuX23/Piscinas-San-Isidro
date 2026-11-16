import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'motion/react'

// Titular que entra palabra por palabra desde una máscara (estilo SplitText).
// Usá \n para forzar saltos de línea.
// Se observa el contenedor (no cada palabra): una palabra recortada por su máscara
// nunca "entra" en pantalla para el observador.
export default function SplitText({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.06,
  immediate = false, // true: anima al montar (hero). false: al entrar en pantalla.
}) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const seen = useInView(ref, { once: true, amount: 0.4 })
  const plain = text.replace(/\n/g, ' ')

  if (reduce) {
    return <Tag className={className}>{plain}</Tag>
  }

  const show = immediate || seen
  let index = 0
  const lines = text.split('\n')

  return (
    <Tag ref={ref} className={className} aria-label={plain}>
      {lines.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.split(' ').map((word, wi, arr) => {
            const i = index++
            return (
              <span key={wi}>
                <span className="inline-block overflow-hidden align-bottom px-[0.12em] -mx-[0.12em] py-[0.22em] -my-[0.22em]">
                  <motion.span
                    className="inline-block will-change-transform"
                    initial={{ y: '150%', rotate: 5 }}
                    animate={show ? { y: '0%', rotate: 0 } : { y: '150%', rotate: 5 }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: delay + i * stagger }}
                    style={{ transformOrigin: 'left bottom' }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < arr.length - 1 ? ' ' : null}
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
