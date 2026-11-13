/**
 * ROTAS: desenvolvedoras (só no painel, com login)
 * ================================================
 *   GET    /api/admin/developers      -> admin: todas | estúdio: só a dele
 *   GET    /api/admin/developers/:id  -> uma, para editar (estúdio: só a dele)
 *   POST   /api/admin/developers      -> cria (só admin)
 *   PUT    /api/admin/developers/:id  -> edita (estúdio: só a dele)
 *   DELETE /api/admin/developers/:id  -> apaga (só admin; os posts dela continuam,
 *                                        os logins dela são apagados; a Trevo Team não)
 *
 * Pública (site):
 *   GET /api/team                      -> equipe da página About (integrantes da Trevo Team)
 */

import { Router } from 'express'
import * as devs from '../services/developers.js'
import { HttpError } from '../services/errors.js'
import { isAdmin, assertCanManage } from '../services/permissions.js'
import { requireAdmin } from '../middleware/auth.js'

const NOT_YOURS = 'Você só pode editar o perfil do seu estúdio.'

export function publicTeamRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ team: devs.getTeam(db) })
  })

  return router
}

export function adminDeveloperRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    const developers = isAdmin(req.user)
      ? devs.listDevelopers(db)
      : [devs.getDeveloper(db, req.user.developerId)].filter(Boolean)
    res.json({ developers })
  })

  router.get('/:id', (req, res) => {
    assertCanManage(req.user, req.params.id, NOT_YOURS)
    const developer = devs.getDeveloper(db, req.params.id)
    if (!developer) throw new HttpError(404, 'Desenvolvedora não encontrada.')
    res.json({ developer })
  })

  router.post('/', requireAdmin, (req, res) => {
    res.status(201).json({ developer: devs.createDeveloper(db, req.body) })
  })

  router.put('/:id', (req, res) => {
    assertCanManage(req.user, req.params.id, NOT_YOURS)
    res.json({ developer: devs.updateDeveloper(db, req.params.id, req.body) })
  })

  router.delete('/:id', requireAdmin, (req, res) => {
    devs.deleteDeveloper(db, req.params.id)
    res.status(204).end()
  })

  return router
}