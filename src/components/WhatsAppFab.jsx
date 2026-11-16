import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { MessageCircle } from 'lucide-react'
import { waLink } from '../data/site'

export default function WhatsAppFab() {
  const [show, setShow] = useState(false)
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', (y) => setShow(y > 500))

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={waLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribinos por WhatsApp"
          initial={{ scale: 0, rotate: -40 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 40 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 20 }}
          className="fixed right-5 bottom-5 z-40 grid size-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_10px_30px_rgba(6,43,58,0.35)] md:right-8 md:bottom-8"
        >
          <MessageCircle className="size-7" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
