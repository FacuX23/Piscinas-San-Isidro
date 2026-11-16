import { useRef } from 'react'

// Tarjeta con un haz de luz que sigue al puntero (estilo SpotlightCard).
// Los hijos deben tener "relative" para quedar por encima del haz.
export default function SpotlightCard({ children, className = '', color = 'rgba(47,196,208,0.25)' }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  return (
    <div ref={ref} onPointerMove={onMove} className={`group relative overflow-clip ${className}`}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${color}, transparent 65%)` }}
      />
      {children}
    </div>
  )
}
