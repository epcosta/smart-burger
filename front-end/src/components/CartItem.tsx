import { Trash, ChevronRight, ChevronLeft } from "lucide-react";
import axios from "axios";
import { useState, useContext } from "react";
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

import vlrBr from "./utils/vlrBr";

export type CartItemType = {
  id: number;
  name: string;
  price: number;
  qtd: number;
  img: string;
};

function CartItem({ id, name, price, qtd, img }: CartItemType) {
  const [alertaExclusao, setAlertaExclusao] = useState(false);
  const [alertaSucesso, setAlertaSucesso] = useState(false);
  //const [quantidade, setQuantidade] = useState(qtd);
  const { setCartItems } = useContext(CartItemContext);

  async function alterarQuantidade(novaQuantidade: number) {
    if (novaQuantidade < 1) {
      return;
    }

    try {
      const response = await axios.patch(
        `http://localhost:3000/update-cartItem/${id}`,
        {
          qtd: novaQuantidade,
        },
        {
          withCredentials: true,
        },
      );

      setCartItems((cartItems) =>
        cartItems.map((item) =>
          item.id === id
            ? {
                ...item,
                qtd: response.data.data.qtd,
              }
            : item,
        ),
      );
    } catch (error) {
      console.log(error);
    }
  }

  function confirmarExclusao() {
    setAlertaExclusao(true);
  }

  async function excluirItem() {
    try {
      // Fecha o diálogo de confirmação
      setAlertaExclusao(false);

      await axios.delete(`http://localhost:3000/delete-cartItem/${id}`, {
        withCredentials: true,
      });

      // Abre o diálogo de sucesso
      setAlertaSucesso(true);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <div className="flex">
        <img src={`./${img}`} className="w-25 rounded-md" alt="" />

        <div className="ms-2 w-full">
          <p className="text-sm font-bold uppercase">{name}</p>

          <div className="flex items-center justify-between">
            <p className="mt-2 text-xs font-bold text-gray-600">
              {vlrBr(price * qtd)}
            </p>

            <Trash
              size={13}
              onClick={confirmarExclusao}
              className="cursor-pointer"
            />
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              onClick={() => alterarQuantidade(qtd - 1)}
              disabled={qtd === 1}
            >
              <ChevronLeft
                className={`rounded-sm text-white ${
                  qtd === 1
                    ? "cursor-not-allowed bg-gray-400"
                    : "cursor-pointer bg-red-700"
                }`}
                size={14}
              />
            </button>

            <p>{qtd}</p>

            <button onClick={() => alterarQuantidade(qtd + 1)}>
              <ChevronRight
                className="cursor-pointer rounded-sm bg-red-700 text-white"
                size={14}
              />
            </button>
          </div>
        </div>
      </div>

      {/* DIALOG DE CONFIRMAÇÃO */}
      <AlertDialog open={alertaExclusao} onOpenChange={setAlertaExclusao}>
        <AlertDialogContent size="lg" className="bg-[#F2DAAC]">
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja excluir este produto?</AlertDialogTitle>

            <AlertDialogDescription>
              Tem certeza que deseja excluir <strong>{name}</strong>? Esta
              operação não poderá ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>

            <AlertDialogAction onClick={excluirItem}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* DIALOG DE SUCESSO */}
      <AlertDialog open={alertaSucesso} onOpenChange={setAlertaSucesso}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Produto excluído</AlertDialogTitle>

            <AlertDialogDescription>
              O produto <strong>{name}</strong> foi excluído com sucesso!
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setAlertaSucesso(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default CartItem;
