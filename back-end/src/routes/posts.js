/**
 * ROTAS: posts
 * ============
 * Públicas (site):
 *   GET /api/posts             -> lista os posts publicados (?type=anuncio|patch|aviso)
 *   GET /api/posts/:slug       -> um post + anterior e próximo
 *
 * Painel (com login):
 *   GET    /api/admin/posts      -> admin: todos | estúdio: só os dele
 *   GET    /api/admin/posts/:id  -> um post para editar
 *   POST   /api/admin/posts      -> cria (estúdio: o post fica no estúdio dele)
 *   PUT    /api/admin/posts/:id  -> edita
 *   DELETE /api/admin/posts/:id  -> apaga
 *
 * Quem pode mexer em quê: ver services/permissions.js
 */

import { Router } from 'express'
import * as posts from '../services/posts.js'
import { HttpError } from '../services/errors.js'
import { scopeFor, assertCanManage, ownerFor } from '../services/permissions.js'

const NOT_YOURS = 'Você só pode mexer nos posts do seu estúdio.'

export function publicPostRoutes({ db }) {
  const router = Router()

  router.get('/', (req, res) => {
    res.json({ posts: posts.listPublicPosts(db, req.query.type) })
  })

  router.get('/:slug', (req, res) => {
    res.json(posts.getPublicPost(db, req.params.slug))
  })

  return router
}

export function adminPostRoutes({ db }) {
  const router = Router()

  /** Busca o post e confere se o login pode mexer nele */
  const findOwnPost = (req) => {
    const post = posts.getPost(db, req.params.id)
    if (!post) throw new HttpError(404, 'Post não encontrado.')
    assertCanManage(req.user, post.developerId, NOT_YOURS)
    return post
  }

  /** Dados do formulário com o dono certo (estúdio não escolhe outro estúdio) */
  const withOwner = (req) => ({ ...req.body, developerId: ownerFor(req.user, req.body?.developerId) })

  router.get('/', (req, res) => {
    res.json({ posts: posts.listAllPosts(db, scopeFor(req.user)) })
  })

  router.get('/:id', (req, res) => {
    res.json({ post: findOwnPost(req) })
  })

  router.post('/', (req, res) => {
    res.status(201).json({ post: posts.createPost(db, withOwner(req)) })
  })

  router.put('/:id', (req, res) => {
    findOwnPost(req)
    res.json({ post: posts.updatePost(db, req.params.id, withOwner(req)) })
  })

  router.delete('/:id', (req, res) => {
    findOwnPost(req)
    posts.deletePost(db, req.params.id)
    res.status(204).end()
  })

  return router
}
