import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { MapPin } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import Img from '../components/Img'
import { PROJECTS } from '../data/site'
import { photos } from '../data/images'

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'residencial', label: 'Residenciales' },
  { id: 'comercial', label: 'Comerciales' },
]

export default function Projects() {
  const [filter, setFilter] = useState('todos')
  const list = PROJECTS.filter((p) => filter === 'todos' || p.type === filter)

  return (
    <Panel id="proyectos" tone="light">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <SplitText
          text={'Obras que ya\nestán en uso.'}
          className="text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
        />
        <div role="tablist" aria-label="Filtrar proyectos" className="flex gap-1 self-start rounded-full bg-lavada p-1">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors md:px-5"
            >
              {filter === f.id && (
                <motion.span
                  layoutId="project-filter"
                  className="absolute inset-0 rounded-full bg-profunda"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                />
              )}
              <span className={`relative ${filter === f.id ? 'text-espuma' : 'text-profunda/70'}`}>{f.label}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.ul layout className="mt-10 grid gap-3 sm:grid-cols-2 md:mt-14 md:gap-4 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.li
              key={p.title}
              layout
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[4/5] overflow-clip rounded-panel bg-profunda"
            >
              <Img
                src={photos[p.photo]}
                alt={`${p.title}, ${p.place}`}
                className="absolute inset-0 size-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-profunda/90 via-profunda/15 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 text-espuma md:p-6">
                <p className="flex items-center gap-1.5 text-sm text-espuma/80">
                  <MapPin className="size-4" />
                  {p.place}
                </p>
                <h3 className="mt-1 text-2xl font-semibold tracking-tight">{p.title}</h3>
                <div className="grid grid-rows-[1fr] transition-all duration-500 md:grid-rows-[0fr] md:group-hover:grid-rows-[1fr] md:group-focus-within:grid-rows-[1fr]">
                  <ul className="flex flex-wrap gap-2 overflow-hidden pt-3">
                    {[p.size, p.detail, p.year].map((t) => (
                      <li key={t} className="rounded-full bg-white/15 px-3 py-1 text-xs backdrop-blur-md">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </Panel>
  )
}
