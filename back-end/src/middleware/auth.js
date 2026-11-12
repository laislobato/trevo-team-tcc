/**
 * MIDDLEWARES: requireAuth e requireAdmin
 * =======================================
 * requireAuth protege as rotas do painel. Só deixa passar quem mandou um
 * token válido:
 *
 *   Authorization: Bearer <token>
 *
 * Se o token for válido, req.user recebe { id, email, role, developerId, developer }.
 * O usuário é lido do banco a cada pedido: se o admin apagar um login,
 * ele perde o acesso na hora, mesmo com o token ainda dentro do prazo.
 *
 * requireAdmin vem depois do requireAuth e só deixa passar a equipe da Trevo.
 */

import { verifyToken } from '../services/tokens.js'
import { getUser } from '../services/users.js'
import { isAdmin } from '../services/permissions.js'

export function requireAuth(db, secret) {
  return (req, res, next) => {
    const header = req.get('authorization') || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    const data = verifyToken(token, secret)
    const user = data && getUser(db, data.sub)

    if (!user) {
      return res.status(401).json({ error: 'Faça login para continuar.' })
    }
    req.user = user
    next()
  }
}

export function requireAdmin(req, res, next) {
  if (!isAdmin(req.user)) {
    return res.status(403).json({ error: 'Só a equipe da Trevo pode fazer isso.' })
  }
  next()
}