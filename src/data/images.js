// Fotos de stock (Unsplash) como reemplazo temporal.
// Cuando el cliente pase fotos propias, subilas a /public/fotos y cambiá las rutas acá.
// Si una imagen no carga, el sitio muestra un mosaico de venecitas en su lugar.

const unsplash = (id, w = 1600) => `https://unsplash.com/photos/${id}/download?w=${w}`

// Fotos propias (Vite las procesa y les pone hash al compilar)
import mantenimiento from './servicios_piscina.png'

export const photos = {
  mantenimiento,
  rectangular: unsplash('SWfvM4yJfWM'),
  building: unsplash('K76E3nttJFE'),
  loungers: unsplash('XUq_ltx7GEg'),
  twoChairs: unsplash('kOYh8C_xLUQ'),
  palms: unsplash('CZL2roz3UF0'),
  woodHouse: unsplash('tvou5HuwAjA'),
  // Esta ya estaba en la versión anterior del sitio
  house: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop',
}
