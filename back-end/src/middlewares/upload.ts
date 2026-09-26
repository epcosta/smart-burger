import multer from "multer";
import path from "path";
import fs from "fs";

const pastaUpload = "uploads";

// Cria a pasta caso ela não exista
if (!fs.existsSync(pastaUpload)) {
  fs.mkdirSync(pastaUpload, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, pastaUpload);
  },

  filename: (req, file, cb) => {
    const extensao = path.extname(file.originalname);

    const nomeArquivo = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${extensao}`;

    cb(null, nomeArquivo);
  },
});

const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(file.mimetype)) {
    cb(new Error("Formato de imagem inválido. Utilize JPG, PNG ou WEBP."));
    return;
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 30 * 1024 * 1024, // 30 MB
  },
});
