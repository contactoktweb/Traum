import { type SchemaTypeDefinition } from 'sanity'
import homePage from './homePage'
import waitPage from './waitPage'
import product from './product'
import thankYouPage from './thankYouPage'
import globalConfig from './globalConfig'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [homePage, waitPage, product, thankYouPage, globalConfig],
}
