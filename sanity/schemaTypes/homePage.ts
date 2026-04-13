import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'homePage',
  title: 'Página de Inicio',
  type: 'document',
  fields: [
    defineField({
      name: 'hero',
      title: 'Sección Principal (Hero)',
      type: 'object',
      options: { collapsible: true, collapsed: false },
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Texto Superior (Eyebrow)',
          type: 'string',
          initialValue: 'Coming Soon',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Título Principal',
          type: 'string',
          initialValue: 'TRAUM',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtítulo',
          type: 'string',
          description: 'Puede contener html si necesitas colores específicos (ej. <span>)',
          initialValue: 'Donde el diseño encuentra la cultura',
          validation: (Rule) => Rule.required(),
        }),
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
      ],
    }),
    defineField({
      name: 'about',
      title: 'Sección Quiénes Somos',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Texto Superior',
          type: 'string',
          initialValue: 'Esencia Traum',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Título Principal',
          type: 'string',
          initialValue: 'Más que una marca, un manifiesto visual.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'description',
          title: 'Descripción Corta',
          type: 'text',
          initialValue: 'Cada pieza guarda un fragmento del viaje, una historia esperando ser contada por quien la porta.',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'concept',
          title: 'Punto 01 - El Concepto',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'El Concepto', validation: (Rule) => Rule.required() }),
            defineField({ name: 'content', title: 'Contenido', type: 'text', validation: (Rule) => Rule.required() }),
          ],
        }),
        defineField({
          name: 'origin',
          title: 'Punto 02 - El Origen',
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título', type: 'string', initialValue: 'El Origen', validation: (Rule) => Rule.required() }),
            defineField({ name: 'content', title: 'Contenido', type: 'text', validation: (Rule) => Rule.required() }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'vision',
      title: 'Sección Visión (Banner Final)',
      type: 'object',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Texto Superior',
          type: 'string',
          initialValue: 'El Futuro',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'text',
          title: 'Texto Principal',
          type: 'string',
          initialValue: '"Algo grande se está gestando en nuestro taller."',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'hero.title',
    },
    prepare({ title }) {
      return {
        title: 'Página de Inicio',
        subtitle: title,
      }
    },
  },
})
