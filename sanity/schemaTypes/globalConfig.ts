import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'globalConfig',
  title: 'Configuración Global',
  type: 'document',
  fields: [
    defineField({
      name: 'currentPhase',
      title: 'Fase Actual de la Tienda',
      type: 'number',
      description: '1 = Espera (Contador), 2 = Tienda Activa, 3 = Agradecimiento',
      options: {
        list: [
          { title: 'Fase 1: Página de Espera (Contador)', value: 1 },
          { title: 'Fase 2: Tienda Disponible', value: 2 },
          { title: 'Fase 3: Página de Agradecimiento', value: 3 },
        ],
        layout: 'radio',
      },
      initialValue: 1,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactEmail',
      title: 'Correo de Contacto',
      type: 'string',
    }),
    defineField({
      name: 'contactPhone',
      title: 'Teléfono / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'URL de Instagram',
      type: 'url',
    }),
    defineField({
      name: 'tiktokUrl',
      title: 'URL de TikTok',
      type: 'url',
    }),
    defineField({
      name: 'siteTitle',
      title: 'Título del Sitio (SEO)',
      type: 'string',
      description: 'El título que aparece en la pestaña del navegador y motores de búsqueda',
    }),
    defineField({
      name: 'siteDescription',
      title: 'Descripción del Sitio (SEO)',
      type: 'text',
      description: 'Breve descripción para motores de búsqueda',
    }),
    defineField({
      name: 'seoKeywords',
      title: 'Palabras clave SEO',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon / Icono del Sitio',
      type: 'image',
      description: 'Icono del sitio para el navegador (.png, .webp o .ico recomendado)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'ogImage',
      title: 'Imagen para Redes Sociales (Open Graph)',
      type: 'image',
      description: 'Imagen que se muestra al compartir el enlace en WhatsApp, Instagram, Twitter, etc. (idealmente 1200x630px)',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración Global y Estado',
      }
    },
  },
})
