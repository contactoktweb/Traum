import { defineField, defineType, defineArrayMember } from 'sanity'

/**
 * Schema de Pedidos (Orders)
 * Almacena toda la información del checkout: datos del cliente,
 * dirección de envío, productos comprados y resultado del pago MercadoPago.
 */
export default defineType({
  name: 'order',
  title: 'Pedidos',
  type: 'document',
  fields: [
    // ─── Identificación del pedido ─────────────────────────────
    defineField({
      name: 'orderNumber',
      title: 'Número de Pedido',
      type: 'string',
      readOnly: true,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentId',
      title: 'ID de Pago (MercadoPago)',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Estado del Pedido',
      type: 'string',
      options: {
        list: [
          { title: '✅ Aprobado', value: 'approved' },
          { title: '⏳ Pendiente', value: 'pending' },
          { title: '🔄 En proceso', value: 'in_process' },
          { title: '❌ Rechazado', value: 'rejected' },
          { title: '🔙 Reembolsado', value: 'refunded' },
          { title: '📦 Enviado', value: 'shipped' },
          { title: '✅ Entregado', value: 'delivered' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),

    // ─── Información del cliente ───────────────────────────────
    defineField({
      name: 'customer',
      title: 'Datos del Cliente',
      type: 'object',
      fields: [
        defineField({
          name: 'firstName',
          title: 'Nombre',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'lastName',
          title: 'Apellidos',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'email',
          title: 'Correo Electrónico',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'phone',
          title: 'Teléfono',
          type: 'string',
        }),
      ],
    }),

    // ─── Dirección de envío ────────────────────────────────────
    defineField({
      name: 'shippingAddress',
      title: 'Dirección de Envío',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Calle',
          type: 'string',
        }),
        defineField({
          name: 'numExt',
          title: 'Número Exterior',
          type: 'string',
        }),
        defineField({
          name: 'numInt',
          title: 'Número Interior',
          type: 'string',
        }),
        defineField({
          name: 'colonia',
          title: 'Colonia',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'Ciudad',
          type: 'string',
        }),
        defineField({
          name: 'postalCode',
          title: 'Código Postal',
          type: 'string',
        }),
        defineField({
          name: 'state',
          title: 'Estado',
          type: 'string',
        }),
      ],
    }),

    // ─── Productos del pedido ──────────────────────────────────
    defineField({
      name: 'items',
      title: 'Productos',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'orderItem',
          title: 'Producto',
          fields: [
            defineField({
              name: 'productId',
              title: 'ID del Producto',
              type: 'string',
            }),
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'price',
              title: 'Precio Unitario',
              type: 'number',
              validation: (Rule) => Rule.required().positive(),
            }),
            defineField({
              name: 'quantity',
              title: 'Cantidad',
              type: 'number',
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: 'size',
              title: 'Talla',
              type: 'string',
            }),
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'string',
            }),
          ],
          preview: {
            select: {
              title: 'name',
              quantity: 'quantity',
              price: 'price',
              size: 'size',
            },
            prepare({ title, quantity, price, size }) {
              return {
                title: `${title}${size ? ` (${size})` : ''}`,
                subtitle: `${quantity} × $${price?.toLocaleString('es-MX')}`,
              }
            },
          },
        }),
      ],
    }),

    // ─── Totales ───────────────────────────────────────────────
    defineField({
      name: 'subtotal',
      title: 'Subtotal',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'shippingCost',
      title: 'Costo de Envío',
      type: 'number',
      readOnly: true,
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total',
      type: 'number',
      readOnly: true,
      validation: (Rule) => Rule.required().positive(),
    }),

    // ─── Información del pago (MercadoPago) ────────────────────
    defineField({
      name: 'payment',
      title: 'Información de Pago',
      type: 'object',
      fields: [
        defineField({
          name: 'method',
          title: 'Método de Pago',
          type: 'string',
        }),
        defineField({
          name: 'paymentType',
          title: 'Tipo de Pago',
          type: 'string',
          description: 'credit_card, debit_card, ticket, etc.',
        }),
        defineField({
          name: 'statusDetail',
          title: 'Detalle del Estado',
          type: 'string',
        }),
        defineField({
          name: 'installments',
          title: 'Cuotas / MSI',
          type: 'number',
        }),
      ],
    }),

    // ─── Notas internas ────────────────────────────────────────
    defineField({
      name: 'notes',
      title: 'Notas Internas',
      type: 'text',
      description: 'Notas administrativas sobre el pedido (no visibles al cliente).',
    }),

    // ─── Fecha del pedido ──────────────────────────────────────
    defineField({
      name: 'createdAt',
      title: 'Fecha del Pedido',
      type: 'datetime',
      readOnly: true,
      initialValue: () => new Date().toISOString(),
    }),
  ],

  // ─── Vista previa en el Studio ─────────────────────────────
  preview: {
    select: {
      orderNumber: 'orderNumber',
      customerName: 'customer.firstName',
      customerLastName: 'customer.lastName',
      total: 'total',
      status: 'status',
      createdAt: 'createdAt',
    },
    prepare({ orderNumber, customerName, customerLastName, total, status, createdAt }) {
      const statusEmojis: Record<string, string> = {
        approved: '✅',
        pending: '⏳',
        in_process: '🔄',
        rejected: '❌',
        refunded: '🔙',
        shipped: '📦',
        delivered: '✅',
      }
      const emoji = statusEmojis[status] || '❓'
      const date = createdAt ? new Date(createdAt).toLocaleDateString('es-MX') : ''

      return {
        title: `${emoji} #${orderNumber || 'Sin número'}`,
        subtitle: `${customerName || ''} ${customerLastName || ''} — $${total?.toLocaleString('es-MX') || '0'} — ${date}`,
      }
    },
  },

  orderings: [
    {
      title: 'Más recientes',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }],
    },
    {
      title: 'Más antiguos',
      name: 'createdAtAsc',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
  ],
})
