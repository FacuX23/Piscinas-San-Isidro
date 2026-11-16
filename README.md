# San Isidro Piscinas

Sitio web de San Isidro Piscinas. React + Vite + Tailwind CSS v4, con animaciones hechas con `motion` y scroll suave con `lenis`.

## Cómo correrlo

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera /dist
```

Para publicar en Vercel alcanza con importar el repo: detecta Vite solo.

## Dónde cambiar el contenido

| Qué | Archivo |
| --- | --- |
| Teléfono, WhatsApp, mail, dirección, horarios | `src/data/site.js` (`SITE`) |
| Servicios, proceso, proyectos, testimonios, preguntas frecuentes | `src/data/site.js` |
| Fotos | `src/data/images.js` |
| Colores, tipografía, radio de 20px | `src/index.css` (bloque `@theme`) |

### Antes de entregar al cliente

- Reemplazar teléfono, mail y dirección (hoy son de ejemplo).
- Reemplazar proyectos y testimonios de ejemplo por reales.
- Reemplazar las fotos de stock por fotos propias del cliente (subirlas a `public/fotos`).
- Comparador antes/después (`src/sections/BeforeAfter.jsx`): hoy simula el "antes" con filtros sobre la misma foto. Usar dos fotos reales (`BEFORE` y `AFTER`).
- Links de Instagram/Facebook y páginas legales (hoy apuntan a `#`).
- El formulario abre WhatsApp con la consulta armada. Si el cliente quiere recibir mails, conectar un servicio (Formspree, Resend, etc.) en `src/sections/Contact.jsx`.

## Animaciones

Los componentes están escritos a mano siguiendo el estilo de React Bits, en `src/components`:

- `CausticsCanvas`: fondo de agua del hero (reacciona al mouse)
- `SplitText`: titulares que entran palabra por palabra
- `ScrollReveal`: texto que se enciende con el scroll
- `Magnet`: botones que siguen al puntero
- `SpotlightCard`: haz de luz en las tarjetas
- `Marquee`: cinta que cambia de velocidad con el scroll
- `CountUp`: contadores de números

Si querés usar los originales de React Bits, podés reemplazar cada uno por el equivalente de la librería manteniendo las mismas props.

El sitio respeta `prefers-reduced-motion`: sin animaciones para quien las desactiva.
