import { groq } from 'next-sanity'

export const HOME_PAGE_QUERY = groq`*[_type == "homePage"][0] {
  hero {
    ...,
    "desktopBackgroundImage": desktopBackgroundImage.asset->url,
    "mobileBackgroundImage": mobileBackgroundImage.asset->url
  },
  about,
  vision
}`

export const WAIT_PAGE_QUERY = groq`*[_type == "waitPage"][0] {
  bannerText,
  targetDate,
  releaseDateText,
  releaseTimeText,
  "desktopBackgroundImage": desktopBackgroundImage.asset->url,
  "mobileBackgroundImage": mobileBackgroundImage.asset->url
}`

export const THANK_YOU_PAGE_QUERY = groq`*[_type == "thankYouPage"][0] {
  title,
  message,
  "desktopBackgroundImage": desktopBackgroundImage.asset->url,
  "mobileBackgroundImage": mobileBackgroundImage.asset->url
}`

export const GLOBAL_CONFIG_QUERY = groq`*[_type == "globalConfig"][0]`

export const PRODUCTS_QUERY = groq`*[_type == "product"] {
  "id": id.current,
  name,
  description,
  price,
  edition,
  "image": image.asset->url,
  "gallery": gallery[].asset->url,
  features
}`

export const PRODUCT_BY_ID_QUERY = groq`*[_type == "product" && id.current == $id][0] {
  "id": id.current,
  name,
  description,
  price,
  edition,
  "image": image.asset->url,
  "gallery": gallery[].asset->url,
  features
}`
