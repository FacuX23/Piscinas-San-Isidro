import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Droplet, Menu, X } from 'lucide-react'
import { NAV_LINKS } from '../data/site'

export default function Nav() {
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 160 && !open)
  })

  // Marca el link de la sección que está en pantalla
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1))
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  // Bloquea el scroll cuando el menú mobile está abierto
  useEffect(() => {
    if (open) window.__lenis?.stop()
    else window.__lenis?.start()
    document.documentElement.style.overflow = open ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
      window.__lenis?.start()
    }
  }, [open])

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -120 : 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-x-0 top-5 z-50 flex justify-center px-5 md:top-8"
      >
        <nav
          aria-label="Principal"
          className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full border border-white/15 bg-profunda/70 py-2 pr-2 pl-4 text-espuma shadow-[0_8px_30px_rgba(6,43,58,0.25)] backdrop-blur-xl md:w-auto md:max-w-none md:gap-6 md:pl-5"
        >
          <a href="#inicio" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="San Isidro Piscinas, inicio">
            <span className="grid size-8 place-items-center rounded-full bg-sol text-profunda">
              <Droplet className="size-4" strokeWidth={2.5} />
            </span>
            <span className="leading-none">
              San Isidro <span className="font-light text-espuma/70">Piscinas</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((l) => {
              const on = active === l.href.slice(1)
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`rounded-full px-3.5 py-2 text-sm transition-colors ${on ? 'bg-white/15 text-white' : 'text-espuma/75 hover:text-white'}`}
                  >
                    {l.label}
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2">
            <a
              href="#contacto"
              className="rounded-full bg-sol px-4 py-2.5 text-sm font-semibold text-profunda transition hover:bg-white"
            >
              Presupuesto
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid size-10 place-items-center rounded-full bg-white/10 md:hidden"
              aria-label="Abrir menú"
              aria-expanded={open}
            >
              <Menu className="size-5" />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: 'inset(0 0 100% 0 round 20px)' }}
            animate={{ clipPath: 'inset(0 0 0% 0 round 20px)' }}
            exit={{ clipPath: 'inset(0 0 100% 0 round 20px)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-1 z-[60] flex flex-col justify-between rounded-panel bg-profunda p-6 text-espuma"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold tracking-tight">
                San Isidro <span className="font-light text-espuma/70">Piscinas</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid size-10 place-items-center rounded-full bg-white/10"
                aria-label="Cerrar menú"
              >
                <X className="size-5" />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((l, i) => (
                <motion.li
                  key={l.href}
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 text-[clamp(2.2rem,11vw,3.5rem)] leading-tight font-semibold tracking-tight [font-stretch:88%]"
                  >
                    {l.label}
                  </a>
                </motion.li>
              ))}
            </ul>

            <a
              href="#contacto"
              onClick={() => setOpen(false)}
              className="rounded-full bg-sol py-4 text-center text-lg font-semibold text-profunda"
            >
              Pedir presupuesto
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
