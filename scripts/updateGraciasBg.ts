import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'

const client = createClient({
  projectId: '9ovef6bk',
  dataset: 'production',
  apiVersion: '2024-04-09',
  token: 'skzab9oLLJzkKM4VXOC5L7iJyH7RnQ9qSmijoPoWVcAiXvPgzDiURT81YvxfKNYuXmidDocbv9QT2nifJG75eGXomkC22fkXCBSQJXDhp3PPQvTADdJ1IAnoykzGsEvVcfp5daR9EjTFC1i4HR2h5Vrzd1ajU5wBaisFIHiske04VAhb1D3i',
  useCdn: false
})

async function uploadImage(filePath: string) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`)
    return null;
  }
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: path.basename(filePath)
  })
  return {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id
    }
  }
}

async function run() {
  console.log('Uploading fondo-acabado.png for desktop...')
  const desktopBg = await uploadImage('./public/fondo-acabado.png')
  
  console.log('Uploading fondo-acabado-mobile.png for mobile...')
  const mobileBg = await uploadImage('./public/fondo-acabado-mobile.png')

  console.log('Patching thankYouPage...')
  await client.patch('thankYouPage').set({
    desktopBackgroundImage: desktopBg,
    mobileBackgroundImage: mobileBg || desktopBg,
  }).commit()
  
  console.log('Background updated successfully!')
}

run().catch(console.error)
