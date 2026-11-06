/**
 * ROTAS: posts
 * ============
 * Públicas (site):
 *   GET /api/posts             -> lista os posts publicados (?type=anuncio|patch|aviso)
 *   GET /api/posts/:slug       -> um post + anterior e próximo
 *
 * Painel (com login):
 *   GET    /api/admin/posts      -> todos, inclusive rascunhos e agendados
 *   GET    /api/admin/posts/:id  -> um post para editar
 *   POST   /api/admin/posts      -> cria
 *   PUT    /api/admin/posts/:id  -> edita
 *   DELETE /api/admin/posts/:id  -> apaga
 */

import { Router } from 'express'
import * as posts from '../services/posts.js'
import { HttpError } from '../services/errors.js'

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

  router.get('/', (req, res) => {
    res.json({ posts: posts.listAllPosts(db) })
  })

  router.get('/:id', (req, res) => {
    const post = posts.getPost(db, req.params.id)
    if (!post) throw new HttpError(404, 'Post não encontrado.')
    res.json({ post })
  })

  router.post('/', (req, res) => {
    res.status(201).json({ post: posts.createPost(db, req.body) })
  })

  router.put('/:id', (req, res) => {
    res.json({ post: posts.updatePost(db, req.params.id, req.body) })
  })

  router.delete('/:id', (req, res) => {
    posts.deletePost(db, req.params.id)
    res.status(204).end()
  })

  return router
}
