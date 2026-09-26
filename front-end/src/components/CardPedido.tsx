import { User, Calendar, Clock } from "lucide-react";
import axios from "axios";
type CardPedidoType = {
  id: number;
  status: string;
  nomeUsuario: string;
  dtPedido: string;
  hrPedido: string;
  hrentrega?: string;
  vlrPedido: string;
  onStatusAlterado: (id: number) => void;
};
function CardPedido({
  id,
  status,
  nomeUsuario,
  dtPedido,
  hrPedido,
  hrentrega,
  vlrPedido,
  onStatusAlterado,
}: CardPedidoType) {
  async function alterarStatus(novoStatus: string) {
    if (!novoStatus) return;

    try {
      console.log(novoStatus, id, "#######");
      const response = await axios.patch(
        `http://localhost:3000/update-order-status/${id}`,
        {
          status_pedido: novoStatus,
        },
        {
          withCredentials: true,
        },
      );

      console.log(response.data);

      // remove o pedido da lista atual
      onStatusAlterado(id);
    } catch (error) {
      console.log("Erro ao alterar status:", error);
    }
  }

  return (
    <div>
      <div className="h-38.75 rounded-md bg-[#f2daac] p-2">
        <div className="text-sm font-bold text-[#161410]">
          <div className="flex justify-between">
            <p>{id}</p>
            <select
              value={status}
              onChange={(e) => alterarStatus(e.target.value)}
              className="font-bold"
            >
              <option value="Pendente">Pendente</option>
              <option value="Retirado">Retirado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1">
          <p>
            <User size={16} className="text-[#161410]" />
          </p>
          <p className="text-xs text-[#32343E]">{nomeUsuario}</p>
        </div>
        <div className="mt-2 flex items-center gap-1">
          <p>
            <Calendar size={16} className="text-[#161410]" />
          </p>
          <p className="text-xs text-[#32343E]">{dtPedido}</p>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <p>
            <Clock size={16} className="font-bold text-[#161410]" />
          </p>
          <p className="text-xs text-[#32343E]">{hrPedido}</p>
          <p>
            <Clock size={16} className="ms-5 font-bold text-[#161410]" />
          </p>
          <p className="text-xs text-[#32343E]">
            {hrentrega ? hrentrega : "-"}
          </p>
        </div>
        <hr className="mt-3 text-[#161410]" />
        <p className="mt-1 text-right font-bold text-[#161410]">{vlrPedido}</p>
      </div>
    </div>
  );
}

export default CardPedido;
