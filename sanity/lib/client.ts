import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // false to prevent CDN caching
  stega: {
    studioUrl: '/admin',
  },
  // Disable Next.js fetch cache completely
  fetch: { cache: 'no-store' }
})
