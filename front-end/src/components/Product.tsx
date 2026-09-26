import { ShoppingCart } from "lucide-react";
import vlrBr from "./utils/vlrBr";
import { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { CartItemContext } from "../contexts/CartItemsContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { ProductProps } from "../types/Product";

function Product({
  id,
  name,
  description,
  price,
  img,
  setProducts,
}: ProductProps) {
  const { user } = useContext(UserContext);
  const { setCartItems } = useContext(CartItemContext);
  const [alertaExclusao, setAlertaExclusao] = useState(false);
  const [mensagemExclusao, setMensagemExclusao] = useState(null);

  async function getProducts() {
    const response = await fetch("http://localhost:3000/get-products");
    if (!response.ok) {
      return;
    }
    const data = await response.json();
    setProducts(data);
  }

  async function getCartItems() {
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

  async function addCartItem() {
    try {
      const response = await fetch("http://localhost:3000/create-cartItem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId: id }),
      });
      if (!response.ok) {
        console.log(`"Produto com o id ${id} não foi adicionado"`);
        return;
      }
      getCartItems();
    } catch (error) {
      console.log(error, id);
      return;
    }
  }

  async function handleDeleteProduct(id: number) {
    try {
      if (!id) {
        return;
      }
      const response = await fetch(
        "http://localhost:3000/delete-product/" + id,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      const data = await response.json();

      if (!response.ok) {
        setMensagemExclusao(data.msg);
        return;
      }
      setAlertaExclusao(false);

      getProducts();
    } catch (error: any) {
      console.log(error);

      return;
    }

    //const data = await response.json();
    //setProducts(data);
  }

  return (
    <div>
      <div className="flex">
        <img
          src={`http://localhost:3000/uploads/${img}`}
          alt=""
          className="h-20.75 w-25 cursor-pointer md:h-41.5 md:w-50"
        />
        <div className="ms-2 flex w-full flex-col">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold uppercase">{name}</p>
            {user?.admin ? (
              <p
                onClick={() => {
                  setMensagemExclusao(null);
                  setAlertaExclusao(true);
                }}
                className="flex h-4 w-19.5 cursor-pointer items-center justify-center rounded-md border border-red-500 p-3 text-sm text-red-500 hover:bg-[#F2DAAC] hover:text-[#161410]"
              >
                Excluir
              </p>
            ) : (
              ""
            )}
          </div>
          <p className="flex-1 text-xs text-[#848484] md:text-lg">
            {description}
          </p>
          <div className="flex items-center justify-end gap-2">
            <p className="text-[#F2DAAC]">{vlrBr(price)}</p>
            <ShoppingCart
              onClick={addCartItem}
              size={18}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>

      <AlertDialog open={alertaExclusao} onOpenChange={setAlertaExclusao}>
        <AlertDialogContent size="lg" className="bg-[#F2DAAC]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {mensagemExclusao
                ? "PROBLEMAS NA EXCLUSÃO DO PRODUTO"
                : "CONFIRMAR EXCLUSÃO"}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {mensagemExclusao ? (
                mensagemExclusao
              ) : (
                <>
                  Deseja realmente excluir o produto <strong>{name}</strong>?
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            {mensagemExclusao ? (
              <AlertDialogCancel onClick={() => setMensagemExclusao(null)}>
                OK
              </AlertDialogCancel>
            ) : (
              <>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>

                <AlertDialogAction
                  onClick={(event) => {
                    event.preventDefault();
                    handleDeleteProduct(id);
                  }}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  Excluir
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default Product;
