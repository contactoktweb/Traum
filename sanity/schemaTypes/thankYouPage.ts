import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'thankYouPage',
  title: 'Página de Agradecimiento',
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
      name: 'title',
      title: 'Título Principal',
      type: 'string',
      initialValue: 'GRACIAS',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'message',
      title: 'Mensaje de Agradecimiento',
      type: 'text',
      initialValue: 'Gracias por ser parte de este tiempo y de nuestra historia.',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'backgroundImage',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Página de Agradecimiento',
        media,
      }
    },
  },
})
