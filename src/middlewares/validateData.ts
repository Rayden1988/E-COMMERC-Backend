import { type NextFunction, type Request, type Response, type RequestHandler } from "express";
import { type ZodTypeAny } from "zod";

type ValidationSource = "body" | "params" | "query";

// Valida body, params ou query usando um schema do Zod.
function validateData(schema: ZodTypeAny, source: ValidationSource): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Se falhar, retorna o erro formatado para o cliente
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    // Se estiver tudo certo, segue para a próxima etapa
    next();
  };
}

export { validateData };
