import { useEffect, useRef } from 'react'

// Fondo de agua: luz refractada (cáusticas) como la del fondo de una pileta, con splash al hacer clic.
//
// - Principal: shader WebGL en la GPU (60 fps, sin bloquear el hilo principal).
// - Respaldo: el mismo cálculo en CPU y en baja resolución, solo si no hay WebGL.
// - Resolución adaptativa: si los cuadros tardan de más, baja la resolución del buffer.
// - Se detiene por completo fuera de pantalla o con la pestaña oculta.
// - Con "reducir movimiento" dibuja un solo cuadro y no hay splash.
//
// Splash (clic en cualquier parte del hero que no sea un link o botón):
//   1. Ondas circulares en el shader: refractan la luz del fondo, dejan brillos especulares,
//      espuma en el frente de la onda y un destello en el punto de impacto.
//   2. Gotas en una capa 2D con física real (gravedad, altura que agranda la gota). Cuando caen,
//      generan ondas más chicas en el agua.

const TAU = 6.28318530718

const RIP_COUNT = 10 // ondas simultáneas (cada una usa un vec4 en el shader)
const MAIN_SLOTS = 3 // las primeras son para clics; el resto para gotas que caen
const RIP_LIFE = 4.5 // segundos que dura una onda
const GRAVITY = 1500 // px/s², para las gotas
const REFRACTION = 0.0007

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uEnergy;
uniform vec4 uRip[${RIP_COUNT}]; // x, y (0..1 del panel), instante de inicio (s), amplitud (0 = libre)
const float TAU = 6.28318530718;

void main() {
  float aspect = uRes.x / uRes.y;
  vec2 uv = vec2(gl_FragCoord.x / uRes.x, 1.0 - gl_FragCoord.y / uRes.y);
  vec2 q = vec2(uv.x * aspect, uv.y);

  // onda alrededor del puntero
  float dist = length(q - vec2(uMouse.x * aspect, uMouse.y));
  float ripple = sin(dist * 30.0 - uTime * 4.0) * exp(-dist * 5.0) * 0.018 * (0.3 + uEnergy);
  q += ripple;

  // Splash: cada onda es un paquete que se expande, con el frente angosto y una cola más ancha detrás.
  // Se suma la pendiente (grad) de todas para refractar la luz y sacar brillos.
  vec2 grad = vec2(0.0);
  float foam = 0.0;
  float flash = 0.0;
  for (int j = 0; j < ${RIP_COUNT}; j++) {
    vec4 rp = uRip[j];
    if (rp.w <= 0.0) continue;
    float age = uTime - rp.z;
    if (age < 0.0 || age > ${RIP_LIFE.toFixed(1)}) continue;
    vec2 d = q - vec2(rp.x * aspect, rp.y);
    float r = length(d) + 0.0001;
    float x = r - age * 0.36;
    float w = mix(0.03, 0.085, min(age, 1.5) / 1.5);
    float ww = x > 0.0 ? w : w * 2.6;
    float env = exp(-(x * x) / (ww * ww));
    float s = sin(x * 70.0);
    float cs = cos(x * 70.0);
    float fade = rp.w * exp(-age * 1.1) / (1.0 + r * 5.0);
    float dh = (70.0 * cs * env - s * env * 2.0 * x / (ww * ww)) * fade;
    grad += dh * (d / r);

    // espuma y destello solo en los impactos grandes (no en las gotas chicas)
    float big = smoothstep(0.5, 0.9, rp.w);
    float ring = exp(-(x * x) / 0.0007) * exp(-age * 2.4);
    float nz = fract(sin(dot(floor(q * 240.0), vec2(12.9898, 78.233))) * 43758.5453);
    foam += big * ring * (0.35 + 0.65 * nz);
    flash += big * exp(-r * r / 0.0009) * exp(-age * 7.0);
  }
  q += grad * ${REFRACTION};

  float t = uTime * 0.32 + 23.0;
  vec2 p = mod(q * TAU * 1.1, TAU) - 250.0;
  vec2 i = p;
  float c = 1.0;
  for (int n = 0; n < 5; n++) {
    float tt = t * (1.0 - 3.5 / float(n + 1));
    i = p + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(p.x / (sin(i.x + tt) / 0.005), p.y / (cos(i.y + tt) / 0.005)));
  }
  c /= 5.0;
  c = 1.17 - pow(c, 1.4);
  float k = min(1.0, pow(abs(c), 8.0));

  // degradé base turquesa vívido: profundo arriba, turquesa luminoso abajo
  vec3 base = vec3(4.0 + uv.y * 12.0, 68.0 + uv.y * 85.0, 82.0 + uv.y * 95.0) / 255.0;
  vec3 col = base + k * vec3(95.0, 245.0, 235.0) / 255.0;

  // luz sobre la superficie: pendientes iluminadas u oscuras, reflejo especular, espuma y destello
  vec3 nrm = normalize(vec3(-grad * 0.0105, 1.0));
  vec3 L = normalize(vec3(-0.35, -0.45, 0.82));
  vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
  float spec = max(pow(max(dot(nrm, H), 0.0), 80.0) - pow(H.z, 80.0), 0.0);
  float shade = clamp(dot(grad, vec2(-0.35, -0.45)) * 0.0045, -0.6, 0.6);
  col *= 1.0 + min(shade, 0.0) * 0.8;
  col += max(shade, 0.0) * vec3(0.08, 0.34, 0.40);
  col += spec * vec3(0.85, 0.97, 1.0) * 1.1;
  col += (foam * 0.55 + flash * 0.9) * vec3(0.86, 0.98, 1.0);

  // dithering leve para evitar bandas en el degradé
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (dither - 0.5) / 255.0;

  gl_FragColor = vec4(min(col, vec3(1.0)), 1.0);
}
`

const GL_OPTIONS = {
  alpha: false,
  antialias: false,
  depth: false,
  stencil: false,
  preserveDrawingBuffer: false,
  powerPreference: 'high-performance',
}

function buildProgram(gl) {
  const compile = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) return null
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  return gl.getProgramParameter(prog, gl.LINK_STATUS) ? prog : null
}

// Prueba en un canvas descartable: un canvas que ya tomó un contexto WebGL no puede pasar a 2D.
let glSupport
function supportsGL() {
  if (glSupport !== undefined) return glSupport
  try {
    const probe = document.createElement('canvas')
    const gl = probe.getContext('webgl', GL_OPTIONS)
    const prec = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)
    glSupport = !!(gl && prec && prec.precision > 0 && buildProgram(gl))
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  } catch {
    glSupport = false
  }
  return glSupport
}

function createGL(canvas, small) {
  const gl = canvas.getContext('webgl', GL_OPTIONS)
  const prog = gl && buildProgram(gl)
  if (!prog) return null

  gl.useProgram(prog)
  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  // un solo triángulo que cubre toda la pantalla
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'aPos')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uTime = gl.getUniformLocation(prog, 'uTime')
  const uMouse = gl.getUniformLocation(prog, 'uMouse')
  const uEnergy = gl.getUniformLocation(prog, 'uEnergy')
  const uRip = gl.getUniformLocation(prog, 'uRip')

  return {
    name: 'webgl',
    quality: small ? 0.5 : 0.65, // el fondo es suave: no hace falta resolución nativa
    minQuality: 0.3,
    maxPixels: small ? 450000 : 800000,
    minInterval: 0, // sin límite: sigue el refresco de la pantalla
    resize(w, h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    },
    draw(time, mx, my, energy, rip) {
      gl.uniform1f(uTime, time)
      gl.uniform2f(uMouse, mx, my)
      gl.uniform1f(uEnergy, energy)
      gl.uniform4fv(uRip, rip)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
    destroy() {
      gl.deleteProgram(prog)
      gl.deleteBuffer(buf)
    },
  }
}

const smooth = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)))
  return t * t * (3 - 2 * t)
}
const SPEC_BASE = Math.pow(0.955, 80)
const wave = { gx: 0, gy: 0, foam: 0, flash: 0 }

// Mismo modelo de ondas que el shader, para el respaldo en CPU.
function sampleWaves(rip, time, qx, qy, aspect) {
  let gx = 0
  let gy = 0
  let foam = 0
  let flash = 0
  for (let n = 0; n < RIP_COUNT; n++) {
    const o = n * 4
    const amp = rip[o + 3]
    if (amp <= 0) continue
    const age = time - rip[o + 2]
    if (age < 0 || age > RIP_LIFE) continue
    const dx = qx - rip[o] * aspect
    const dy = qy - rip[o + 1]
    const r = Math.sqrt(dx * dx + dy * dy) + 1e-4
    const x = r - age * 0.36
    const w = 0.03 + 0.055 * (Math.min(age, 1.5) / 1.5)
    const ww = x > 0 ? w : w * 2.6
    const env = Math.exp(-(x * x) / (ww * ww))
    const s = Math.sin(x * 70)
    const cs = Math.cos(x * 70)
    const fade = (amp * Math.exp(-age * 1.1)) / (1 + r * 5)
    const dh = (70 * cs * env - (s * env * 2 * x) / (ww * ww)) * fade
    gx += (dh * dx) / r
    gy += (dh * dy) / r
    const big = smooth(0.5, 0.9, amp)
    if (big > 0) {
      const ring = Math.exp(-(x * x) / 0.0007) * Math.exp(-age * 2.4)
      const hash = Math.sin(Math.floor(qx * 240) * 12.9898 + Math.floor(qy * 240) * 78.233) * 43758.5453
      foam += big * ring * (0.35 + 0.65 * (hash - Math.floor(hash)))
      flash += big * Math.exp((-r * r) / 0.0009) * Math.exp(-age * 7)
    }
  }
  wave.gx = gx
  wave.gy = gy
  wave.foam = foam
  wave.flash = flash
}

// Respaldo sin WebGL: mismo cálculo en CPU, en baja resolución y a 30 fps.
function createCPU(canvas, small) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  let w = 0
  let h = 0
  let img

  return {
    name: 'cpu',
    quality: small ? 1 / 9 : 1 / 6,
    minQuality: 1 / 14,
    maxPixels: 1e9,
    minInterval: 33,
    resize(nw, nh) {
      w = canvas.width = nw
      h = canvas.height = nh
      img = ctx.createImageData(w, h)
    },
    draw(time, mx, my, energy, rip) {
      const t = time * 0.32 + 23
      const data = img.data
      const aspect = w / h

      let splashing = false
      for (let n = 0; n < RIP_COUNT; n++) {
        const age = time - rip[n * 4 + 2]
        if (rip[n * 4 + 3] > 0 && age >= 0 && age <= RIP_LIFE) splashing = true
      }

      for (let y = 0; y < h; y++) {
        const vy = y / h
        const br = 4 + vy * 12
        const bg = 68 + vy * 85
        const bb = 82 + vy * 95
        for (let x = 0; x < w; x++) {
          let u = (x / w) * aspect
          let v = vy
          const dx = u - mx * aspect
          const dy = v - my
          const d = Math.sqrt(dx * dx + dy * dy)
          const ripple = Math.sin(d * 30 - time * 4) * Math.exp(-d * 5) * 0.018 * (0.3 + energy)
          u += ripple
          v += ripple

          let gx = 0
          let gy = 0
          if (splashing) {
            sampleWaves(rip, time, u, v, aspect)
            gx = wave.gx
            gy = wave.gy
            u += gx * REFRACTION
            v += gy * REFRACTION
          }

          const px = (((u * TAU * 1.1) % TAU) + TAU) % TAU - 250
          const py = (((v * TAU * 1.1) % TAU) + TAU) % TAU - 250
          let ix = px
          let iy = py
          let c = 1
          for (let n = 0; n < 5; n++) {
            const tt = t * (1 - 3.5 / (n + 1))
            const nx = px + Math.cos(tt - ix) + Math.sin(tt + iy)
            const ny = py + Math.sin(tt - iy) + Math.cos(tt + ix)
            ix = nx
            iy = ny
            const a = px / (Math.sin(ix + tt) / 0.005)
            const b = py / (Math.cos(iy + tt) / 0.005)
            c += 1 / Math.sqrt(a * a + b * b)
          }
          c /= 5
          c = 1.17 - Math.pow(c, 1.4)
          const k = Math.min(1, Math.pow(Math.abs(c), 8))
          let rr = br + k * 95
          let gg = bg + k * 245
          let b2 = bb + k * 235

          if (splashing) {
            const nx = -gx * 0.0105
            const ny = -gy * 0.0105
            const nDotH = (-0.184 * nx - 0.236 * ny + 0.955) / Math.sqrt(nx * nx + ny * ny + 1)
            const spec = Math.max(Math.pow(Math.max(nDotH, 0), 80) - SPEC_BASE, 0)
            const shade = Math.max(-0.6, Math.min(0.6, (-0.35 * gx - 0.45 * gy) * 0.0045))
            if (shade < 0) {
              const m = 1 + shade * 0.8
              rr *= m
              gg *= m
              b2 *= m
            } else {
              rr += shade * 0.08 * 255
              gg += shade * 0.34 * 255
              b2 += shade * 0.4 * 255
            }
            rr += spec * 0.85 * 1.1 * 255
            gg += spec * 0.97 * 1.1 * 255
            b2 += spec * 1.1 * 255
            const f = (wave.foam * 0.55 + wave.flash * 0.9) * 255
            rr += f * 0.86
            gg += f * 0.98
            b2 += f
          }

          const i = (y * w + x) * 4
          data[i] = rr // Uint8ClampedArray recorta a 0–255
          data[i + 1] = gg
          data[i + 2] = b2
          data[i + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)
    },
    destroy() {},
  }
}

// Sprites de la gota: se dibujan una sola vez y después solo se estampan (mucho más barato que gradientes por cuadro).
function makeSprite(paint) {
  const c = document.createElement('canvas')
  c.width = c.height = 96
  paint(c.getContext('2d'))
  return c
}

function makeDropSprites() {
  // Cuerpo: agua casi transparente con borde más claro, como una gota sobre fondo oscuro
  const body = makeSprite((g) => {
    const grd = g.createRadialGradient(40, 38, 4, 48, 48, 46)
    grd.addColorStop(0, 'rgba(225,250,255,0.34)')
    grd.addColorStop(0.6, 'rgba(110,200,222,0.20)')
    grd.addColorStop(1, 'rgba(205,244,252,0.62)')
    g.fillStyle = grd
    g.beginPath()
    g.arc(48, 48, 45, 0, TAU)
    g.fill()
    g.lineWidth = 3
    g.strokeStyle = 'rgba(235,252,255,0.55)'
    g.beginPath()
    g.arc(48, 48, 44, 0, TAU)
    g.stroke()
  })
  // Brillo: no rota con la gota (la luz viene siempre del mismo lado)
  const glint = makeSprite((g) => {
    g.fillStyle = 'rgba(255,255,255,0.95)'
    g.beginPath()
    g.ellipse(33, 31, 11, 7, -0.6, 0, TAU)
    g.fill()
    g.strokeStyle = 'rgba(255,255,255,0.4)'
    g.lineWidth = 4
    g.lineCap = 'round'
    g.beginPath()
    g.arc(48, 48, 33, 0.15 * Math.PI, 0.6 * Math.PI)
    g.stroke()
  })
  return { body, glint }
}

const rand = (a, b) => a + Math.random() * (b - a)

export default function CausticsCanvas({ className = '' }) {
  const ref = useRef(null)
  const dropsRef = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const host = canvas.parentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const small = window.innerWidth < 768

    let renderer = supportsGL() ? createGL(canvas, small) : createCPU(canvas, small)
    if (!renderer) return
    canvas.dataset.renderer = renderer.name

    let quality = renderer.quality
    let time = 7 // segundos acumulados (no avanza mientras está pausado)
    let last = 0
    let raf = 0
    let running = false
    let visible = true
    let reductions = 0
    let warmup = 0
    let sum = 0
    let count = 0
    const mouse = { x: 0.7, y: 0.4, tx: 0.7, ty: 0.4, energy: 0, cx: 0, cy: 0, px: null, py: null, dirty: false }

    // ── Ondas (se pasan al shader) ──
    const rip = new Float32Array(RIP_COUNT * 4) // [x, y, inicio, amplitud] por onda
    for (let i = 0; i < RIP_COUNT; i++) rip[i * 4 + 2] = -1000
    let nextMain = 0
    let nextDrop = MAIN_SLOTS
    const addRipple = (u, v, amp, isMain) => {
      let slot
      if (isMain) {
        slot = nextMain
        nextMain = (nextMain + 1) % MAIN_SLOTS
      } else {
        slot = nextDrop
        nextDrop = nextDrop + 1 >= RIP_COUNT ? MAIN_SLOTS : nextDrop + 1
      }
      const o = slot * 4
      rip[o] = u
      rip[o + 1] = v
      rip[o + 2] = time
      rip[o + 3] = amp
    }

    // ── Gotas (capa 2D) ──
    const dropsCanvas = dropsRef.current
    const dctx = dropsCanvas?.getContext('2d') ?? null
    const sprites = dctx ? makeDropSprites() : null
    const drops = []
    let dpr = 1
    let cssW = 0
    let cssH = 0
    let dropsDirty = false

    const resizeDrops = () => {
      if (!dropsCanvas || !dctx) return
      const r = dropsCanvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      cssW = r.width
      cssH = r.height
      dropsCanvas.width = Math.max(1, Math.round(r.width * dpr))
      dropsCanvas.height = Math.max(1, Math.round(r.height * dpr))
      dctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const splashAt = (px, py, rect) => {
      addRipple(px / rect.width, py / rect.height, 1, true)
      if (!dctx) return
      const sc = Math.min(1.2, Math.max(0.75, rect.width / 1200)) // en pantallas chicas, gotas más chicas
      const push = (o) => drops.push({ x: px, y: py, vx: 0, vy: 0, vz: 0, r: 3, z: 0, age: 0, jet: false, ...o })

      // corona: gotas medianas y grandes que salen en todas direcciones
      const crown = Math.round(rand(14, 20))
      for (let i = 0; i < crown; i++) {
        const a = rand(0, TAU)
        const sp = (rand(70, 120) + Math.pow(Math.random(), 1.6) * 300) * sc
        push({
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          vz: rand(380, 880),
          r: (1.8 + Math.pow(Math.random(), 2.2) * 5.2) * sc,
          age: -rand(0, 0.03),
        })
      }
      // niebla fina: gotitas rápidas que caen enseguida
      for (let i = 0; i < 16; i++) {
        const a = rand(0, TAU)
        const sp = rand(180, 520) * sc
        push({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, vz: rand(180, 420), r: rand(0.8, 1.5) * sc })
      }
      // chorro central (Worthington): sube casi derecho y cae en el mismo lugar
      push({ vx: rand(-12, 12), vy: rand(-12, 12), vz: 880, r: 8 * sc, age: -0.06, jet: true })
      push({ vx: rand(-20, 20), vy: rand(-20, 20), vz: 700, r: 4.5 * sc, age: -0.14, jet: true })
    }

    const stepDrops = (dt) => {
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]
        d.age += dt
        if (d.age <= 0) continue
        d.x += d.vx * dt
        d.y += d.vy * dt
        const drag = Math.exp(-0.7 * dt)
        d.vx *= drag
        d.vy *= drag
        d.z = d.vz * d.age - 0.5 * GRAVITY * d.age * d.age
        if (d.z <= 0) {
          // al caer, la gota deja su propia onda
          const u = d.x / cssW
          const v = d.y / cssH
          if (u > 0 && u < 1 && v > 0 && v < 1) {
            if (d.jet) addRipple(u, v, 0.55, false)
            else if (d.r >= 3) addRipple(u, v, Math.min(0.45, 0.12 + d.r * 0.045), false)
          }
          drops.splice(i, 1)
        }
      }
    }

    const drawDrops = () => {
      dctx.clearRect(0, 0, cssW, cssH)
      for (const d of drops) {
        if (d.age <= 0) continue
        const rr = d.r * (1 + d.z * 0.0022) // más cerca de la cámara = más grande
        if (rr < 1.6) {
          dctx.fillStyle = 'rgba(225,248,255,0.7)'
          dctx.beginPath()
          dctx.arc(d.x, d.y, Math.max(rr, 0.6), 0, TAU)
          dctx.fill()
          continue
        }
        const half = rr * 1.067 // el sprite deja un pequeño margen alrededor del círculo
        const stretch = 1 + Math.min(Math.hypot(d.vx, d.vy) * 0.0016, 0.7) // se estira en el sentido del movimiento
        dctx.save()
        dctx.translate(d.x, d.y)
        dctx.rotate(Math.atan2(d.vy, d.vx))
        dctx.scale(stretch, 1)
        dctx.drawImage(sprites.body, -half, -half, half * 2, half * 2)
        dctx.restore()
        dctx.drawImage(sprites.glint, d.x - half, d.y - half, half * 2, half * 2)
      }
    }

    const paint = () => renderer.draw(time, mouse.x, mouse.y, mouse.energy, rip)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      if (!r.width || !r.height) return
      let q = quality
      if (r.width * r.height * q * q > renderer.maxPixels) q = Math.sqrt(renderer.maxPixels / (r.width * r.height))
      renderer.resize(Math.max(32, Math.round(r.width * q)), Math.max(32, Math.round(r.height * q)))
      resizeDrops()
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const delta = now - last
      if (delta < renderer.minInterval) return
      last = now
      const dt = Math.min(0.1, delta / 1000) // segundos; tope por si la pestaña estuvo congelada

      // el puntero se lee una sola vez por cuadro (evita forzar layout en cada evento)
      if (mouse.dirty) {
        const r = canvas.getBoundingClientRect()
        mouse.tx = (mouse.cx - r.left) / r.width
        mouse.ty = (mouse.cy - r.top) / r.height
        if (mouse.px !== null) {
          const moved = Math.hypot(mouse.cx - mouse.px, mouse.cy - mouse.py)
          mouse.energy = Math.min(1.5, mouse.energy + Math.min(0.2, moved * 0.003))
        }
        mouse.px = mouse.cx
        mouse.py = mouse.cy
        mouse.dirty = false
      }
      // suavizado independiente de la tasa de cuadros
      const k = 1 - Math.exp(-dt * 4.5)
      mouse.x += (mouse.tx - mouse.x) * k
      mouse.y += (mouse.ty - mouse.y) * k
      mouse.energy *= Math.exp(-dt * 3.7)

      time += dt

      // las ondas viejas liberan su lugar
      for (let i = 0; i < RIP_COUNT; i++) {
        const o = i * 4
        if (rip[o + 3] > 0 && time - rip[o + 2] > RIP_LIFE) rip[o + 3] = 0
      }
      if (dctx) {
        stepDrops(dt)
        if (drops.length) {
          drawDrops()
          dropsDirty = true
        } else if (dropsDirty) {
          dctx.clearRect(0, 0, cssW, cssH)
          dropsDirty = false
        }
      }
      paint()

      // Resolución adaptativa: si el promedio queda por debajo de ~40 fps, baja la calidad (máx. 3 veces)
      if (reductions < 3 && quality > renderer.minQuality) {
        if (warmup < 20) {
          warmup++
        } else {
          sum += delta
          count++
          if (count === 45) {
            if (sum / count > 26) {
              quality = Math.max(renderer.minQuality, quality * 0.8)
              reductions++
              resize()
            }
            sum = 0
            count = 0
          }
        }
      }
    }

    const start = () => {
      if (running || reduce) return
      running = true
      last = performance.now()
      raf = requestAnimationFrame(frame)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
    }
    const sync = () => (visible && !document.hidden ? start() : stop())

    const onMove = (e) => {
      mouse.cx = e.clientX
      mouse.cy = e.clientY
      mouse.dirty = true
    }

    // Clic en cualquier parte del hero, salvo links, botones y campos
    const onClick = (e) => {
      if (!running) return
      if (e.target.closest?.('a, button, input, textarea, select, [data-no-splash]')) return
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      if (px < 0 || py < 0 || px > r.width || py > r.height) return
      splashAt(px, py, r)
    }

    const onLost = (e) => {
      e.preventDefault()
      stop()
    }
    const onRestored = () => {
      renderer = createGL(canvas, small) || renderer
      resize()
      paint()
      sync()
    }

    resize()
    paint()

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      sync()
    })
    io.observe(canvas)

    const ro = new ResizeObserver(() => {
      resize()
      if (!running) paint()
    })
    ro.observe(canvas)

    if (!reduce) {
      host?.addEventListener('pointermove', onMove, { passive: true })
      host?.addEventListener('click', onClick)
      document.addEventListener('visibilitychange', sync)
    }
    if (renderer.name === 'webgl') {
      canvas.addEventListener('webglcontextlost', onLost)
      canvas.addEventListener('webglcontextrestored', onRestored)
    }

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      host?.removeEventListener('pointermove', onMove)
      host?.removeEventListener('click', onClick)
      document.removeEventListener('visibilitychange', sync)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      renderer.destroy()
    }
  }, [])

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className={className} />
      {/* Gotas: por encima del contenido pero sin interceptar clics */}
      <canvas ref={dropsRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] size-full" />
    </>
  )
}