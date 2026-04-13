import { createClient } from 'next-sanity'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: 'skzab9oLLJzkKM4VXOC5L7iJyH7RnQ9qSmijoPoWVcAiXvPgzDiURT81YvxfKNYuXmidDocbv9QT2nifJG75eGXomkC22fkXCBSQJXDhp3PPQvTADdJ1IAnoykzGsEvVcfp5daR9EjTFC1i4HR2h5Vrzd1ajU5wBaisFIHiske04VAhb1D3i',
  useCdn: false,
})

async function main() {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png')
  if (!fs.existsSync(logoPath)) {
    console.error('No se encontro logo.png')
    return
  }

  console.log('Subiendo logo para usarlo como SEO / Favicon...')
  const logoAsset = await client.assets.upload('image', fs.createReadStream(logoPath), {
    filename: 'logo.png'
  })

  console.log('Logo subido. ID:', logoAsset._id)

  const configDoc = await client.fetch('*[_type == "globalConfig"][0]')
  if (!configDoc) {
    console.log('No globalConfig found to patch.')
    return
  }

  await client.patch(configDoc._id)
    .setIfMissing({ 
      siteTitle: 'Traum Store',
      siteDescription: 'Traum es la intersección entre diseño, cultura y narrativa urbana.',
      seoKeywords: ['Traum', 'Tienda', 'Gorras', 'Ropa', 'Diseño'],
    })
    .set({
      favicon: { _type: 'image', asset: { _type: 'reference', _ref: logoAsset._id } },
      ogImage: { _type: 'image', asset: { _type: 'reference', _ref: logoAsset._id } }
    })
    .commit()
    
  console.log('SEO actualizado en Sanity con éxito!')
}

main().catch(console.error)
