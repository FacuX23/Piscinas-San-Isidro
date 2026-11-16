import { useRef } from 'react'
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { Droplet } from 'lucide-react'

const wrap = (min, max, v) => {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

// Cinta de texto que se acelera (y cambia de sentido) con la velocidad del scroll (estilo ScrollVelocity).
export default function Marquee({ items, speed = 2.2 }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const boost = useTransform(smooth, [0, 1000], [0, 5], { clamp: false })
  const direction = useRef(1)
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = direction.current * speed * (delta / 1000)
    const b = boost.get()
    if (b < -0.05) direction.current = -1
    else if (b > 0.05) direction.current = 1
    move += direction.current * Math.abs(move) * Math.abs(b)
    baseX.set(baseX.get() + move)
  })

  const row = (suffix) => (
    <div className="flex shrink-0 items-center" aria-hidden={suffix === 'b' ? 'true' : undefined}>
      {items.map((item) => (
        <span key={`${suffix}-${item}`} className="flex items-center">
          <span className="px-6 text-[clamp(1.6rem,3.2vw,2.6rem)] font-medium tracking-tight whitespace-nowrap md:px-9">{item}</span>
          <Droplet className="size-5 shrink-0 text-cristal" strokeWidth={2.2} />
        </span>
      ))}
    </div>
  )

  return (
    <div className="overflow-clip rounded-panel bg-profunda py-6 text-espuma md:py-8">
      <motion.div style={{ x }} className="flex w-max">
        {row('a')}
        {row('b')}
      </motion.div>
    </div>
  )
}
