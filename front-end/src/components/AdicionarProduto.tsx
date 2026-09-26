import { Plus, X, ImagePlus } from "lucide-react";
import { useRef, useState } from "react";

type AdicionarProdutoProps = {
  fechar: () => void;
  atualizarProdutos: () => Promise<void>;
};

function AdicionarProduto({
  fechar,
  atualizarProdutos,
}: AdicionarProdutoProps) {
  const inputImagemRef = useRef<HTMLInputElement>(null);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [imagem, setImagem] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  function selecionarImagem(event: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = event.target.files?.[0];

    if (!arquivo) return;

    setImagem(arquivo);

    const urlImagem = URL.createObjectURL(arquivo);
    setPreview(urlImagem);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      if (!imagem) {
        console.log("Selecione uma imagem");
        return;
      }

      const formData = new FormData();

      formData.append("name", nome);
      formData.append("description", descricao);
      formData.append("category", categoria);
      formData.append("price", valor);
      formData.append("img", imagem);

      const response = await fetch("http://localhost:3000/create-product", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        console.log(data.msg);
        return;
      }

      console.log(data);

      await atualizarProdutos();
      fechar();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <form
        onSubmit={handleSubmit}
        className="w-[95%] max-w-125 rounded-md border border-gray-700 bg-[#24211c] p-4"
      >
        {/* Cabeçalho */}
        <div className="mb-4 flex items-center justify-between">
          <div></div>

          <h2 className="font-bold text-gray-300">Adicionar produto</h2>

          <X
            size={20}
            onClick={fechar}
            className="cursor-pointer text-gray-400 hover:text-white"
          />
        </div>

        <div className="flex gap-3">
          {/* IMAGEM */}
          <div
            onClick={() => inputImagemRef.current?.click()}
            className="flex h-32 w-38 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-md border border-gray-500 hover:bg-white/5"
          >
            {preview ? (
              <img
                src={preview}
                alt="Imagem do produto"
                className="h-full w-full object-cover"
              />
            ) : (
              <Plus size={38} className="text-gray-400" />
            )}

            <input
              ref={inputImagemRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={selecionarImagem}
              className="hidden"
            />
          </div>

          {/* CAMPOS */}
          <div className="flex flex-1 flex-col gap-2">
            <input
              type="text"
              placeholder="Nome do produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-8 rounded-md border border-gray-500 bg-transparent px-2 text-sm text-white outline-none"
              required
            />

            <input
              type="text"
              placeholder="Descrição"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="h-8 rounded-md border border-gray-500 bg-transparent px-2 text-sm text-white outline-none"
              required
            />

            <select
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              className="h-8 rounded-md border border-gray-500 bg-[#24211c] px-2 text-sm text-gray-300 outline-none"
              required
            >
              <option value="" disabled>
                Categoria
              </option>

              <option value="Hamburger">Hamburger</option>
              <option value="Bebida">Bebida</option>
              <option value="Porção">Porção</option>
            </select>

            <input
              type="number"
              placeholder="Preço"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="0"
              step="0.01"
              className="h-8 rounded-md border border-gray-500 bg-transparent px-2 text-sm text-white outline-none"
              required
            />
          </div>
        </div>

        {/* BOTÃO */}
        <button
          type="submit"
          className="mt-3 flex h-8 w-full cursor-pointer items-center justify-center gap-2 rounded-md bg-[#e52b12] text-sm font-bold text-white hover:bg-[#c92410]"
        >
          <ImagePlus size={16} />
          Adicionar produto
        </button>
      </form>
    </div>
  );
}

export default AdicionarProduto;
