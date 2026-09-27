import { X } from "lucide-react";
import { CartItemContext } from "../contexts/CartItemsContext";
import { useEffect, useContext } from "react";
import Button from "./Button";
import CartItem from "./CartItem";

type CartType = {
  setShowCart: React.Dispatch<React.SetStateAction<boolean>>;
  showCart: boolean;
};

function Cart({ setShowCart, showCart }: CartType) {
  const { cartItems, setCartItems } = useContext(CartItemContext);

  async function finalizarPedido() {
    try {
      if (cartItems.length === 0) {
        return;
      }
      const response = await fetch("http://localhost:3000/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!response.ok) {
        console.log("problemas na finalização do pedido");
        return;
      }
      setCartItems([]);
      setShowCart(false);
      console.log(response.status);
    } catch (error) {}
  }

  async function handleGetCartItems() {
    const response = await fetch("http://localhost:3000/get-cartItems", {
      method: "GET",
      credentials: "include",
    });
    if (!response) {
      return;
    }
    const data = await response.json();
    setCartItems(data);
  }

  useEffect(() => {
    handleGetCartItems();
  }, []);

  return (
    <div className="absolute right-1 z-10 flex h-screen w-93.75 flex-col bg-[#F2DAAC] p-5">
      <div className="flex justify-between">
        <p className="cursor-pointer">
          <X onClick={() => setShowCart(!showCart)} size={18} />
        </p>
        <p className="text-mdfont-bold">Meu carrinho</p>
      </div>
      <div className="mt-10 flex flex-1 flex-col gap-3">
        {cartItems.map((cartItem) => (
          <CartItem
            key={cartItem.id}
            id={cartItem.id}
            name={cartItem.product.name}
            price={cartItem.product.price}
            qtd={cartItem.qtd}
            img={cartItem.product.img}
          />
        ))}
      </div>
      <Button onClick={finalizarPedido} title="Finalizar pedido" />
    </div>
  );
}

export default Cart;
