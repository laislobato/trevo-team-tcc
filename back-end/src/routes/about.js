/**
 * ROTAS: about
 * ============
 * Pública (site):
 *   GET /api/about        -> { cards: [...] } cards do topo da página About
 *
 * Painel (só admin da Trevo):
 *   GET /api/admin/about  -> { cards: [...] }
 *   PUT /api/admin/about  -> troca os cards { cards: [...] }
 */

import { Router } from 'express'
import * as about from '../services/about.js'

export function publicAboutRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ cards: about.listAboutCards(db) })
  })

  return router
}

export function adminAboutRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ cards: about.listAboutCards(db) })
  })

  router.put('/', (req, res) => {
    res.json({ cards: about.replaceAboutCards(db, req.body?.cards) })
  })

  return router
}