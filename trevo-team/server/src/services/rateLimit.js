/**
 * SERVIÇO: limite de tentativas
 * =============================
 * Impede que alguém fique testando senhas sem parar no login:
 * depois de "max" tentativas erradas em "windowMs", o IP espera.
 * Fica na memória do servidor (zera quando ele reinicia).
 */

export function createLimiter({ max = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const attempts = new Map() // chave -> { count, resetAt }

  return {
    /** true = ainda pode tentar */
    isAllowed(key) {
      const entry = attempts.get(key)
      if (!entry || entry.resetAt <= Date.now()) return true
      return entry.count < max
    },
    /** registra uma tentativa errada */
    fail(key) {
      const entry = attempts.get(key)
      if (!entry || entry.resetAt <= Date.now()) {
        attempts.set(key, { count: 1, resetAt: Date.now() + windowMs })
      } else {
        entry.count += 1
      }
    },
    /** login certo: zera as tentativas */
    reset(key) {
      attempts.delete(key)
    },
  }
}
