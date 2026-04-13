import { client } from "@/sanity/lib/client"
import { HOME_PAGE_QUERY, GLOBAL_CONFIG_QUERY } from "@/sanity/lib/queries"
import ClientHomePage from "./ClientHomePage"

export default async function Page() {
  const data = await client.fetch(HOME_PAGE_QUERY)
  const globalConfig = await client.fetch(GLOBAL_CONFIG_QUERY)

  return <ClientHomePage data={data} globalConfig={globalConfig} />
}
