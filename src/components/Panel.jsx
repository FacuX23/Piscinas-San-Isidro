import { motion } from 'motion/react'

const TONES = {
  light: 'bg-espuma text-profunda',
  dark: 'bg-profunda text-espuma',
  blue: 'bg-venecita text-espuma',
}

// Cada sección es un panel de bordes redondeados (20px) dentro del marco de la página.
// overflow-clip (y no hidden) para que position: sticky siga funcionando adentro.
export default function Panel({ id, tone = 'light', className = '', inner = '', reveal = true, children }) {
  const classes = `relative scroll-mt-1 overflow-clip rounded-panel ${TONES[tone]} ${className}`
  const body = (
    <div className={`mx-auto w-full max-w-7xl px-5 py-16 md:px-12 md:py-28 ${inner}`}>{children}</div>
  )

  if (!reveal) {
    return (
      <section id={id} className={classes}>
        {body}
      </section>
    )
  }

  return (
    <motion.section
      id={id}
      className={classes}
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.06 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      {body}
    </motion.section>
  )
}
