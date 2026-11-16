import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import { TESTIMONIALS } from '../data/site'

const initials = (name) =>
  name
    .split(/\s|y /)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

export default function Testimonials() {
  const [[index, dir], setState] = useState([0, 1])
  const [paused, setPaused] = useState(false)
  const total = TESTIMONIALS.length

  const go = (n) => setState(([i]) => [(i + n + total) % total, n])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => go(1), 7000)
    return () => clearInterval(id)
  }, [paused, index])

  const t = TESTIMONIALS[index]

  // Alto real del contenido de la reseña actual
  const contentRef = useRef(null)
  const [height, setHeight] = useState('auto')
  useLayoutEffect(() => {
    const el = contentRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const h = entry.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight
      setHeight(h)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <Panel id="testimonios" tone="blue">
      <SplitText
        text={'Lo que dicen\nquienes ya la usan.'}
        className="text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
      />

      <div
        className="mt-12 md:mt-16"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* La altura se mide y se anima: al cambiar de reseña el bloque crece/encoge suave en vez de saltar.
            overflow-y: clip recorta solo en vertical, así el deslizamiento lateral y el arrastre no se cortan. */}
        <motion.div
          initial={false}
          animate={{ height }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ overflowX: 'visible', overflowY: 'clip' }}
        >
        <div ref={contentRef} className="relative" aria-live="polite">
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.figure
              key={index}
              custom={dir}
              variants={{
                enter: (d) => ({ opacity: 0, x: d * 60 }),
                center: { opacity: 1, x: 0 },
                exit: (d) => ({ opacity: 0, x: d * -60 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1)
                else if (info.offset.x > 60) go(-1)
              }}
              className="cursor-grab touch-pan-y active:cursor-grabbing"
            >
              <div className="flex gap-1 text-sol" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-5 max-w-4xl text-[clamp(1.5rem,3.4vw,2.8rem)] leading-[1.15] font-medium tracking-tight text-balance">
                {t.text}
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-full bg-sol font-semibold text-profunda">{initials(t.name)}</span>
                <span>
                  <span className="block font-semibold">{t.name}</span>
                  <span className="text-espuma/70">{t.place}</span>
                </span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        </motion.div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex gap-2" role="tablist" aria-label="Elegir testimonio">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Testimonio ${i + 1}`}
                onClick={() => setState([i, i > index ? 1 : -1])}
                className={`h-2 rounded-full transition-all duration-500 ${i === index ? 'w-10 bg-sol' : 'w-2 bg-white/40 hover:bg-white/70'}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Anterior"
              className="grid size-12 place-items-center rounded-full border border-white/30 transition-colors hover:bg-white/15"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Siguiente"
              className="grid size-12 place-items-center rounded-full bg-sol text-profunda transition-colors hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </Panel>
  )
}
