/**
 * Erro com código HTTP. As rotas deixam o erro "subir" e o
 * tratador de erros do app.js responde com { error: mensagem }.
 */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }
}
