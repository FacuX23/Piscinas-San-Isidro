// ─────────────────────────────────────────────────────────────
// TODO antes de entregar al cliente: reemplazar los datos de ejemplo
// (teléfono, mail, dirección, proyectos, testimonios y fotos).
// Todo el contenido del sitio sale de este archivo y de images.js.
// ─────────────────────────────────────────────────────────────

export const SITE = {
  name: 'San Isidro Piscinas',
  whatsapp: '5491155550123', // formato internacional, sin + ni espacios
  whatsappLabel: '+54 9 11 5555-0123',
  phone: '+5412345678910',
  phoneLabel: '+54 12 3456-7890',
  email: 'hola@correo-contacto.com.ar',
  address: 'Av. Centenario 1234, San Isidro, Buenos Aires',
  hours: ['Lunes a viernes de 9 a 18', 'Sábados de 9 a 13'],
  mapQuery: 'San Isidro, Buenos Aires, Argentina',
  instagram: '#',
  facebook: '#',
  year: new Date().getFullYear(),
}

export const waLink = (text = 'Hola, quiero pedir un presupuesto para una pileta.') =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`

export const NAV_LINKS = [
  { href: '#nosotros', label: 'Nosotros' },
  { href: '#servicios', label: 'Servicios' },
  { href: '#proceso', label: 'Cómo trabajamos' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#contacto', label: 'Contacto' },
]

export const MARQUEE_ITEMS = [
  'Hormigón proyectado',
  'Venecitas',
  'Fibra de vidrio',
  'Borde infinito',
  'Cloración salina',
  'Bombas de calor',
  'Iluminación LED',
  'Cobertores',
  'Automatización',
]

export const PROCESS = [
  {
    icon: 'Ruler',
    photo: 'procesoVisita',
    alt: 'Planos de pileta, medidor láser y muestras de venecitas y travertino sobre mesa de patio frente al jardín',
    title: 'Visita y medición',
    text: 'Vamos a tu casa, medimos el terreno, revisamos el suelo y charlamos cómo querés usar la pileta. Después te pasamos un presupuesto cerrado, por escrito.',
  },
  {
    icon: 'Box',
    photo: 'procesoDiseno3d',
    alt: 'Plano isométrico 3D de pileta con corte estructural que muestra profundidad, escalones sumergidos, playa húmeda y solárium',
    title: 'Diseño en 3D',
    text: 'Ves tu pileta en tu patio antes de poner el primer ladrillo. Ajustamos forma, profundidad, escalones y solárium hasta que quedes conforme.',
  },
  {
    icon: 'HardHat',
    photo: 'procesoObra',
    alt: 'Estructura de hormigón proyectado con armadura de hierro y encofrado prolijo en obra residencial',
    title: 'Obra',
    text: 'Excavación, estructura, instalaciones y revestimiento con equipo propio. Un encargado de obra fijo y avances semanales por WhatsApp.',
  },
  {
    icon: 'Droplets',
    photo: 'procesoEntrega',
    alt: 'Pileta terminada con agua cristalina, escalones sumergidos y kit de control del agua en el solárium',
    title: 'Entrega y puesta en marcha',
    text: 'Llenado, tratamiento inicial del agua y una charla para que sepas cómo cuidarla. Garantía por escrito y, si querés, seguimos con el mantenimiento.',
  },
]

// Proyectos de ejemplo: reemplazar por obras reales y fotos propias del cliente.
export const PROJECTS = [
  { title: 'Residencia Barrancas', place: 'San Isidro', type: 'residencial', size: '9 × 4 m', detail: 'Hormigón proyectado', year: 2025, photo: 'rectangular' },
  { title: 'Club de campo Los Talas', place: 'Pilar', type: 'comercial', size: '25 × 12 m', detail: 'Semiolímpica climatizada', year: 2024, photo: 'building' },
  { title: 'Quinta del Delta', place: 'Tigre', type: 'residencial', size: '8 × 3,5 m', detail: 'Venecitas azules', year: 2025, photo: 'delta' },
  { title: 'Casa en Cardales', place: 'Campana', type: 'residencial', size: '10 × 4,5 m', detail: 'Borde infinito', year: 2024, photo: 'twoChairs' },
  { title: 'Hotel boutique', place: 'Pinamar', type: 'comercial', size: '15 × 7 m', detail: 'Con solárium y palmeras', year: 2023, photo: 'hotel' },
  { title: 'Chalet La Lonja', place: 'Funes', type: 'residencial', size: '7 × 3 m', detail: 'Fibra de vidrio', year: 2025, photo: 'woodHouse' },
]

export const STATS = [
  { to: 30, suffix: '+', label: 'años haciendo piletas', note: 'desde 1995' },
  { to: 450, suffix: '+', label: 'piletas construidas' },
  { to: 1200, suffix: '+', label: 'clientes de mantenimiento' },
  { to: 3, suffix: ' años', label: 'de garantía estructural' },
]

export const VALUES = [
  'Presupuesto cerrado y por escrito',
  'Equipo propio, sin subcontratar',
  'Materiales de primeras marcas',
  'Cumplimos los plazos acordados',
  'Un técnico asignado después de la obra',
]

// Testimonios de ejemplo: reemplazar por reseñas reales.
export const TESTIMONIALS = [
  {
    name: 'Mariana G.',
    place: 'Pilar',
    text: 'Nos hicieron la pileta en dos meses y el encargado de obra nos mandaba fotos cada semana por WhatsApp. Quedó mejor que el render.',
  },
  {
    name: 'Carlos R.',
    place: 'Tigre',
    text: 'Les contraté el mantenimiento hace tres años. El agua está siempre en su punto y nunca tuve que llamar dos veces.',
  },
  {
    name: 'Lucía y Martín',
    place: 'San Isidro',
    text: 'Teníamos la pileta vieja con las venecitas rotas. La reformaron con borde nuevo y luces LED, y ahora es el centro de todas las juntadas.',
  },
  {
    name: 'Administración del club',
    place: 'Pinamar',
    text: 'Coordinaron la habilitación y la obra sin frenar la temporada. Respondieron siempre rápido y dejaron todo documentado.',
  },
]

export const FAQS = [
  {
    q: '¿Cuánto tarda la obra?',
    a: 'Depende del tipo de pileta. Una de fibra de vidrio puede estar lista en pocas semanas; una de hormigón proyectado con venecitas suele llevar entre 6 y 10 semanas. En la visita te damos un cronograma por escrito.',
  },
  {
    q: '¿Cuánto cuesta una pileta?',
    a: 'El precio cambia con las medidas, el tipo de construcción, el revestimiento y el equipamiento. Por eso hacemos un presupuesto a medida, detallado y cerrado. Escribinos y coordinamos la visita.',
  },
  {
    q: '¿Necesito permiso municipal?',
    a: 'En la mayoría de los municipios sí, y los requisitos cambian de uno a otro. Nos encargamos de la documentación y de los planos para que no tengas que hacer trámites.',
  },
  {
    q: '¿Qué cubre la garantía?',
    a: 'La garantía de 3 años cubre la estructura de la pileta. Los equipos tienen la garantía de su fabricante. Todo queda detallado en el contrato.',
  },
  {
    q: '¿Hacen mantenimiento de piletas que no construyeron?',
    a: 'Sí. Hacemos una primera visita para evaluar el estado del agua y los equipos, y armamos un abono mensual según el tamaño de tu pileta.',
  },
  {
    q: '¿En qué zonas trabajan?',
    a: 'Principalmente en zona norte del Gran Buenos Aires. También hacemos obras puntuales en la Costa Atlántica y en otras provincias, consultanos.',
  },
]

export const SERVICE_OPTIONS = ['Construcción', 'Mantenimiento', 'Reforma', 'Equipamiento', 'Otro']
