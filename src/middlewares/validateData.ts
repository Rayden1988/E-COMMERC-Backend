import { type NextFunction, type Request, type Response, type RequestHandler } from "express";
import { type ZodTypeAny } from "zod";

type ValidationSource = "body" | "params" | "query";

function validateData(schema: ZodTypeAny, source: ValidationSource): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten(),
      });
    }

    next();
  };
}

export { validateData };
