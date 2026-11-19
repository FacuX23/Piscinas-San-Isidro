// Fotos de stock (Unsplash) como reemplazo temporal.
// Cuando el cliente pase fotos propias, subilas a /public/fotos y cambiá las rutas acá.
// Si una imagen no carga, el sitio muestra un mosaico de venecitas en su lugar.

const unsplash = (id, w = 1600) => `https://unsplash.com/photos/${id}/download?w=${w}`

// Fotos propias (Vite las procesa y les pone hash al compilar)
import mantenimiento from './servicios_piscina.png'
import construccion from './servicios_construccion.jpg'
import reformas from './servicios_reformas.jpg'
import procesoVisita from './proceso_visita.jpg'
import procesoDiseno3d from './proceso_diseno3d.jpg'
import procesoObra from './proceso_obra.jpg'
import procesoEntrega from './proceso_entrega.jpg'
import delta from './proyecto_delta.jpg'
import hotel from './proyecto_hotel.jpg'

export const photos = {
  mantenimiento,
  construccion,
  reformas,
  procesoVisita,
  procesoDiseno3d,
  procesoObra,
  procesoEntrega,
  delta,
  hotel,
  rectangular: unsplash('SWfvM4yJfWM'),
  building: unsplash('K76E3nttJFE'),
  twoChairs: unsplash('kOYh8C_xLUQ'),
  woodHouse: unsplash('tvou5HuwAjA'),
  // Esta ya estaba en la versión anterior del sitio
  house: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
}
