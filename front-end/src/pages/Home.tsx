import { useContext, useEffect, useState } from "react";
import Product from "../components/Product";
import { ProductContext } from "../contexts/ProductContext";

function Home() {
  const [category, setCategory] = useState("Hamburger");
  const { products, setProducts, getProducts } = useContext(ProductContext);

  const trocaCategoria = (newCategory: string) => {
    setCategory(newCategory);
  };

  const produtosFiltrados = products.filter(
    (product) => product.category === category,
  );

  useEffect(() => {
    getProducts();
  }, []);

  function handleClassBotoes(categoryName: string) {
    const elementoSelecionado =
      "md:text-md border-bg-[#f2daac] flex h-7 w-24 cursor-pointer items-center justify-center rounded-sm border bg-[#f2daac] text-sm font-bold text-[#161410] md:h-9 md:w-32";
    const elementoNaoselecionado =
      "md:text-md flex h-7 w-24 cursor-pointer items-center justify-center rounded-sm border border-[#f2daac] bg-[#161410] text-sm font-bold text-[#f2daac] hover:bg-[#f2daac] hover:text-[#161410] md:h-9 md:w-32";
    if (categoryName === category) {
      return elementoSelecionado;
    } else {
      return elementoNaoselecionado;
    }
  }

  return (
    <div className="mx-auto mt-2 w-full px-2 text-white md:w-184.25 md:px-0">
      <div className="flex gap-3 py-2">
        <div
          onClick={() => {
            trocaCategoria("Hamburger");
          }}
          className={handleClassBotoes("Hamburger")}
        >
          Hamburger
        </div>
        <div
          onClick={() => {
            trocaCategoria("Bebida");
          }}
          className={handleClassBotoes("Bebida")}
        >
          Bebida
        </div>
        <div
          onClick={() => {
            trocaCategoria("Porção");
          }}
          className={handleClassBotoes("Porção")}
        >
          Porção
        </div>
      </div>
      <p className="mt-2 mb-2 font-bold text-[#f2daac] uppercase">{category}</p>

      <div className="flex flex-col gap-4">
        {produtosFiltrados.map((product) => (
          <Product
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            price={product.price}
            img={product.img}
            category={product.category}
            setProducts={setProducts}
          />
        ))}
        {produtosFiltrados.length === 0 && (
          <p className="text-lg font-bold text-white">
            Não existem produtos dessa categoria!
          </p>
        )}
      </div>
    </div>
  );
}
export default Home;
