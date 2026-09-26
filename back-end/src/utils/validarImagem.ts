import { fileTypeFromFile } from "file-type";

export async function validarImagem(caminho: string) {
  const tipo = await fileTypeFromFile(caminho);

  if (!tipo) {
    return null;
  }

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(tipo.mime)) {
    return null;
  }

  return tipo;
}
