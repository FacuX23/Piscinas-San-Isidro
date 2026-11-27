import { motion, useReducedMotion } from 'motion/react'
import aro from '../data/juguete_aro.webp'
import pelota from '../data/juguete_pelota.webp'
import pistola from '../data/juguete_pistola.webp'

// Los 3 juguetes que flotan apenitas hundidos sobre el agua del hero.
//
// Todos comparten exactamente las mismas 3 capas visuales que la pelota:
//   1. Sombra proyectada profunda dentro del agua (con parallax suave)
//   2. Reflejo / continuación sumergida del propio objeto (sus colores oscurecidos y difusos bajo la línea de agua)
//   3. Corte suave en la línea de flotación + un filito de menisco muy sutil y difuminado justo sobre ese corte
//
// Posición y tamaño: cada juguete tiene dos juegos de clases, mobile (sin prefijo) y desktop (md:).
//   left / top / right / bottom -> dónde está, en % del hero
//   w                           -> ancho, en % del hero
// Para moverlos o agrandarlos tocá solo esas clases en el arreglo TOYS.

const BALL_WATERLINE_MASK =
  'radial-gradient(63% 61% at 51.4% 33.5%, #000 81%, rgba(0,0,0,0.82) 86%, rgba(0,0,0,0.32) 92.5%, transparent 98.5%)'

// Corta el ~8-9% inferior del salvavidas siguiendo su óvalo para dejar ver debajo su reflejo azul y blanco en el agua
const RING_WATERLINE_MASK =
  'radial-gradient(50.5% 50.5% at 51.4% 38.5%, #000 80%, rgba(0,0,0,0.82) 85.5%, rgba(0,0,0,0.3) 92%, transparent 98%)'

// Desvanece apenas el último 4% del contenedor para evitar corte brusco si el reflejo toca el borde inferior
const REFLECTION_FADE_MASK =
  'linear-gradient(to bottom, #000 88%, rgba(0,0,0,0.75) 95%, transparent 100%)'

const TOYS = [
  {
    key: 'aro',
    src: aro,
    pos: 'top-[8.5%] -right-[12%] w-[40%] md:top-[9%] md:-right-[5.7%] md:w-[27%]',
    ratio: 1000 / 665,
    float: { y: 9, rotate: 1.4, duration: 7.2, delay: 0 },
    enter: 1.0,
    deepShadow: { x: '-3.5%', y: '13%', scale: 0.98, opacity: 0.42, blur: 'blur-[10px] md:blur-[15px]' },
    reflectionClass: 'translate-y-[3.2%] scale-x-[1.01] opacity-38 blur-[2.5px] brightness-[0.55] saturate-150',
    mask: RING_WATERLINE_MASK,
    Pocket: RingWaterPocket,
    MeniscusOverlay: RingMeniscusLine,
    rotateIndependent: false,
  },
  {
    key: 'pelota',
    src: pelota,
    pos: 'top-[73%] right-[6%] w-[21%] md:top-[43%] md:right-auto md:left-[51.5%] md:w-[15.2%]',
    ratio: 700 / 628,
    float: { y: 7, rotate: 3, duration: 5.6, delay: 0.9 },
    enter: 1.2,
    deepShadow: { x: '-4%', y: '14%', scale: 0.92, opacity: 0.46, blur: 'blur-[10px] md:blur-[15px]' },
    reflectionClass: 'translate-y-[1.5%] scale-x-[1.015] opacity-32 blur-[2px] brightness-50 saturate-150',
    mask: BALL_WATERLINE_MASK,
    Pocket: BallWaterPocket,
    MeniscusOverlay: null,
    rotateIndependent: true,
  },
  {
    key: 'pistola',
    src: pistola,
    pos: 'top-[10%] -left-[3%] w-[33%] md:top-[56.5%] md:left-auto md:right-[2.5%] md:w-[21.6%]',
    ratio: 1000 / 630,
    float: { y: 8, rotate: 1.8, duration: 6.4, delay: 1.7 },
    enter: 1.4,
    deepShadow: { x: '-4%', y: '11%', scale: 0.99, opacity: 0.44, blur: 'blur-[9px] md:blur-[14px]' },
    reflectionClass: 'translate-y-[4.2%] scale-x-[1.008] opacity-40 blur-[2.5px] brightness-[0.55] saturate-150',
    svgMasked: true,
    Pocket: GunWaterPocket,
    MeniscusOverlay: GunMeniscusLine,
    rotateIndependent: false,
  },
]

function SharedWaterDefs() {
  return (
    <svg aria-hidden="true" width="0" height="0" className="pointer-events-none absolute">
      <defs>
        <radialGradient id="toy-water-pocket" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#021923" stopOpacity="0.74" />
          <stop offset="56%" stopColor="#032838" stopOpacity="0.4" />
          <stop offset="84%" stopColor="#053b4e" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#053b4e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="toy-meniscus-crest" x1="5%" y1="35%" x2="95%" y2="60%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="18%" stopColor="#e4fbff" stopOpacity="0.44" />
          <stop offset="48%" stopColor="#b8f4fd" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#e4fbff" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="toy-meniscus-inner" x1="8%" y1="30%" x2="92%" y2="55%">
          <stop offset="0%" stopColor="#d8f9ff" stopOpacity="0" />
          <stop offset="16%" stopColor="#e8fcff" stopOpacity="0.46" />
          <stop offset="45%" stopColor="#aef2fc" stopOpacity="0.22" />
          <stop offset="72%" stopColor="#9ceef9" stopOpacity="0.2" />
          <stop offset="86%" stopColor="#e8fcff" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#d8f9ff" stopOpacity="0" />
        </linearGradient>

        {/* Blur para viewBox chico (240px de la pelota) */}
        <filter id="toy-meniscus-blur-sm" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.85" />
        </filter>
        {/* Blur equivalente escalado a viewBox de 1000px (aro y pistola) para que sea igual de suave y sutil */}
        <filter id="toy-meniscus-blur-lg" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.6" />
        </filter>

        {/* Convierte silueta en máscara blanca desplazada 34px hacia arriba con transición suave (sin tocar el gatillo interno) */}
        <filter id="gun-alpha-to-luma" x="-10%" y="-15%" width="120%" height="130%" colorInterpolationFilters="sRGB">
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 1 0"
            result="whiteSil"
          />
          <feGaussianBlur in="whiteSil" stdDeviation="11" />
        </filter>
      </defs>
    </svg>
  )
}

function BallWaterPocket() {
  return (
    <svg
      viewBox="0 0 240 160"
      aria-hidden="true"
      className="pointer-events-none absolute -inset-x-[18%] -bottom-[12%] h-[68%] w-[136%] overflow-visible select-none"
    >
      <ellipse cx="122" cy="76" rx="92" ry="40" fill="url(#toy-water-pocket)" />
      <g filter="url(#toy-meniscus-blur-sm)">
        <ellipse cx="122" cy="72" rx="96" ry="41" fill="none" stroke="#021c27" strokeOpacity="0.38" strokeWidth="3.2" />
        <ellipse cx="122" cy="73.5" rx="97" ry="42" fill="none" stroke="url(#toy-meniscus-crest)" strokeWidth="1.6" />
        <ellipse cx="122" cy="71" rx="84" ry="35" fill="none" stroke="url(#toy-meniscus-inner)" strokeWidth="1.5" />
      </g>
    </svg>
  )
}

function RingWaterPocket() {
  // Sombra de bolsillo de agua detrás del aro + cresta exterior súper difusa y sutil (igual que la pelota)
  return (
    <svg
      viewBox="0 0 1000 665"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible select-none"
    >
      <ellipse cx="514" cy="368" rx="462" ry="292" fill="url(#toy-water-pocket)" opacity="0.7" />
      <g filter="url(#toy-meniscus-blur-lg)">
        <ellipse cx="514" cy="346" rx="454" ry="290" fill="none" stroke="#021c27" strokeOpacity="0.32" strokeWidth="11" />
        <ellipse
          cx="514"
          cy="352"
          rx="458"
          ry="294"
          fill="none"
          stroke="url(#toy-meniscus-crest)"
          strokeWidth="5.2"
        />
      </g>
    </svg>
  )
}

function RingMeniscusLine() {
  // Filito sutil justo sobre la línea donde el agua corta al salvavidas y empieza su reflejo sumergido
  return (
    <svg
      viewBox="0 0 1000 665"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible select-none"
    >
      <g filter="url(#toy-meniscus-blur-lg)">
        <path
          d="M 88 395 A 436 205 0 0 0 940 395"
          fill="none"
          stroke="url(#toy-meniscus-inner)"
          strokeWidth="5.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

function GunWaterPocket() {
  // Depresión oscura suave + máscara SVG de línea de flotación para la pistola
  return (
    <svg
      viewBox="0 0 1000 630"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible select-none"
    >
      <defs>
        {/* Máscara en luminancia: blanco = visible (seco), negro = recortado para mostrar debajo el reflejo sumergido */}
        <mask id="gun-waterline-mask" maskUnits="userSpaceOnUse" maskContentUnits="userSpaceOnUse" x="0" y="0" width="1000" height="630">
          <rect x="0" y="0" width="1000" height="630" fill="black" />
          <g transform="translate(0, -34)" filter="url(#gun-alpha-to-luma)">
            <image href={pistola} x="0" y="0" width="1000" height="630" />
            {/* Rellena el hueco interno del gatillo en la máscara para que el gatillo naranja no se recorte */}
            <ellipse cx="500" cy="355" rx="115" ry="90" fill="white" />
          </g>
        </mask>
      </defs>

      {/* Depresiones suaves de agua detrás de cada apoyo */}
      <ellipse cx="188" cy="218" rx="124" ry="48" fill="url(#toy-water-pocket)" opacity="0.68" transform="rotate(14 188 218)" />
      <ellipse cx="455" cy="395" rx="150" ry="50" fill="url(#toy-water-pocket)" opacity="0.65" transform="rotate(16 455 395)" />
      <ellipse cx="686" cy="576" rx="132" ry="44" fill="url(#toy-water-pocket)" opacity="0.72" />
      <ellipse cx="852" cy="288" rx="95" ry="44" fill="url(#toy-water-pocket)" opacity="0.65" transform="rotate(15 852 288)" />
    </svg>
  )
}

function GunMeniscusLine() {
  // Filito líquido sutil y difuminado justo sobre la línea de corte entre la pistola seca y su reflejo sumergido
  return (
    <svg
      viewBox="0 0 1000 630"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-visible select-none"
    >
      <g filter="url(#toy-meniscus-blur-lg)">
        {/* Línea de agua suave cruzando la base del pico naranja y collar azul */}
        <path
          d="M 96 184 Q 195 228 332 278"
          fill="none"
          stroke="url(#toy-meniscus-inner)"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* Línea de agua suave en la panza del guardamonte */}
        <path
          d="M 382 360 Q 470 408 585 426"
          fill="none"
          stroke="url(#toy-meniscus-inner)"
          strokeWidth="4.8"
          strokeLinecap="round"
        />
        {/* Línea de agua suave cruzando la base del mango azul (arriba del reflejo azul sumergido) */}
        <path
          d="M 600 546 Q 686 566 772 544"
          fill="none"
          stroke="url(#toy-meniscus-inner)"
          strokeWidth="5.2"
          strokeLinecap="round"
        />
        {/* Línea de agua suave en la panza de la tapa amarilla */}
        <path
          d="M 792 282 Q 858 302 910 264"
          fill="none"
          stroke="url(#toy-meniscus-inner)"
          strokeWidth="4.8"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export default function HeroToys() {
  const reduce = useReducedMotion()

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-[5] overflow-hidden">
      <SharedWaterDefs />
      {TOYS.map((t) => {
        const Pocket = t.Pocket
        const MeniscusOverlay = t.MeniscusOverlay
        const rotAnim = reduce ? undefined : { rotate: [-t.float.rotate, t.float.rotate, -t.float.rotate] }
        const floatTrans = { duration: t.float.duration, delay: t.float.delay, repeat: Infinity, ease: 'easeInOut' }

        return (
          <div key={t.key} className={`absolute ${t.pos}`} style={{ aspectRatio: t.ratio }}>
            <motion.div
              className="relative size-full"
              initial={{ opacity: 0, scale: 0.7, y: -30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: t.enter, type: 'spring', stiffness: 120, damping: 14 }}
            >
              {/* 1. Sombra proyectada profunda dentro del agua con parallax */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{ transform: `translate(${t.deepShadow.x}, ${t.deepShadow.y})` }}
              >
                <motion.img
                  src={t.src}
                  alt=""
                  draggable="false"
                  decoding="async"
                  className={`size-full object-contain select-none brightness-0 ${t.deepShadow.blur}`}
                  initial={{ opacity: t.deepShadow.opacity, scale: t.deepShadow.scale }}
                  animate={
                    reduce
                      ? undefined
                      : {
                          y: [0, -t.float.y * 0.35, 0],
                          scale: [t.deepShadow.scale, t.deepShadow.scale * 0.965, t.deepShadow.scale],
                          opacity: [t.deepShadow.opacity, t.deepShadow.opacity * 0.82, t.deepShadow.opacity],
                          rotate: [-t.float.rotate * 0.6, t.float.rotate * 0.6, -t.float.rotate * 0.6],
                        }
                  }
                  transition={floatTrans}
                />
              </div>

              {/* 2. Contenedor que sube y baja con el agua */}
              <motion.div
                className="relative size-full"
                animate={
                  reduce
                    ? undefined
                    : t.rotateIndependent
                      ? { y: [0, -t.float.y, 0] }
                      : { y: [0, -t.float.y, 0], rotate: [-t.float.rotate, t.float.rotate, -t.float.rotate] }
                }
                transition={floatTrans}
              >
                {/* Depresión oscura y cresta muy suave detrás del objeto */}
                <Pocket />

                {/* Reflejo / continuación sumergida del propio objeto (sus colores oscurecidos y difusos bajo el agua) */}
                <div
                  className="pointer-events-none absolute inset-0 size-full"
                  style={{ WebkitMaskImage: REFLECTION_FADE_MASK, maskImage: REFLECTION_FADE_MASK }}
                >
                  <motion.img
                    src={t.src}
                    alt=""
                    draggable="false"
                    decoding="async"
                    className={`size-full object-contain select-none ${t.reflectionClass}`}
                    animate={t.rotateIndependent ? rotAnim : undefined}
                    transition={t.rotateIndependent ? floatTrans : undefined}
                  />
                </div>

                {/* Parte emergida recortada suavemente arriba del reflejo sumergido */}
                {t.svgMasked ? (
                  <svg viewBox="0 0 1000 630" aria-hidden="true" className="relative size-full select-none">
                    <image href={t.src} x="0" y="0" width="1000" height="630" mask="url(#gun-waterline-mask)" />
                  </svg>
                ) : (
                  <div
                    className="relative size-full"
                    style={t.mask ? { WebkitMaskImage: t.mask, maskImage: t.mask } : undefined}
                  >
                    <motion.img
                      src={t.src}
                      alt=""
                      draggable="false"
                      decoding="async"
                      className="size-full object-contain select-none"
                      animate={t.rotateIndependent ? rotAnim : undefined}
                      transition={t.rotateIndependent ? floatTrans : undefined}
                    />
                  </div>
                )}

                {/* Filito de menisco muy sutil y difuminado justo en la unión entre el objeto seco y su reflejo */}
                {MeniscusOverlay && <MeniscusOverlay />}
              </motion.div>
            </motion.div>
          </div>
        )
      })}
    </div>
  )
}
