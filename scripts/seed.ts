import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '9ovef6bk',
  dataset: 'production',
  apiVersion: '2024-04-09',
  token: 'skzab9oLLJzkKM4VXOC5L7iJyH7RnQ9qSmijoPoWVcAiXvPgzDiURT81YvxfKNYuXmidDocbv9QT2nifJG75eGXomkC22fkXCBSQJXDhp3PPQvTADdJ1IAnoykzGsEvVcfp5daR9EjTFC1i4HR2h5Vrzd1ajU5wBaisFIHiske04VAhb1D3i', // provided by user
  useCdn: false
})

const seedHomePage = async () => {
  const doc = {
    _id: 'homePage',
    _type: 'homePage',
    hero: {
      eyebrow: 'Coming Soon',
      title: 'TRAUM',
      subtitle: 'Donde el diseño encuentra la cultura',
    },
    about: {
      eyebrow: 'Esencia Traum',
      title: 'Más que una marca, un manifiesto visual.',
      description: 'Cada pieza guarda un fragmento del viaje, una historia esperando ser contada por quien la porta.',
      concept: {
        title: 'El Concepto',
        content: 'Nacemos en la intersección donde el diseño contemporáneo, la riqueza cultural y la narrativa personal convergen para crear algo único. No hacemos simplemente ropa o accesorios; diseñamos objetos con propósito y significado.',
      },
      origin: {
        title: 'El Origen',
        content: 'Somos la unión de dos mentes creativas impulsadas por la pasión. Lo que comenzó como una amistad se transformó en un laboratorio de ideas. Durante más de cuatro años, hemos desafiado lo convencional buscando la excelencia en cada detalle.',
      },
    },
    vision: {
      eyebrow: 'El Futuro',
      text: '"Algo grande se está gestando en nuestro taller."',
    },
  }

  try {
    const res = await client.createOrReplace(doc)
    console.log('Homepage seeded successfully:', res._id)
  } catch (err) {
    console.error('Error seeding homepage:', err)
  }
}

// Seed the waiting page
const seedWaitPage = async () => {
  const doc = {
    _id: 'waitPage',
    _type: 'waitPage',
    bannerText: 'NUEVO DROP',
    targetDate: '2026-04-15T19:00:00.000Z', 
    releaseDateText: 'FECHA DE LANZAMIENTO',
    releaseTimeText: 'LANZAMIENTO 7:00 PM (CET)',
  }

  try {
    const res = await client.createOrReplace(doc)
    console.log('WaitPage seeded successfully:', res._id)
  } catch (err) {
    console.error('Error seeding waitpage:', err)
  }
}

const seedProducts = async () => {
  const products = [
    {
      _id: 'product-modelo-1',
      _type: 'product',
      id: { _type: 'slug', current: 'modelo-1' },
      name: 'Modelo 1: Dark Edition',
      description: 'Nuestra primera pieza conceptual. Fusiona la profundidad del bosque oscuro con la sutileza de los detalles en arena. Diseñada para quienes entienden que el estilo es un manifiesto silencioso.',
      price: 120000,
      edition: 'Edición Limitada 1/50',
      image: '/cap_model_1.png',
      gallery: ['/cap_model_1.png', '/cap_model_1.png', '/cap_model_1.png'], 
      features: ['Ajuste Strapback premium', 'Bordado frontal 3D', 'Interior de coronilla satín', 'Algodón peinado 100%'],
    },
    {
      _id: 'product-modelo-2',
      _type: 'product',
      id: { _type: 'slug', current: 'modelo-2' },
      name: 'Modelo 2: Sand Origin',
      description: 'Un tributo a nuestras raíces. Colores crema y arena que evocan ligereza, contrastados con el parche oficial de la marca. Una silueta clásica reinterpretada.',
      price: 120000,
      edition: 'Edición Limitada 1/50',
      image: '/cap_model_2.png',
      gallery: ['/cap_model_2.png', '/cap_model_2.png', '/cap_model_2.png'],
      features: ['Ajuste Snapback clásico', 'Parche lateral bordado', 'Visera curva ligera', 'Algodón lavado suave'],
    }
  ];

  for (const product of products) {
    try {
      const res = await client.createOrReplace(product);
      console.log('Product seeded successfully:', res._id);
    } catch (err) {
      console.error('Error seeding product:', err);
    }
  }
}

seedHomePage().then(() => seedWaitPage()).then(() => seedProducts())

