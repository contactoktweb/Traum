import { Suspense } from "react"
import ClientCompraExitosaPage from "./ClientCompraExitosaPage"

export default function CompraExitosaPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[100dvh] w-full bg-[#FAF6EE]">Cargando...</div>}>
      <ClientCompraExitosaPage />
    </Suspense>
  )
}