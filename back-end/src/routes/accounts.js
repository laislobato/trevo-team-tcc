/**
 * ROTAS: logins dos estúdios (só admin)
 * =====================================
 *   GET    /api/admin/accounts                 -> todos os logins de estúdio
 *   GET    /api/admin/accounts?developerId=3   -> só os logins de um estúdio
 *   POST   /api/admin/accounts                 -> cria { email, password, developerId }
 *   PUT    /api/admin/accounts/:id             -> edita { email, password }
 *                                                 (senha vazia = continua a mesma)
 *   DELETE /api/admin/accounts/:id             -> apaga o login
 *
 * Estas rotas não mexem na conta de admin: ela troca a própria senha
 * em POST /api/auth/password, como antes.
 */

import { Router } from 'express'
import * as users from '../services/users.js'

export function adminAccountRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ accounts: users.listStudioAccounts(db, req.query.developerId) })
  })

  router.post('/', (req, res) => {
    res.status(201).json({ account: users.createStudioAccount(db, req.body) })
  })

  router.put('/:id', (req, res) => {
    res.json({ account: users.updateStudioAccount(db, req.params.id, req.body) })
  })

  router.delete('/:id', (req, res) => {
    users.deleteStudioAccount(db, req.params.id)
    res.status(204).end()
  })

  return router
}
