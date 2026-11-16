import { useEffect, useRef } from 'react'

// Fondo de agua: luz refractada (cáusticas) como la que se ve en el fondo de una pileta.
// Se dibuja con un shader WebGL (GPU), así el hilo principal queda libre para el scroll
// y las animaciones. Si no hay WebGL, cae a la versión en CPU (baja resolución, 30 fps).
// Reacciona al puntero con ondas, se pausa fuera de pantalla y con "reducir movimiento"
// dibuja un solo cuadro.

const TAU = 6.28318530718
const ITER = 5

// Resolución interna respecto de los píxeles CSS. Las cáusticas son suaves,
// así que no hace falta renderizar a resolución completa (ni con DPR).
const GL_SCALE_DESKTOP = 0.5
const GL_SCALE_MOBILE = 0.35

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;
uniform float uTime;   // tiempo de las cáusticas
uniform float uNow;    // ms, para la onda
uniform vec3 uMouse;   // x, y (0..1, y hacia abajo), energía
const float TAU = 6.28318530718;
const int ITER = ${ITER};

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float vy = 1.0 - uv.y;
  float aspect = uRes.x / uRes.y;
  float u = uv.x * aspect;
  float v = vy;

  // onda alrededor del puntero
  float dx = u - uMouse.x * aspect;
  float dy = v - uMouse.y;
  float d = sqrt(dx * dx + dy * dy);
  float ripple = sin(d * 30.0 - uNow * 0.004) * exp(-d * 5.0) * 0.018 * (0.3 + uMouse.z);
  u += ripple;
  v += ripple;

  float px = mod(u * TAU * 1.1, TAU) - 250.0;
  float py = mod(v * TAU * 1.1, TAU) - 250.0;
  float ix = px;
  float iy = py;
  float c = 1.0;
  for (int n = 0; n < ITER; n++) {
    float tt = uTime * (1.0 - 3.5 / float(n + 1));
    float nx = px + cos(tt - ix) + sin(tt + iy);
    float ny = py + sin(tt - iy) + cos(tt + ix);
    ix = nx;
    iy = ny;
    float a = px / (sin(ix + tt) / 0.005);
    float b = py / (cos(iy + tt) / 0.005);
    c += 1.0 / sqrt(a * a + b * b);
  }
  c /= float(ITER);
  c = 1.17 - pow(c, 1.4);
  float k = min(1.0, pow(abs(c), 8.0));

  // degradé base: profundo arriba, azul venecita abajo
  vec3 base = vec3(6.0 + vy * 8.0, 43.0 + vy * 52.0, 58.0 + vy * 78.0);
  vec3 col = min(vec3(255.0), base + k * vec3(150.0, 215.0, 200.0)) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`

function createGL(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'low-power',
  })
  if (!gl) return null

  const compile = (type, src) => {
    const s = gl.createShader(type)
    gl.shaderSource(s, src)
    gl.compileShader(s)
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn(gl.getShaderInfoLog(s))
      return null
    }
    return s
  }
  const vs = compile(gl.VERTEX_SHADER, VERT)
  const fs = compile(gl.FRAGMENT_SHADER, FRAG)
  if (!vs || !fs) return null
  const prog = gl.createProgram()
  gl.attachShader(prog, vs)
  gl.attachShader(prog, fs)
  gl.linkProgram(prog)
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null
  gl.useProgram(prog)

  const buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
  const loc = gl.getAttribLocation(prog, 'p')
  gl.enableVertexAttribArray(loc)
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

  const uRes = gl.getUniformLocation(prog, 'uRes')
  const uTime = gl.getUniformLocation(prog, 'uTime')
  const uNow = gl.getUniformLocation(prog, 'uNow')
  const uMouse = gl.getUniformLocation(prog, 'uMouse')

  return {
    resize(w, h) {
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(uRes, w, h)
    },
    draw(now, mouse) {
      gl.uniform1f(uTime, now * 0.00032 + 23)
      gl.uniform1f(uNow, now % 1e6)
      gl.uniform3f(uMouse, mouse.x, mouse.y, mouse.energy)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    },
  }
}

// Respaldo en CPU (mismo cálculo, baja resolución)
function createCPU(canvas) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  let w = 0
  let h = 0
  let img
  return {
    lowFps: true,
    resize(cssW, cssH) {
      const scale = window.innerWidth < 768 ? 9 : 6
      w = Math.max(48, Math.round(cssW / scale))
      h = Math.max(48, Math.round(cssH / scale))
      canvas.width = w
      canvas.height = h
      img = ctx.createImageData(w, h)
    },
    draw(now, mouse) {
      const t = now * 0.00032 + 23
      const data = img.data
      const aspect = w / h
      for (let y = 0; y < h; y++) {
        const vy = y / h
        const br = 6 + vy * 8
        const bg = 43 + vy * 52
        const bb = 58 + vy * 78
        for (let x = 0; x < w; x++) {
          let u = (x / w) * aspect
          let v = vy
          const dx = u - mouse.x * aspect
          const dy = v - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          const ripple = Math.sin(d * 30 - now * 0.004) * Math.exp(-d * 5) * 0.018 * (0.3 + mouse.energy)
          u += ripple
          v += ripple
          const px = (((u * TAU * 1.1) % TAU) + TAU) % TAU - 250
          const py = (((v * TAU * 1.1) % TAU) + TAU) % TAU - 250
          let ix = px
          let iy = py
          let c = 1
          for (let n = 0; n < ITER; n++) {
            const tt = t * (1 - 3.5 / (n + 1))
            const nx = px + Math.cos(tt - ix) + Math.sin(tt + iy)
            const ny = py + Math.sin(tt - iy) + Math.cos(tt + ix)
            ix = nx
            iy = ny
            const a = px / (Math.sin(ix + tt) / 0.005)
            const b = py / (Math.cos(iy + tt) / 0.005)
            c += 1 / Math.sqrt(a * a + b * b)
          }
          c /= ITER
          c = 1.17 - Math.pow(c, 1.4)
          const k = Math.min(1, Math.pow(Math.abs(c), 8))
          const i = (y * w + x) * 4
          data[i] = Math.min(255, br + k * 150)
          data[i + 1] = Math.min(255, bg + k * 215)
          data[i + 2] = Math.min(255, bb + k * 200)
          data[i + 3] = 255
        }
      }
      ctx.putImageData(img, 0, 0)
    },
  }
}

export default function CausticsCanvas({ className = '' }) {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const host = canvas.parentElement
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const renderer = createGL(canvas) || createCPU(canvas)
    if (!renderer) return
    const isGL = !renderer.lowFps

    let raf = 0
    let visible = true
    let last = 0
    let prev = 0
    let rect = canvas.getBoundingClientRect()
    const mouse = { x: 0.7, y: 0.4, tx: 0.7, ty: 0.4, energy: 0 }

    const resize = () => {
      measure()
      if (isGL) {
        const s = window.innerWidth < 768 ? GL_SCALE_MOBILE : GL_SCALE_DESKTOP
        renderer.resize(Math.max(64, Math.round(rect.width * s)), Math.max(64, Math.round(rect.height * s)))
      } else {
        renderer.resize(rect.width, rect.height)
      }
    }

    const step = (now) => {
      // suavizado independiente de los fps (calibrado a 30 fps como el original)
      const dt = prev ? Math.min(100, now - prev) : 16
      prev = now
      const f = dt / 33.33
      const ease = 1 - Math.pow(1 - 0.07, f)
      mouse.x += (mouse.tx - mouse.x) * ease
      mouse.y += (mouse.ty - mouse.y) * ease
      mouse.energy *= Math.pow(0.94, f)
      renderer.draw(now, mouse)
    }

    const loop = (now) => {
      raf = 0
      if (!visible || document.hidden) return // se reanuda desde el observer / visibilitychange
      raf = requestAnimationFrame(loop)
      if (!isGL) {
        if (now - last < 33) return // respaldo CPU: ~30 fps
        last = now
      }
      step(now)
    }

    const start = () => {
      if (reduce || raf || !visible || document.hidden) return
      prev = 0
      raf = requestAnimationFrame(loop)
    }

    // posición del canvas en coordenadas de documento: no cambia al scrollear,
    // así no hay que forzar layout en cada movimiento del puntero
    let docLeft = 0
    let docTop = 0
    const measure = () => {
      rect = canvas.getBoundingClientRect()
      docLeft = rect.left + window.scrollX
      docTop = rect.top + window.scrollY
    }
    const onMove = (e) => {
      mouse.tx = (e.pageX - docLeft) / rect.width
      mouse.ty = (e.pageY - docTop) / rect.height
      mouse.energy = Math.min(1.5, mouse.energy + 0.12)
    }
    const onEnter = () => measure()
    const onVis = () => start()

    resize()
    step(performance.now())

    let io
    if (!reduce) {
      io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting
        start()
      })
      io.observe(canvas)
      host?.addEventListener('pointerenter', onEnter)
      host?.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('visibilitychange', onVis)
      start()
    }
    const ro = new ResizeObserver(() => {
      resize()
      step(performance.now())
    })
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      io?.disconnect()
      ro.disconnect()
      host?.removeEventListener('pointerenter', onEnter)
      host?.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className={className} />
}
