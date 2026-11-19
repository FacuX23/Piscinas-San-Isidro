import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Box, Droplets, HardHat, Ruler } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import Img from '../components/Img'
import { PROCESS } from '../data/site'
import { photos } from '../data/images'

const ICONS = { Ruler, Box, HardHat, Droplets }

function StepCard({ step, index, total, progress, reduce }) {
  const Icon = ICONS[step.icon]
  // Cada tarjeta se achica un poco cuando la siguiente se apila encima
  const target = 1 - (total - 1 - index) * 0.045
  const scale = useTransform(progress, [index / total, 1], [1, target])

  return (
    <div className="sticky" style={{ top: `${96 + index * 18}px` }}>
      <motion.article
        style={reduce ? undefined : { scale, transformOrigin: 'top center' }}
        className="grid overflow-clip rounded-panel bg-espuma text-profunda shadow-[0_-12px_40px_rgba(6,43,58,0.18)] md:min-h-[22rem] md:grid-cols-[1.1fr_1fr]"
      >
        <div className="flex flex-col justify-between gap-8 p-6 md:p-10">
          <span className="text-6xl font-semibold tracking-tighter text-venecita tabular-nums md:text-8xl">0{index + 1}</span>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight md:text-4xl">{step.title}</h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-profunda/70 md:text-lg">{step.text}</p>
          </div>
        </div>
        <div className="relative aspect-[3/2] overflow-clip bg-profunda md:aspect-auto md:h-full">
          <Img src={photos[step.photo]} alt={step.alt} className="absolute inset-0 size-full object-cover" />
          <span
            aria-hidden="true"
            className="absolute top-4 right-4 grid size-11 place-items-center rounded-full border border-white/20 bg-profunda/65 text-sol backdrop-blur-md"
          >
            <Icon className="size-5" strokeWidth={1.75} />
          </span>
        </div>
      </motion.article>
    </div>
  )
}

export default function Process() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    <Panel id="proceso" tone="blue" reveal={false}>
      <div className="grid gap-6 md:grid-cols-[1.7fr_1fr] md:items-end">
        <SplitText
          text="Así se hace una pileta, de la visita a la primera zambullida."
          className="text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
        />
        <p className="max-w-md text-lg leading-relaxed text-espuma/80">
          Cuatro etapas claras, con una persona de nuestro equipo a cargo de cada una.
        </p>
      </div>

      <div ref={ref} className="mt-12 flex flex-col gap-[14vh] pb-8 md:mt-20">
        {PROCESS.map((step, i) => (
          <StepCard key={step.title} step={step} index={i} total={PROCESS.length} progress={scrollYProgress} reduce={reduce} />
        ))}
      </div>
    </Panel>
  )
}
