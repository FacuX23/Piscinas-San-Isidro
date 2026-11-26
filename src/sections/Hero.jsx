import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { ArrowUpRight, Images } from 'lucide-react'
import CausticsCanvas from '../components/CausticsCanvas'
import WaterHint from '../components/WaterHint'
import SplitText from '../components/SplitText'
import Magnet from '../components/Magnet'

const CHIPS = ['+45 años de experiencia', '+450 piletas', 'Garantía de 3 años']

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      id="inicio"
      ref={ref}
      className="relative isolate flex min-h-[calc(100svh-0.5rem)] flex-col justify-end overflow-clip rounded-panel bg-profunda text-espuma "
    >
      <CausticsCanvas className="absolute inset-0 -z-20 h-full w-full" />
      <WaterHint />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-profunda/85 via-profunda/10 to-profunda/35" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-profunda/45 to-transparent" />

      <motion.div style={{ y, opacity }} className="will-change-transform mx-auto w-full max-w-7xl px-5 pt-36 pb-8 md:px-12 md:pb-12">
        <SplitText
          as="h1"
          immediate
          delay={0.3}
          stagger={0.08}
          text={'Tu pileta,\nlista antes\ndel calor.'}
          className="text-[clamp(3.6rem,16vw,5.5rem)] leading-[0.88] font-semibold tracking-[-0.035em] [font-stretch:85%] md:text-[clamp(3.1rem,11.5vw,9.5rem)]"
        />

        <div className="mt-8 grid gap-8 md:mt-12 md:grid-cols-[1fr_auto] md:items-end">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="max-w-lg text-lg leading-relaxed text-espuma/85 md:text-xl"
          >
            Diseñamos, construimos y mantenemos piletas en zona norte. Presupuesto por escrito, equipo propio y garantía de 3 años.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.8 }}
            className="flex flex-wrap items-center gap-3"
          >
            <Magnet>
              <a
                href="#contacto"
                className="inline-flex items-center gap-2 rounded-full bg-sol px-7 py-4 text-base font-semibold text-profunda transition-colors hover:bg-white"
              >
                Solicitar presupuesto
                <ArrowUpRight className="size-5" />
              </a>
            </Magnet>
            <a
              href="#proyectos"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-4 text-base font-medium backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              <Images className="size-5" />
              Ver proyectos
            </a>
          </motion.div>
        </div>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="mt-10 flex flex-wrap gap-2"
        >
          {CHIPS.map((c) => (
            <li key={c} className="rounded-full bg-white/15 px-4 py-1.5 text-sm text-espuma/90">
              {c}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  )
}
