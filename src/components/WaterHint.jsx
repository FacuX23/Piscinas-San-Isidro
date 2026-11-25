import { useRef } from 'react'
import { motion, useAnimationFrame, useInView, useMotionValue, useReducedMotion } from 'motion/react'

// Cartelito "Tocá el agua" que flota en el hero invitando a hacer clic (splash).
//
// - Va dentro del <section> del hero (que debe ser "relative").
// - pointer-events-none: no tapa nada; un clic encima también hace splash en el agua de abajo.
// - El movimiento mezcla varias ondas con velocidades distintas, así que nunca repite el mismo
//   recorrido y vaga para cualquier lado.
// - Se pausa cuando el hero no está en pantalla. Con "reducir movimiento" queda quieto.
//
// Posición: solo se muestra en desktop (md+, >= 768px) y se ubica con left/top en porcentaje
// del hero (ver className). Para moverlo, cambiá md:left-[73%] y md:top-[42%].

export default function WaterHint() {
  const wrapRef = useRef(null)
  const reduce = useReducedMotion()
  const inView = useInView(wrapRef)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotate = useMotionValue(0)

  useAnimationFrame((time) => {
    if (reduce || !inView || window.innerWidth < 768) return
    const s = (time / 1000) * 1.35 // subí o bajá este número para flotar más rápido o más lento
    x.set(Math.sin(s * 0.55) * 34 + Math.sin(s * 0.91 + 1.7) * 18 + Math.sin(s * 0.23 + 4) * 12)
    y.set(Math.sin(s * 0.47 + 0.6) * 26 + Math.sin(s * 0.83 + 2.2) * 14 + Math.sin(s * 0.31) * 10 + Math.sin(s * 1.9) * 3)
    rotate.set(Math.sin(s * 0.42 + 1) * 3.5 + Math.sin(s * 0.77) * 1.5)
  })

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none hidden md:block md:absolute md:top-[42%] md:left-[73%] z-0 md:-translate-x-1/2 md:-translate-y-1/2"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8, type: 'spring', stiffness: 220, damping: 16 }}
      >
        <motion.div
          style={{ x, y, rotate }}
          className="flex items-center gap-2.5 rounded-[20px] bg-white px-5 py-3 text-base font-semibold whitespace-nowrap text-black shadow-[0_12px_32px_rgba(6,43,58,0.35)] md:text-lg"
        >
          <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-[#0b6e99]" fill="currentColor">
            <path d="M12 2.5c3.600 4.200 6.500 7.600 6.500 11.100a6.500 6.500 0 0 1-13 0C5.500 10.100 8.400 6.700 12 2.500Z" />
          </svg>
          Tocá el agua
        </motion.div>
      </motion.div>
    </div>
  )
}