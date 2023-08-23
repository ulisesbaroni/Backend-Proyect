export const productErrorIncompleteValues = (product) => {
  return `Uno o mas parametros obligatorios no fueron proporcionados:
  Propiedades obligatorias:
  Title: se esperabauna cadena y se recibio${product.title},
  Description:se esperabauna cadena y se recibio${product.description},
  Code: se esperabauna cadena y se recibio:´${product.code}`;
};

export const productErrorAddProducts = () => {
  `No se pudo agregar el producto al carrito`;
};

export const productErrorDeleteProducts = () => {
  `No se pudo eliminar el producto `;
};
