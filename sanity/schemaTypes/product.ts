import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'ID / Slug del Producto',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'name',
      title: 'Nombre del Producto',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Descripción',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Precio',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'edition',
      title: 'Edición / Variación',
      type: 'string',
      initialValue: 'Edición Limitada 1/50',
    }),
    defineField({
      name: 'image',
      title: 'Imagen Principal',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Galería de Imágenes',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'features',
      title: 'Características',
      type: 'array',
      of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
    },
    prepare({ title, subtitle }) {
      return {
        title,
        subtitle: subtitle ? `$${subtitle}` : '',
      }
    },
  },
})
