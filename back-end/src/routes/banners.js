/**
 * ROTAS: banners
 * ==============
 * Públicas (site):
 *   GET /api/banners/home        -> banners da página inicial
 *   GET /api/banners/jogos       -> banners da página /jogo
 *
 * Painel (só admin da Trevo):
 *   GET /api/admin/banners       -> { home: [...], jogos: [...] }
 *   PUT /api/admin/banners/:page -> troca a lista da página { banners: [...] }
 */

import { Router } from 'express'
import * as banners from '../services/banners.js'

export function publicBannerRoutes({ db }) {
  const router = Router()

  router.get('/:page', (req, res) => {
    res.json({ banners: banners.listBanners(db, req.params.page) })
  })

  return router
}

export function adminBannerRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json(banners.listAllBanners(db))
  })

  router.put('/:page', (req, res) => {
    res.json({ banners: banners.replaceBanners(db, req.params.page, req.body?.banners) })
  })

  return router
}
