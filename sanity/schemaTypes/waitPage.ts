import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'waitPage',
  title: 'Página de Espera (Tienda)',
  type: 'document',
  fields: [
    defineField({
      name: 'desktopBackgroundImage',
      title: 'Imagen de Fondo (Desktop)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'mobileBackgroundImage',
      title: 'Imagen de Fondo (Mobile)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'bannerText',
      title: 'Texto del Banner (Cinta Adhesiva)',
      type: 'string',
      initialValue: 'NUEVO DROP',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'targetDate',
      title: 'Fecha y Hora del Lanzamiento (Contador)',
      type: 'datetime',
      description: 'Define cuándo expira el contador y se muestra la tienda.',
      validation: (Rule) => Rule.required(),
      initialValue: '2026-04-15T00:00:00.000Z',
    }),
    defineField({
      name: 'releaseDateText',
      title: 'Texto del Badge (Ej: FECHA DE LANZAMIENTO)',
      type: 'string',
      initialValue: 'FECHA DE LANZAMIENTO',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'releaseTimeText',
      title: 'Texto de la Hora (Ej: LANZAMIENTO 7:00 PM (CET))',
      type: 'string',
      initialValue: 'LANZAMIENTO 7:00 PM (CET)',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'bannerText',
      subtitle: 'targetDate',
    },
    prepare({ title, subtitle }) {
      return {
        title: 'Página de Espera / Tienda',
        subtitle: subtitle ? new Date(subtitle).toLocaleString() : 'Sin fecha',
      }
    },
  },
})
