import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from "react";

import type { ProductType } from "../types/Product";

type ProductContextType = {
  products: ProductType[];
  setProducts: Dispatch<SetStateAction<ProductType[]>>;
  getProducts: () => Promise<void>;
};

export const ProductContext = createContext<ProductContextType>(
  {} as ProductContextType,
);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<ProductType[]>([]);

  async function getProducts() {
    try {
      const response = await fetch("http://localhost:3000/get-products");

      if (!response.ok) {
        setProducts([]);
        return;
      }

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        getProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}
