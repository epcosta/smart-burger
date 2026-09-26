import { useEffect, useState } from "react";
import CardPedido from "../components/CardPedido";
import formatarData from "@/components/utils/formatarData";
import formatarHora from "@/components/utils/formatarHora";
import vlrBr from "@/components/utils/vlrBr";

type PedidoType = {
  id: number;
  total: number;
  status: string;
  userId: number;
  createAt: string;
  dtDeliver: string;
  user: {
    id: number;
    name: string;
  };
};

function Pedidos() {
  const [pedidos, setPedidos] = useState<PedidoType[]>([]);
  const [category, setCategory] = useState("Pendentes");
  const [mensagem, setMensagem] = useState("");

  const trocaCategoria = (newCategory: string) => {
    setPedidos([]);
    setMensagem("");
    setCategory(newCategory);
  };
  function removerPedidoDaLista(id: number) {
    setPedidos((pedidosAtuais) =>
      pedidosAtuais.filter((pedido) => pedido.id !== id),
    );
  }
  function getStatus(category: string) {
    switch (category) {
      case "Pendentes":
        return "Pendente";

      case "Retirados":
        return "Retirado";

      case "Cancelados":
        return "Cancelado";

      default:
        return "Pendente";
    }
  }

  //###################################################
  useEffect(() => {
    getOrders(getStatus(category));
  }, [category]);
  //###################################################

  async function getOrders(status: string) {
    try {
      setPedidos([]);
      setMensagem("");

      const response = await fetch(
        `http://localhost:3000/get-orders/${status}`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await response.json();
      if (!response.ok) {
        console.log(data.msg);
        setMensagem(data.msg);
        return;
      }

      if (!response.ok) {
        console.log(data);
        return;
      }

      setPedidos(data.data);
    } catch (error) {
      console.log(error);
    }
  }

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
      {/* Categorias */}
      <div className="flex gap-3 py-2">
        <div
          onClick={() => {
            trocaCategoria("Pendentes");
          }}
          className={handleClassBotoes("Pendentes")}
        >
          Pendentes
        </div>
        <div
          onClick={() => {
            trocaCategoria("Retirados");
          }}
          className={handleClassBotoes("Retirados")}
        >
          Retirados
        </div>
        <div
          onClick={() => {
            trocaCategoria("Cancelados");
          }}
          className={handleClassBotoes("Cancelados")}
        >
          Cancelados
        </div>
      </div>
      <div className="mt-2 grid grid-cols-3 gap-5">
        {mensagem ? (
          <p className="col-span-3 text-center text-sm">{mensagem}</p>
        ) : (
          pedidos.map((pedido) => (
            <CardPedido
              key={pedido.id}
              id={pedido.id}
              status={pedido.status}
              nomeUsuario={pedido.user.name.toLocaleUpperCase()}
              dtPedido={formatarData(pedido.createAt)}
              hrPedido={formatarHora(pedido.createAt)}
              hrentrega={pedido.dtDeliver ? formatarHora(pedido.dtDeliver) : ""}
              vlrPedido={vlrBr(pedido.total)}
              onStatusAlterado={removerPedidoDaLista}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Pedidos;
