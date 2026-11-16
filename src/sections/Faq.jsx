import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Plus } from 'lucide-react'
import Panel from '../components/Panel'
import SplitText from '../components/SplitText'
import { FAQS, waLink } from '../data/site'

export default function Faq() {
  const [open, setOpen] = useState(0)

  return (
    <Panel id="preguntas" tone="light">
      <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:gap-16">
        <div className="md:sticky md:top-28 md:self-start">
          <SplitText
            text={'Preguntas\nfrecuentes.'}
            className="text-[clamp(2.2rem,5.5vw,4.6rem)] leading-[0.98] text-balance font-semibold tracking-[-0.03em] [font-stretch:88%]"
          />
          <p className="mt-6 max-w-sm text-lg leading-relaxed text-profunda/70">
            ¿No encontrás lo que buscás? Escribinos y te respondemos en el día.
          </p>
          <a
            href={waLink('Hola, tengo una consulta sobre piletas.')}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex rounded-full bg-profunda px-6 py-3.5 font-semibold text-espuma transition-colors hover:bg-venecita"
          >
            Preguntar por WhatsApp
          </a>
        </div>

        <ul className="divide-y divide-profunda/10 border-y border-profunda/10">
          {FAQS.map((f, i) => {
            const isOpen = open === i
            return (
              <li key={f.q}>
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-xl font-medium tracking-tight md:text-2xl"
                  >
                    {f.q}
                    <motion.span
                      animate={{ rotate: isOpen ? 135 : 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className={`grid size-10 shrink-0 place-items-center rounded-full transition-colors ${isOpen ? 'bg-sol' : 'bg-lavada'}`}
                    >
                      <Plus className="size-5" />
                    </motion.span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-${i}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-lg leading-relaxed text-profunda/70">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </Panel>
  )
}
