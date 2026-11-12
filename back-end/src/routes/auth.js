/**
 * ROTAS: login
 * ============
 * POST /api/auth/login     -> { email, password } => { token, user }
 * GET  /api/auth/me        -> confere se o token ainda vale (com login)
 * POST /api/auth/password  -> troca a senha (com login)
 */

import { Router } from 'express'
import { checkLogin, changePassword } from '../services/users.js'
import { createToken } from '../services/tokens.js'
import { createLimiter } from '../services/rateLimit.js'

export function authRoutes({ db, config, requireLogin }) {
  const router = Router()
  // No máximo 5 tentativas erradas a cada 15 minutos por IP
  const limiter = createLimiter({ max: 5, windowMs: 15 * 60 * 1000 })

  router.post('/login', (req, res) => {
    const key = req.ip
    if (!limiter.isAllowed(key)) {
      return res.status(429).json({ error: 'Muitas tentativas. Espere 15 minutos e tente de novo.' })
    }

    const { email, password } = req.body || {}
    const user = checkLogin(db, email, password)
    if (!user) {
      limiter.fail(key)
      return res.status(401).json({ error: 'E-mail ou senha incorretos.' })
    }

    limiter.reset(key)
    const token = createToken({ sub: user.id }, config.tokenSecret, config.tokenHours)
    res.json({ token, user })
  })

  router.get('/me', requireLogin, (req, res) => {
    res.json({ user: req.user })
  })

  router.post('/password', requireLogin, (req, res) => {
    const { currentPassword, newPassword } = req.body || {}
    changePassword(db, req.user.id, currentPassword, newPassword)
    res.json({ ok: true })
  })

  return router
}
