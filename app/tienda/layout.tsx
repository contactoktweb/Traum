import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tienda Oficial | Traum",
  description: "Descubre nuestra primera colección de edición limitada. Gorras exclusivas diseñadas con propósito.",
}

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
