import { motion } from 'motion/react'
import { NAV_LINKS, SITE } from '../data/site'

export default function Footer() {
  return (
    <footer className="relative overflow-clip rounded-panel bg-profunda text-espuma">
      <div className="mx-auto w-full max-w-7xl px-5 pt-14 md:px-12 md:pt-20">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <p className="max-w-sm text-lg leading-relaxed text-espuma/75">
            Diseño, construcción y mantenimiento de piletas desde 1995. Zona norte del Gran Buenos Aires.
          </p>

          <nav aria-label="Secciones">
            <h2 className="font-semibold">Secciones</h2>
            <ul className="mt-4 space-y-2 text-espuma/75">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-sol">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-semibold">Seguinos</h2>
            <ul className="mt-4 space-y-2 text-espuma/75">
              <li>
                <a href={SITE.instagram} className="transition-colors hover:text-sol">
                  Instagram
                </a>
              </li>
              <li>
                <a href={SITE.facebook} className="transition-colors hover:text-sol">
                  Facebook
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-espuma/60 md:flex-row md:justify-between">
          <p>© {SITE.year} San Isidro Piscinas. Todos los derechos reservados.</p>
          <ul className="flex gap-5">
            <li>
              <a href="#" className="hover:text-sol">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-sol">
                Términos y condiciones
              </a>
            </li>
          </ul>
        </div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ y: '18%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none mt-10 px-3 select-none md:mt-14"
      >
        {/* textLength estira las letras hasta ocupar todo el ancho: queda alargado y recortado abajo */}
        <svg viewBox="0 0 1000 300" className="block h-auto w-full" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="wordmark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2fc4d0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0b6e99" stopOpacity="0.12" />
            </linearGradient>
          </defs>
          <text
            x="0"
            y="320"
            textLength="1000"
            lengthAdjust="spacingAndGlyphs"
            fill="url(#wordmark)"
            fontFamily="'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif"
            fontWeight="800"
            fontSize="440"
          >
            SAN ISIDRO
          </text>
        </svg>
      </motion.div>
    </footer>
  )
}
