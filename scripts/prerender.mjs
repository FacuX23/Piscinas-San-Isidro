import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')
const distDir = path.join(rootDir, 'dist')
const ssrDir = path.join(rootDir, 'dist-ssr')
const publicDir = path.join(rootDir, 'public')

function resolveSiteUrl(fallbackUrl) {
  const fromEnv =
    process.env.VITE_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    process.env.URL ||
    fallbackUrl
  return fromEnv.replace(/\/+$/, '')
}

function buildJsonLd(site, faqs, siteUrl) {
  const sameAs = [site.instagram, site.facebook].filter((u) => u && u !== '#')

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HomeAndConstructionBusiness',
        '@id': `${siteUrl}/#negocio`,
        name: site.name,
        url: `${siteUrl}/`,
        image: `${siteUrl}/og-hero-image.jpg`,
        logo: `${siteUrl}/favicon.svg`,
        description:
          'Diseño, construcción de piletas de hormigón proyectado, reformas integrales con venecitas, equipamiento y mantenimiento anual en San Isidro y Zona Norte del Gran Buenos Aires.',
        telephone: site.phone,
        email: site.email,
        foundingDate: '1995',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.streetAddress,
          addressLocality: site.locality,
          addressRegion: site.region,
          postalCode: site.postalCode,
          addressCountry: site.country,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: site.geo.latitude,
          longitude: site.geo.longitude,
        },
        areaServed: site.areasServed.map((city) => ({
          '@type': 'City',
          name: city,
        })),
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '09:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Saturday'],
            opens: '09:00',
            closes: '13:00',
          },
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: `+${site.whatsapp}`,
          contactType: 'sales',
          areaServed: 'AR',
          availableLanguage: ['es'],
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Servicios de piscinas',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Construcción de piletas a medida',
                description:
                  'Construcción llave en mano en hormigón proyectado, venecitas y fibra de vidrio con diseño 3D y garantía estructural de 3 años.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Reformas y renovación de piletas',
                description:
                  'Cambio de revestimiento veneciano, impermeabilización, bordes atérmicos, iluminación LED y renovación de solárium.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Mantenimiento mensual de piletas',
                description:
                  'Visitas semanales programadas todo el año con control químico, limpieza de fondo y revisión de equipos.',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Equipamiento y climatización',
                description:
                  'Instalación de bombas, filtros, cloración salina, bombas de calor, calefacción solar, luces LED y automatización.',
              },
            },
          ],
        },
        ...(sameAs.length ? { sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: `${siteUrl}/`,
        name: site.name,
        inLanguage: 'es-AR',
        publisher: { '@id': `${siteUrl}/#negocio` },
      },
      {
        '@type': 'WebPage',
        '@id': `${siteUrl}/#webpage`,
        url: `${siteUrl}/`,
        name: `${site.name} | Construcción y Reforma de Piletas en Zona Norte`,
        isPartOf: { '@id': `${siteUrl}/#website` },
        about: { '@id': `${siteUrl}/#negocio` },
        inLanguage: 'es-AR',
      },
      {
        '@type': 'FAQPage',
        '@id': `${siteUrl}/#faq`,
        mainEntity: faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  }

  return `<script type="application/ld+json">${JSON.stringify(schema)}</script>`
}

async function run() {
  await build({
    root: rootDir,
    logLevel: 'warn',
    build: {
      ssr: 'src/entry-server.jsx',
      outDir: 'dist-ssr',
      emptyOutDir: true,
    },
  })

  const serverEntryUrl = pathToFileURL(path.join(ssrDir, 'entry-server.js')).href
  const { render, SITE, FAQS } = await import(serverEntryUrl)

  const siteUrl = resolveSiteUrl(SITE.url)
  const appHtml = render()
  const jsonLdTag = buildJsonLd(SITE, FAQS, siteUrl)

  const indexPath = path.join(distDir, 'index.html')
  let html = await fs.readFile(indexPath, 'utf8')

  html = html
    .replaceAll('https://sanisidropiscinas.com.ar', siteUrl)
    .replace('<!--__SEO_JSON_LD__-->', jsonLdTag)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

  await fs.writeFile(indexPath, html, 'utf8')

  const today = new Date().toISOString().split('T')[0]
  const robotsTxt = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`

  await Promise.all([
    fs.writeFile(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8'),
    fs.writeFile(path.join(publicDir, 'robots.txt'), robotsTxt, 'utf8'),
    fs.writeFile(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8'),
    fs.writeFile(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8'),
  ])

  await fs.rm(ssrDir, { recursive: true, force: true })
  console.log(`✓ Prerender SEO completado (${siteUrl})`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
