const vlrBr = (valor: number) => {
  return `R$ ${valor.toFixed(2).replace(".", ",")}`;
};

export default vlrBr;
