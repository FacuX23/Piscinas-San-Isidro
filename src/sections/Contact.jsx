import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { IconBrandWhatsapp } from '@tabler/icons-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import { SERVICE_OPTIONS, SITE, waLink } from '../data/site'

const field =
  'w-full rounded-2xl border border-profunda/15 bg-white px-4 py-3.5 text-base text-profunda outline-none transition focus:border-venecita focus:ring-4 focus:ring-cristal/25'

export default function Contact() {
  const [service, setService] = useState(SERVICE_OPTIONS[0])
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const text = [
      `Hola, soy ${f.get('nombre')}.`,
      `Me interesa: ${service}.`,
      f.get('mensaje') ? `${f.get('mensaje')}` : '',
      `Mi teléfono: ${f.get('telefono')}`,
    ]
      .filter(Boolean)
      .join('\n')
    window.open(waLink(text), '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  const items = [
    { Icon: Phone, label: SITE.phoneLabel, href: `tel:${SITE.phone}` },
    { Icon: Mail, label: SITE.email, href: `mailto:${SITE.email}` },
    { Icon: MapPin, label: SITE.address },
    { Icon: Clock, label: SITE.hours.join(' · ') },
  ]

  return (
    <Panel id="contacto" tone="dark">
      <SplitText
        text={'¿Listo para\ntu pileta?'}
        className="text-[clamp(2.6rem,8vw,7rem)] leading-[0.92] font-semibold tracking-[-0.035em] [font-stretch:85%]"
      />
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-espuma/75 md:text-xl">
        Contanos qué tenés en mente y coordinamos una visita sin compromiso. Las obras de esta temporada se agendan ahora.
      </p>

      <div className="mt-12 grid gap-4 md:mt-16 md:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col gap-4">
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-4 rounded-panel bg-sol p-6 text-profunda transition-transform duration-300 will-change-transform [backface-visibility:hidden] hover:-translate-y-0.5 md:p-8"
          >
            <span>
              <span className="block text-2xl font-semibold tracking-tight md:text-3xl">Escribinos por WhatsApp</span>
              <span className="mt-1 block text-profunda/70">{SITE.whatsappLabel}</span>
            </span>
            {/* will-change + backface: la capa queda fija en GPU, así al terminar el hover no se re-rasteriza y el ícono no "salta" */}
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-profunda text-sol transition-transform duration-300 will-change-transform [backface-visibility:hidden] group-hover:rotate-12">
              <IconBrandWhatsapp className="size-8" stroke={1.8} />
            </span>
          </a>

          <ul className="space-y-1 rounded-panel bg-white/8 p-4 md:p-6">
            {items.map(({ Icon, label, href }) => (
              <li key={label}>
                {href ? (
                  <a href={href} className="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white/10">
                    <Icon className="size-5 shrink-0 text-cristal" />
                    {label}
                  </a>
                ) : (
                  <div className="flex items-center gap-4 p-3">
                    <Icon className="size-5 shrink-0 text-cristal" />
                    {label}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="min-h-56 flex-1 overflow-clip rounded-panel bg-white/8">
            <iframe
              title="Ubicación de San Isidro Piscinas"
              src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.mapQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full min-h-56 border-0 [filter:saturate(0.8)_contrast(1.05)]"
            />
          </div>
        </div>

        <div className="rounded-panel bg-espuma p-6 text-profunda md:p-10">
          <AnimatePresence mode="wait" initial={false}>
            {sent ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex h-full min-h-96 flex-col items-center justify-center text-center"
              >
                <CheckCircle2 className="size-16 text-venecita" strokeWidth={1.5} />
                <h3 className="mt-5 text-3xl font-semibold tracking-tight">¡Listo!</h3>
                <p className="mt-2 max-w-xs text-profunda/70">
                  Se abrió WhatsApp con tu consulta. Si no se abrió, escribinos directo al {SITE.whatsappLabel}.
                </p>
                <button type="button" onClick={() => setSent(false)} className="mt-6 rounded-full bg-lavada px-5 py-3 font-medium transition-colors hover:bg-cristal/30">
                  Enviar otra consulta
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={onSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col gap-5"
              >
                <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">Pedí tu presupuesto</h3>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Nombre y apellido</span>
                  <input name="nombre" required autoComplete="name" className={field} placeholder="Ej: Mariana Gómez" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Teléfono o WhatsApp</span>
                  <input name="telefono" required type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="Ej: 11 5555-0123" />
                </label>

                <fieldset>
                  <legend className="mb-2 text-sm font-medium">¿Qué necesitás?</legend>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_OPTIONS.map((o) => (
                      <button
                        key={o}
                        type="button"
                        aria-pressed={service === o}
                        onClick={() => setService(o)}
                        className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${service === o ? 'bg-profunda text-espuma' : 'bg-lavada text-profunda hover:bg-cristal/30'}`}
                      >
                        {o}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Contanos tu idea (opcional)</span>
                  <textarea name="mensaje" rows={4} className={`${field} resize-none`} placeholder="Medidas aproximadas, zona, cuándo te gustaría tenerla lista…" />
                </label>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-sol px-7 py-4 text-base font-semibold text-profunda transition-colors hover:bg-profunda hover:text-espuma"
                >
                  Enviar consulta
                  <Send className="size-5" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Panel>
  )
}
