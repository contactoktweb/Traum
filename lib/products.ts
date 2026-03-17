export const products = [
  {
    id: "modelo-1",
    name: "Modelo 1: Dark Edition",
    description: "Nuestra primera pieza conceptual. Fusiona la profundidad del bosque oscuro con la sutileza de los detalles en arena. Diseñada para quienes entienden que el estilo es un manifiesto silencioso.",
    price: 120000,
    edition: "Edición Limitada 1/50",
    image: "/cap_model_1.png",
    // Adding placeholder gallery images for the individual product page
    gallery: ["/cap_model_1.png", "/cap_model_1.png", "/cap_model_1.png"], 
    features: ["Ajuste Strapback premium", "Bordado frontal 3D", "Interior de coronilla satín", "Algodón peinado 100%"],
  },
  {
    id: "modelo-2",
    name: "Modelo 2: Sand Origin",
    description: "Un tributo a nuestras raíces. Colores crema y arena que evocan ligereza, contrastados con el parche oficial de la marca. Una silueta clásica reinterpretada.",
    price: 120000,
    edition: "Edición Limitada 1/50",
    image: "/cap_model_2.png",
    // Adding placeholder gallery images for the individual product page
    gallery: ["/cap_model_2.png", "/cap_model_2.png", "/cap_model_2.png"],
    features: ["Ajuste Snapback clásico", "Parche lateral bordado", "Visera curva ligera", "Algodón lavado suave"],
  }
];

export function getProductById(id: string) {
  return products.find(product => product.id === id);
}

export function getAllProductIds() {
  return products.map(product => product.id);
}
