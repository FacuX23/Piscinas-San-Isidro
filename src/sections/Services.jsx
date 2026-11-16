import { motion } from 'motion/react'
import { ArrowUpRight, Hammer, Layers, Lightbulb, Settings2, Shield, Sun, Thermometer, Wrench, Droplets } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import SpotlightCard from '../components/SpotlightCard'
import Img from '../components/Img'
import { photos } from '../data/images'

const ease = [0.22, 1, 0.36, 1]

const enter = (i = 0) => ({
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.25 },
  transition: { duration: 0.8, ease, delay: i * 0.1 },
})

function Chip({ children, tone = 'light' }) {
  const cls = tone === 'light' ? 'bg-white/15 text-white' : 'bg-profunda/8 text-profunda'
  return <li className={`rounded-full px-3.5 py-1.5 text-sm ${cls}`}>{children}</li>
}

function CardLink({ light }) {
  return (
    <a
      href="#contacto"
      className={`inline-flex items-center gap-1.5 text-sm font-semibold underline-offset-4 hover:underline ${light ? 'text-sol' : 'text-venecita'}`}
    >
      Consultar <ArrowUpRight className="size-4" />
    </a>
  )
}

export default function Services() {
  return (
    <Panel id="servicios" tone="light">
      <div className="grid gap-6 md:grid-cols-[1.7fr_1fr] md:items-end">
        <SplitText
          text="Todo lo que necesita tu pileta, en un solo lugar."
          className="text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
        />
        <p className="max-w-md text-lg leading-relaxed text-profunda/70">
          Desde el primer plano hasta el mantenimiento de todos los meses. Un solo equipo para todo el ciclo de tu pileta.
        </p>
      </div>

      <div className="mt-12 grid gap-3 md:mt-16 md:grid-cols-12 md:gap-4">
        {/* Construcción */}
        <motion.div {...enter(0)} className="md:col-span-7 md:row-span-2">
          <SpotlightCard className="group/card relative flex min-h-[26rem] flex-col justify-end rounded-panel bg-profunda p-6 text-espuma md:h-full md:p-8">
            <Img
              src={photos.loungers}
              alt="Pileta de hormigón con reposeras"
              className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] group-hover/card:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-profunda via-profunda/40 to-transparent" />
            <div className="relative">
              <Hammer className="mb-4 size-8 text-sol" strokeWidth={1.6} />
              <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">Construcción</h3>
              <p className="mt-3 max-w-md text-espuma/80">
                Piletas a medida de hormigón proyectado, fibra de vidrio o revestidas con venecitas. Diseñadas para tu terreno y tu forma de vivir el patio.
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {['Diseño 3D', 'Hormigón proyectado', 'Venecitas', 'Garantía de 10 años'].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </ul>
              <div className="mt-6">
                <CardLink light />
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Mantenimiento */}
        <motion.div {...enter(1)} className="md:col-span-5">
          <SpotlightCard className="h-full rounded-panel bg-profunda p-6 text-espuma md:p-8">
            <div className="relative">
              <Droplets className="mb-4 size-8 text-cristal" strokeWidth={1.6} />
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Mantenimiento</h3>
              <p className="mt-3 text-espuma/75">Abonos mensuales para que tu pileta esté lista cada vez que querés usarla.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {['Limpieza de fondo', 'Tratamiento del agua', 'Control de equipos'].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </ul>
              <div className="mt-6">
                <CardLink light />
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Reformas */}
        <motion.div {...enter(2)} className="md:col-span-5">
          <SpotlightCard className="venecitas h-full rounded-panel p-6 text-espuma md:p-8" color="rgba(255,210,63,0.22)">
            <div className="relative">
              <Layers className="mb-4 size-8 text-sol" strokeWidth={1.6} />
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Reformas</h3>
              <p className="mt-3 text-espuma/85">Renovamos piletas viejas: revestimiento nuevo, impermeabilización, bordes y solárium.</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {['Cambio de revestimiento', 'Impermeabilización', 'Ampliaciones'].map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </ul>
              <div className="mt-6">
                <CardLink light />
              </div>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Equipamiento */}
        <motion.div {...enter(3)} className="md:col-span-12">
          <SpotlightCard className="rounded-panel bg-lavada p-6 md:p-8" color="rgba(11,110,153,0.16)">
            <div className="relative grid gap-8 md:grid-cols-[1fr_2fr] md:items-center">
              <div>
                <Settings2 className="mb-4 size-8 text-venecita" strokeWidth={1.6} />
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Equipamiento</h3>
                <p className="mt-3 text-profunda/70">Instalamos y configuramos los equipos que hacen que la pileta funcione sola.</p>
                <div className="mt-5">
                  <CardLink />
                </div>
              </div>
              <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  [Wrench, 'Bombas y filtros'],
                  [Shield, 'Cloración salina'],
                  [Thermometer, 'Bombas de calor'],
                  [Sun, 'Calefacción solar'],
                  [Lightbulb, 'Iluminación LED'],
                  [Settings2, 'Automatización'],
                ].map(([Icon, label]) => (
                  <li key={label} className="flex items-center gap-3 rounded-2xl bg-espuma px-4 py-3.5 text-sm font-medium md:text-base">
                    <Icon className="size-5 shrink-0 text-venecita" strokeWidth={1.8} />
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>
    </Panel>
  )
}
