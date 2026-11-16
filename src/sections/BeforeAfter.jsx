import { useEffect, useRef, useState } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'
import { ChevronsLeftRight } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import Img from '../components/Img'
import { photos } from '../data/images'

// Comparador antes / después. El "antes" es una simulación con filtros CSS sobre la misma foto.
// Cuando el cliente tenga fotos reales, reemplazar BEFORE y AFTER por dos imágenes distintas.
const AFTER = photos.house
const BEFORE = photos.house

export default function BeforeAfter() {
  const wrap = useRef(null)
  const dragging = useRef(false)
  const [pos, setPos] = useState(50)
  const reduce = useReducedMotion()
  const inView = useInView(wrap, { once: true, amount: 0.5 })

  // Pequeño barrido inicial para que se note que es interactivo
  useEffect(() => {
    if (!inView || reduce) return
    const c = animate(92, 50, { duration: 1.6, ease: [0.22, 1, 0.36, 1], onUpdate: setPos })
    return () => c.stop()
  }, [inView, reduce])

  const move = (clientX) => {
    const r = wrap.current.getBoundingClientRect()
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)))
  }

  const onKey = (e) => {
    if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 5))
    if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 5))
  }

  return (
    <Panel id="reformas" tone="dark">
      <div className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:items-center md:gap-14">
        <div>
          <SplitText
            text="De la pileta cansada a la que querés mostrar."
            className="text-[clamp(2.2rem,5vw,4.2rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
          />
          <p className="mt-6 max-w-md text-lg leading-relaxed text-espuma/75">
            Venecitas rotas, filtraciones, bordes gastados. Renovamos el revestimiento, impermeabilizamos y actualizamos los equipos sin rehacer toda la obra.
          </p>
          <ul className="mt-6 space-y-2 text-espuma/90">
            {['Cambio de revestimiento', 'Impermeabilización', 'Bordes y solárium nuevos', 'Iluminación LED y automatización'].map((t) => (
              <li key={t} className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-sol" />
                {t}
              </li>
            ))}
          </ul>
          <a
            href="#contacto"
            className="mt-8 inline-flex rounded-full bg-sol px-6 py-3.5 font-semibold text-profunda transition-colors hover:bg-white"
          >
            Consultar por una reforma
          </a>
        </div>

        <div
          ref={wrap}
          className="relative aspect-[4/3] touch-pan-y overflow-clip rounded-panel select-none md:aspect-[16/11]"
          onPointerDown={(e) => {
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            move(e.clientX)
          }}
          onPointerMove={(e) => dragging.current && move(e.clientX)}
          onPointerUp={() => (dragging.current = false)}
          onPointerCancel={() => (dragging.current = false)}
        >
          <Img src={AFTER} alt="Pileta reformada" className="absolute inset-0 size-full object-cover" draggable={false} />

          <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
            <Img
              src={BEFORE}
              alt="Pileta antes de la reforma"
              className="absolute inset-0 size-full object-cover [filter:grayscale(0.8)_sepia(0.35)_hue-rotate(35deg)_brightness(0.75)_contrast(0.9)]"
              draggable={false}
            />
            <div className="absolute inset-0 bg-[#3d5a2a]/25" />
          </div>

          <span className="pointer-events-none absolute top-4 left-4 rounded-full bg-profunda/70 px-3.5 py-1.5 text-sm backdrop-blur-md">Antes</span>
          <span className="pointer-events-none absolute top-4 right-4 rounded-full bg-sol px-3.5 py-1.5 text-sm font-semibold text-profunda">Después</span>

          <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white" style={{ left: `${pos}%` }}>
            <button
              type="button"
              role="slider"
              aria-label="Comparar antes y después"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(pos)}
              onKeyDown={onKey}
              className="pointer-events-auto absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-profunda shadow-xl"
            >
              <ChevronsLeftRight className="size-6" />
            </button>
          </div>
        </div>
      </div>
    </Panel>
  )
}
