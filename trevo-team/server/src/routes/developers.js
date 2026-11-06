/**
 * ROTAS: desenvolvedoras (só no painel, com login)
 * ================================================
 *   GET    /api/admin/developers      -> lista
 *   GET    /api/admin/developers/:id  -> uma, para editar
 *   POST   /api/admin/developers      -> cria
 *   PUT    /api/admin/developers/:id  -> edita
 *   DELETE /api/admin/developers/:id  -> apaga (os posts dela continuam)
 */

import { Router } from 'express'
import * as devs from '../services/developers.js'
import { HttpError } from '../services/errors.js'

export function adminDeveloperRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ developers: devs.listDevelopers(db) })
  })

  router.get('/:id', (req, res) => {
    const developer = devs.getDeveloper(db, req.params.id)
    if (!developer) throw new HttpError(404, 'Desenvolvedora não encontrada.')
    res.json({ developer })
  })

  router.post('/', (req, res) => {
    res.status(201).json({ developer: devs.createDeveloper(db, req.body) })
  })

  router.put('/:id', (req, res) => {
    res.json({ developer: devs.updateDeveloper(db, req.params.id, req.body) })
  })

  router.delete('/:id', (req, res) => {
    devs.deleteDeveloper(db, req.params.id)
    res.status(204).end()
  })

  return router
}
