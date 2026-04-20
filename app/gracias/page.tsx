import { Suspense } from "react"
import { client } from "@/sanity/lib/client"
import { THANK_YOU_PAGE_QUERY, GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries"
import ClientGraciasPage from "./ClientGraciasPage"

export default async function GraciasPage() {
  const data = await client.fetch(THANK_YOU_PAGE_QUERY)
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientGraciasPage data={data} globalConfig={globalConfig} />
    </Suspense>
  )
}
