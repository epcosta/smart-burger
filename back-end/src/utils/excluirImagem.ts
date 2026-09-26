import fs from "fs";

export function excluirImagem(caminho?: string) {
  if (!caminho) return;

  if (fs.existsSync(caminho)) {
    fs.unlinkSync(caminho);
  }
}
