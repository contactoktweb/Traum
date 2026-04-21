import createImageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source)
}

export const getOptimizedSanityImage = (source: SanityImageSource, { width = 1200, height, quality = 80, fit = 'clip', auto = 'format' } = {}) => {
  let img = urlFor(source).width(width).quality(quality).fit(fit)
  if (height) img = img.height(height)
  if (auto) img = img.auto(auto)
  return img.url()
}
