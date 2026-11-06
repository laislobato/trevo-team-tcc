/**
 * MIDDLEWARE: requireAuth
 * =======================
 * Protege as rotas do painel. Só deixa passar quem mandou um token válido:
 *
 *   Authorization: Bearer <token>
 *
 * Se o token for válido, req.user recebe { id, email }.
 */

import { verifyToken } from '../services/tokens.js'
import { getUser } from '../services/users.js'

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
