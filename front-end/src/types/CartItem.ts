import type { ProductType } from "./Product";

export type CartItemType = {
  id: number;
  userId: number;
  productId: number;
  product: ProductType;
  qtd: number;
};

export type CartItemsContextType = {
  cartItems: CartItemType[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemType[]>>;
};
