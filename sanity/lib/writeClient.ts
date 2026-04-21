import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

/**
 * Cliente de Sanity con permisos de escritura.
 * Solo usar en el servidor (API routes). Nunca importar en el cliente.
 */
export const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})
