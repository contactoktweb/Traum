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
  console.log('Uploading bg images...')
  const desktopBg = await uploadImage('./public/fondo.png')
  const mobileBg = await uploadImage('./public/fondo-completo-mobile.png')
  const contadorBg = await uploadImage('./public/fondo-contador.png')
  
  console.log('Uploading product images...')
  const capModel1 = await uploadImage('./public/cap_model_1.png')
  const capModel2 = await uploadImage('./public/cap_model_2.png')

  console.log('Patching homePage...')
  await client.patch('homePage').set({
    'hero.desktopBackgroundImage': desktopBg,
    'hero.mobileBackgroundImage': mobileBg,
  }).commit()

  console.log('Patching waitPage...')
  await client.patch('waitPage').set({
    'desktopBackgroundImage': contadorBg,
    'mobileBackgroundImage': mobileBg,
  }).commit()

  console.log('Configuring globalConfig...')
  await client.createOrReplace({
    _id: 'globalConfig',
    _type: 'globalConfig',
    currentPhase: 1,
    contactEmail: 'hello@traum.com',
  })

  console.log('Creating thankYouPage...')
  await client.createOrReplace({
    _id: 'thankYouPage',
    _type: 'thankYouPage',
    title: 'GRACIAS',
    message: 'Gracias por ser parte de este tiempo y de nuestra historia.',
    desktopBackgroundImage: desktopBg,
    mobileBackgroundImage: mobileBg,
  })

  console.log('Patching products...')
  if (capModel1) {
    await client.patch('product-modelo-1').set({
      image: capModel1,
      gallery: [capModel1, capModel1, capModel1]
    }).commit()
  }

  if (capModel2) {
    await client.patch('product-modelo-2').set({
      image: capModel2,
      gallery: [capModel2, capModel2, capModel2]
    }).commit()
  }
  console.log('Done!')
}

run().catch(console.error)
