import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { Check } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import ScrollReveal from '../components/ScrollReveal'
import CountUp from '../components/CountUp'
import Img from '../components/Img'
import { STATS, VALUES } from '../data/site'
import { photos } from '../data/images'

export default function About() {
  const imgRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])

  return (
    <Panel id="nosotros" tone="light">
      <SplitText
        text={'Hacemos piletas\ndesde 1995.'}
        className="text-[clamp(2.4rem,7vw,6rem)] leading-[0.95] font-semibold tracking-[-0.035em] [font-stretch:85%]"
      />

      <div className="mt-10 grid gap-10 md:mt-16 md:grid-cols-[1.2fr_1fr] md:gap-16">
        <div>
          <ScrollReveal
            text="Somos una empresa familiar de San Isidro. Combinamos la mano de obra de siempre con técnicas modernas de hormigón proyectado y automatización, y no desaparecemos cuando termina la obra: cada pileta que construimos tiene un técnico asignado."
            className="text-2xl leading-snug font-medium tracking-tight md:text-[2rem]"
          />

          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {VALUES.map((v) => (
              <li key={v} className="flex items-start gap-3 text-profunda/80">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-venecita text-white">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                {v}
              </li>
            ))}
          </ul>
        </div>

        <div ref={imgRef} className="relative aspect-[4/5] overflow-clip rounded-panel bg-profunda">
          <motion.div style={{ y }} className="absolute -inset-[10%]">
            <Img src={photos.house} alt="Casa con pileta construida por nuestro equipo" className="size-full object-cover" />
          </motion.div>
        </div>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-3 md:mt-20 md:grid-cols-4 md:gap-4">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: i * 0.1 }}
            className={`rounded-panel p-5 md:p-7 ${i === 0 ? 'bg-venecita text-espuma' : 'bg-lavada text-profunda'}`}
          >
            <dd className="text-[clamp(2.2rem,5vw,4rem)] leading-none font-semibold tracking-tight">
              <CountUp to={s.to} suffix={s.suffix} />
            </dd>
            <dt className={`mt-3 text-sm md:text-base ${i === 0 ? 'text-espuma/80' : 'text-profunda/70'}`}>{s.label}</dt>
          </motion.div>
        ))}
      </dl>
    </Panel>
  )
}
