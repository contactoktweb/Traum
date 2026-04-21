import { NextRequest, NextResponse } from "next/server"

/**
 * POST /api/create-preference
 * Crea una preferencia de pago en MercadoPago y devuelve la URL del checkout hospedado.
 */

interface CartItemPayload {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  image?: string
}

export async function POST(req: NextRequest) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

    if (!accessToken) {
      return NextResponse.json(
        { error: "MercadoPago access token no configurado." },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { items, payer } = body as {
      items: CartItemPayload[]
      payer?: { name?: string; surname?: string; email?: string }
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No hay productos en el carrito." },
        { status: 400 }
      )
    }

    // URL base: variable de entorno > localhost (desarrollo)
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "")

    const mpItems = items.map((item) => ({
      id: item.id,
      title: item.size ? `${item.name} - Talla ${item.size}` : item.name,
      description: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      currency_id: "MXN",
      category_id: "fashion",
      ...(item.image ? { picture_url: item.image } : {}),
    }))

    const preference = {
      items: mpItems,
      ...(payer?.email
        ? {
            payer: {
              name: payer.name,
              surname: payer.surname,
              email: payer.email,
            },
          }
        : {}),
      back_urls: {
        success: `${siteUrl}/compra-exitosa?status=approved`,
        failure: `${siteUrl}/compra-exitosa?status=failure`,
        pending: `${siteUrl}/compra-exitosa?status=pending`,
      },
      payment_methods: {
        // No excluir ningún tipo de pago — habilita tarjetas, transferencias, etc.
        excluded_payment_types: [],
        excluded_payment_methods: [],
        installments: 12,
        default_installments: 1,
      },
      auto_return: "approved",
      statement_descriptor: "TRAUM STUDIO",
      binary_mode: false,
    }

    const response = await fetch(
      "https://api.mercadopago.com/checkout/preferences",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(preference),
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error("MercadoPago API Error:", errorText)
      return NextResponse.json(
        { error: "Error al crear la preferencia en MercadoPago.", detail: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()

    // Sandbox → sandbox_init_point | Producción → init_point
    const checkoutUrl: string = data.sandbox_init_point || data.init_point

    return NextResponse.json({ checkoutUrl, preferenceId: data.id })
  } catch (error) {
    console.error("Error interno en /api/create-preference:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
