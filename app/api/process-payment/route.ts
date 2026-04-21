import { NextRequest, NextResponse } from "next/server"
import { randomUUID } from "crypto"
import { sanityWriteClient } from "@/sanity/lib/writeClient"

/**
 * POST /api/process-payment
 * Procesa el pago con MercadoPago y guarda el pedido en Sanity.
 */
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
    const { formData, orderData } = body

    // Validar campos obligatorios del Payment Brick
    if (!formData?.transaction_amount || !formData?.payment_method_id) {
      return NextResponse.json(
        { error: "Datos de pago incompletos." },
        { status: 400 }
      )
    }

    // Generar idempotency key para evitar pagos duplicados
    const idempotencyKey = req.headers.get("x-idempotency-key") || randomUUID()

    console.log("Processing payment, formData received:", JSON.stringify(formData))

    const paymentPayload = {
      ...formData,
      transaction_amount: Number(formData.transaction_amount),
      description: "Compra en TRAUM STUDIO",
      payer: {
        ...formData.payer,
        email: formData.payer?.email || orderData?.customer?.email,
      }
    }

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        "X-Idempotency-Key": idempotencyKey,
      },
      body: JSON.stringify(paymentPayload),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error("MercadoPago Payment API Error:", JSON.stringify(data))
      return NextResponse.json(
        {
          error: "Error al procesar el pago.",
          detail: data.message || JSON.stringify(data),
          status: data.status,
        },
        { status: response.status }
      )
    }

    // ─── Guardar pedido en Sanity ─────────────────────────────
    const orderNumber = `TR-${Date.now().toString(36).toUpperCase()}`

    try {
      await sanityWriteClient.create({
        _type: "order",
        orderNumber,
        paymentId: String(data.id),
        status: data.status,
        customer: {
          firstName: orderData?.customer?.firstName || "",
          lastName: orderData?.customer?.lastName || "",
          email: orderData?.customer?.email || formData.payer?.email || "",
          phone: orderData?.customer?.phone || "",
        },
        shippingAddress: {
          street: orderData?.shippingAddress?.street || "",
          numExt: orderData?.shippingAddress?.numExt || "",
          numInt: orderData?.shippingAddress?.numInt || "",
          colonia: orderData?.shippingAddress?.colonia || "",
          city: orderData?.shippingAddress?.city || "",
          postalCode: orderData?.shippingAddress?.postalCode || "",
          state: orderData?.shippingAddress?.state || "",
        },
        items: (orderData?.items || []).map((item: any) => ({
          _type: "orderItem",
          _key: randomUUID(),
          productId: item.id || "",
          name: item.name || "",
          price: item.price || 0,
          quantity: item.quantity || 1,
          size: item.size || "",
          image: item.image || "",
        })),
        subtotal: orderData?.subtotal || formData.transaction_amount,
        shippingCost: 0,
        total: orderData?.total || formData.transaction_amount,
        payment: {
          method: data.payment_method_id || formData.payment_method_id,
          paymentType: data.payment_type_id || "",
          statusDetail: data.status_detail || "",
          installments: data.installments || formData.installments || 1,
        },
        notes: orderData?.notes || "",
        createdAt: new Date().toISOString(),
      })

      // ─── Enviar correo con Resend (REST API) ────────────────
      const resendKey = process.env.RESEND_API_KEY
      const customerEmail = orderData?.customer?.email || formData.payer?.email

      if (resendKey && customerEmail) {
        // Obtenemos el logo de Sanity
        const globalConfig = await sanityWriteClient.fetch(`*[_type == "globalConfig"][0]{ "logoUrl": logo.asset->url }`)
        const logoUrl = globalConfig?.logoUrl || "https://traumdrop.com/logo.png"

        const itemsHtml = (orderData?.items || [])
          .map(
            (item: any) => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #EBD69F; color: #354523;">
              <span style="font-weight: 600;">${item.name}</span>
              ${item.size ? `<span style="font-size: 12px; color: #557A2B; margin-left: 8px;">(Talla: ${item.size})</span>` : ""}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EBD69F; color: #354523; text-align: center;">${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #EBD69F; color: #354523; text-align: right;">$${(item.price * item.quantity).toLocaleString("es-MX")}</td>
          </tr>
        `
          )
          .join("")

        // ─── Diseño para el Cliente ─────────────────────────────
        const emailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF6EE; padding: 40px 20px; color: #354523; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #EBD69F; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #354523; padding: 30px; text-align: center;">
              <img src="${logoUrl}" alt="TRAUM STUDIO" style="height: 45px; display: block; margin: 0 auto;" />
            </div>
            <div style="padding: 40px; text-align: left;">
              <h2 style="font-size: 20px; margin-top: 0; color: #354523; font-weight: 600;">Confirmación de Pedido</h2>
              <p style="color: #557A2B; font-size: 16px;">Hola <strong>${orderData?.customer?.firstName || ""}</strong>,</p>
              <p style="font-size: 15px; color: #354523;">Hemos recibido tu pago y tu pedido está siendo procesado. A continuación te presentamos el resumen de tu compra.</p>
              <div style="background-color: #FAF6EE; padding: 15px 20px; border-radius: 4px; margin: 25px 0;">
                <p style="margin: 0; font-size: 14px; color: #354523;">Número de Orden: <strong style="color: #557A2B;">${orderNumber}</strong></p>
              </div>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                <thead>
                  <tr>
                    <th style="padding-bottom: 10px; border-bottom: 2px solid #557A2B; color: #557A2B; text-align: left; font-weight: 600;">Producto</th>
                    <th style="padding-bottom: 10px; border-bottom: 2px solid #557A2B; color: #557A2B; text-align: center; font-weight: 600;">Cant.</th>
                    <th style="padding-bottom: 10px; border-bottom: 2px solid #557A2B; color: #557A2B; text-align: right; font-weight: 600;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 15px; text-align: right; color: #557A2B; font-weight: 600;">Total Pagado:</td>
                    <td style="padding-top: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #354523;">$${(orderData?.total || formData.transaction_amount).toLocaleString("es-MX")}</td>
                  </tr>
                </tfoot>
              </table>
              <h3 style="font-size: 16px; color: #557A2B; border-bottom: 1px solid #EBD69F; padding-bottom: 5px; margin-bottom: 15px;">Detalles de Envío</h3>
              <p style="font-size: 14px; color: #354523; margin: 0;">
                ${orderData?.shippingAddress?.street} ${orderData?.shippingAddress?.numExt} ${orderData?.shippingAddress?.numInt ? `Int: ${orderData?.shippingAddress?.numInt}` : ""}<br>
                Col. ${orderData?.shippingAddress?.colonia}<br>
                C.P. ${orderData?.shippingAddress?.postalCode}<br>
                ${orderData?.shippingAddress?.city}, ${orderData?.shippingAddress?.state}
              </p>
              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #EBD69F; text-align: center;">
                <p style="font-size: 12px; color: #869D3D; margin: 0; text-transform: uppercase; tracking: 0.1em;">Gracias por confiar en Traum Studio.</p>
              </div>
            </div>
          </div>
        </div>
        `

        // ─── Diseño para el Administrador ─────────────────────────────
        const adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f7f7f7; padding: 40px 20px; color: #333333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
            <div style="background-color: #EBD69F; padding: 25px; text-align: center;">
              <h1 style="color: #354523; margin: 0; font-size: 22px; font-weight: 700; text-transform: uppercase;">¡NUEVA VENTA REGISTRADA! 💰</h1>
            </div>
            <div style="padding: 40px; text-align: left;">
              <h2 style="font-size: 20px; margin-top: 0; color: #354523; font-weight: 600;">Detalles de Compra</h2>
              <p style="color: #555555; font-size: 15px;">Felicidades, tienes un nuevo pedido. El pago ya fue aprobado por MercadoPago y está estructurado en tu Sanity.</p>
              
              <div style="background-color: #fafafa; padding: 15px 20px; border-radius: 4px; margin: 25px 0; border: 1px dashed #d0d0d0;">
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Orden:</strong> ${orderNumber}</p>
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Costo Pagado:</strong> $${(orderData?.total || formData.transaction_amount).toLocaleString("es-MX")}</p>
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Nombre del Comprador:</strong> ${orderData?.customer?.firstName || ""} ${orderData?.customer?.lastName || ""}</p>
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Email del Comprador:</strong> ${customerEmail}</p>
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Teléfono:</strong> ${orderData?.customer?.phone || "No especificado"}</p>
              </div>

              <h3 style="font-size: 16px; color: #354523; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin-bottom: 15px;">Productos Adquiridos</h3>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px; font-size: 14px;">
                <thead>
                  <tr>
                    <th style="padding-bottom: 10px; border-bottom: 1px solid #cccccc; color: #555555; text-align: left; font-weight: 600;">Producto</th>
                    <th style="padding-bottom: 10px; border-bottom: 1px solid #cccccc; color: #555555; text-align: center; font-weight: 600;">Cant.</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <h3 style="font-size: 16px; color: #354523; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin-bottom: 15px;">Dirección de Envío</h3>
              <p style="font-size: 14px; color: #333333; margin: 0;">
                <strong>Calle:</strong> ${orderData?.shippingAddress?.street} ${orderData?.shippingAddress?.numExt} ${orderData?.shippingAddress?.numInt ? `Int: ${orderData?.shippingAddress?.numInt}` : ""}<br>
                <strong>Colonia:</strong> ${orderData?.shippingAddress?.colonia}<br>
                <strong>Ciudad / Estado:</strong> ${orderData?.shippingAddress?.city}, ${orderData?.shippingAddress?.state}<br>
                <strong>Código Postal:</strong> ${orderData?.shippingAddress?.postalCode}
              </p>

              ${orderData?.notes ? `
              <div style="background-color: #fff3e0; padding: 15px 20px; border-radius: 4px; margin-top: 25px; border-left: 4px solid #ff9800;">
                <p style="margin: 0; font-size: 14px; color: #333333;"><strong>Nota del Cliente:</strong><br/>${orderData?.notes}</p>
              </div>` : ''}

              <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center;">
                <a href="https://manage.sanity.io" style="display: inline-block; padding: 12px 24px; background-color: #354523; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600;">Abrir Panel de Sanity</a>
              </div>
            </div>
          </div>
        </div>
        `

        // Promesas para enviar ambos correos al mismo tiempo
        const emailToCustomer = fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Traum Studio <pedidos@traumdrop.com>",
            to: [customerEmail],
            subject: `Tu pedido ${orderNumber} ha sido confirmado`,
            html: emailHtml
          })
        });

        const emailToAdmin = fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            from: "Traum Ventas <pedidos@traumdrop.com>",
            to: ["mangolo.espadas@gmail.com"],
            subject: `💰 Nuevo Pago Aprobado: Pedido ${orderNumber}`,
            html: adminHtml
          })
        });

        await Promise.all([emailToCustomer, emailToAdmin]).catch(err => console.error("Error enviando correos múltiples con Resend:", err));
      }
      }

    } catch (sanityError) {
      // No fallar el pago si Sanity o el correo fallan — el pago ya fue procesado
      console.error("Error guardando pedido en Sanity o enviando correo:", sanityError)
    }

    // Retornar resultado del pago al frontend
    return NextResponse.json({
      id: data.id,
      status: data.status,
      status_detail: data.status_detail,
      payment_method_id: data.payment_method_id,
      payment_type_id: data.payment_type_id,
      orderNumber,
    })
  } catch (error) {
    console.error("Error interno en /api/process-payment:", error)
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    )
  }
}
