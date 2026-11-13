/** @type {import('next').NextConfig} */
const nextConfig = {
  // La clave pública de MercadoPago es pública por diseño. Se acepta también el
  // nombre MERCADOPAGO_PUBLIC_KEY (sin prefijo) y se expone al navegador en el build.
  env: {
    NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY:
      process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || process.env.MERCADOPAGO_PUBLIC_KEY || "",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
