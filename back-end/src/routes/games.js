/**
 * ROTAS: jogos
 * ============
 * Públicas (site):
 *   GET /api/games            -> jogos publicados (vitrine da página /jogo)
 *   GET /api/games/:slug      -> um jogo + os outros jogos ("Outros projetos")
 *
 * Painel (com login):
 *   GET    /api/admin/games      -> admin: todos | estúdio: só os dele
 *   GET    /api/admin/games/:id  -> um jogo para editar
 *   POST   /api/admin/games      -> cria (estúdio: o jogo fica no estúdio dele)
 *   PUT    /api/admin/games/:id  -> edita
 *   DELETE /api/admin/games/:id  -> apaga
 *
 * Quem pode mexer em quê: ver services/permissions.js
 */

import { Router } from 'express'
import * as games from '../services/games.js'
import { HttpError } from '../services/errors.js'
import { scopeFor, assertCanManage, ownerFor } from '../services/permissions.js'

const NOT_YOURS = 'Você só pode mexer nos jogos do seu estúdio.'

export function publicGameRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ games: games.listPublicGames(db) })
  })

  router.get('/:slug', (req, res) => {
    res.json(games.getPublicGame(db, req.params.slug))
  })

  return router
}

export function adminGameRoutes({ db }) {
  const router = Router()

  /** Busca o jogo e confere se o login pode mexer nele */
  const findOwnGame = (req) => {
    const game = games.getGame(db, req.params.id)
    if (!game) throw new HttpError(404, 'Jogo não encontrado.')
    assertCanManage(req.user, game.developerId, NOT_YOURS)
    return game
  }

  /** Dados do formulário com o dono certo (estúdio não escolhe outro estúdio) */
  const withOwner = (req) => ({ ...req.body, developerId: ownerFor(req.user, req.body?.developerId) })

  router.get('/', (req, res) => {
    res.json({ games: games.listAllGames(db, scopeFor(req.user)) })
  })

  router.get('/:id', (req, res) => {
    res.json({ game: findOwnGame(req) })
  })

  router.post('/', (req, res) => {
    res.status(201).json({ game: games.createGame(db, withOwner(req)) })
  })

  router.put('/:id', (req, res) => {
    findOwnGame(req)
    res.json({ game: games.updateGame(db, req.params.id, withOwner(req)) })
  })

  router.delete('/:id', (req, res) => {
    findOwnGame(req)
    games.deleteGame(db, req.params.id)
    res.status(204).end()
  })

  return router
}
