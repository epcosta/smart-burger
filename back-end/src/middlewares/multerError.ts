import type { Request, Response, NextFunction } from "express";

import multer from "multer";

export function multerError(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      res.status(400).json({
        msg: "A imagem deve possuir no máximo 5 MB",
      });
      return;
    }

    res.status(400).json({
      msg: `Erro no upload: ${error.message}`,
    });

    return;
  }

  if (error instanceof Error) {
    res.status(400).json({
      msg: error.message,
    });

    return;
  }

  next(error);
}
