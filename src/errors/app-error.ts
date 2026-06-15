export class AppError extends Error {
  // Erro de dominio com status HTTP e detalhes opcionais.
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}
