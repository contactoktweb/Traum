import { redirect } from "next/navigation"
import { client } from "@/sanity/lib/client"
import { WAIT_PAGE_QUERY, PRODUCTS_QUERY, GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries"
import ClientTiendaPage from "./ClientTiendaPage"

export const dynamic = "force-dynamic"

export default async function TiendaPage() {
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)
  
  if (globalConfig?.currentPhase === 3) {
    redirect('/gracias')
  }

  const waitData = await client.fetch(WAIT_PAGE_QUERY)
  const products = await client.fetch(PRODUCTS_QUERY)

  return <ClientTiendaPage waitData={waitData} products={products} globalConfig={globalConfig} />
}
