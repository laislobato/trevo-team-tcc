/**
 * ARQUIVO: app.js
 * ===============
 * Monta o servidor Express: segurança básica, rotas e tratamento de erros.
 *
 * Mapa da API:
 *   GET  /api/health                 -> servidor no ar?
 *   POST /api/auth/login             -> login (admin da Trevo ou estúdio)
 *   GET  /api/auth/me                -> confere o login (com o tipo e o estúdio)
 *   POST /api/auth/password          -> troca a senha
 *   GET  /api/posts                  -> posts publicados (site)
 *   GET  /api/posts/:slug            -> um post (site)
 *   GET  /api/games                  -> jogos publicados (site)
 *   GET  /api/games/:slug            -> um jogo + os outros (site)
 *   GET  /api/banners/:page          -> banners da Home ou da página /jogo (site)
 *   /api/admin/posts                 -> criar, editar e apagar posts (login; estúdio só os dele)
 *   /api/admin/games                 -> criar, editar e apagar jogos (login; estúdio só os dele)
 *   /api/admin/developers            -> desenvolvedoras (login; estúdio só a dele)
 *   /api/admin/accounts              -> logins dos estúdios (só admin)
 *   /api/admin/banners               -> banners da Home e da página /jogo (só admin)
 *   POST /api/admin/uploads          -> enviar imagem (login)
 *   GET  /uploads/<arquivo>          -> imagens enviadas
 */

import express from 'express'
import cors from 'cors'
import { requireAuth, requireAdmin } from './middleware/auth.js'
import { authRoutes } from './routes/auth.js'
import { publicPostRoutes, adminPostRoutes } from './routes/posts.js'
import { publicGameRoutes, adminGameRoutes } from './routes/games.js'
import { adminDeveloperRoutes } from './routes/developers.js'
import { adminAccountRoutes } from './routes/accounts.js'
import { publicBannerRoutes, adminBannerRoutes } from './routes/banners.js'
import { uploadRoutes } from './routes/uploads.js'

export function createApp({ db, config }) {
  const app = express()

  // ---------- Segurança básica ----------
  app.disable('x-powered-by') // não conta qual tecnologia o servidor usa
  app.set('trust proxy', 1) // na hospedagem, pega o IP real do visitante (limite de login)
  app.use(cors({ origin: config.frontUrls })) // só o nosso front pode chamar a API
  app.use(express.json({ limit: '200kb' }))
  app.use((req, res, next) => {
    res.set('X-Content-Type-Options', 'nosniff')
    res.set('Referrer-Policy', 'no-referrer')
    next()
  })

  // ---------- Imagens enviadas pelo painel ----------
  app.use(
    '/uploads',
    express.static(config.uploadDir, {
      index: false,
      dotfiles: 'ignore',
      maxAge: '7d',
      // a imagem é aberta como imagem, nunca como página
      setHeaders: (res) => res.set('Content-Security-Policy', "default-src 'none'; img-src 'self'"),
    }),
  )

  // ---------- Rotas ----------
  const requireLogin = requireAuth(db, config.tokenSecret)

  app.get('/api/health', (req, res) => res.json({ ok: true }))
  app.use('/api/auth', authRoutes({ db, config, requireLogin }))
  app.use('/api/posts', publicPostRoutes({ db }))
  app.use('/api/games', publicGameRoutes({ db }))
  app.use('/api/banners', publicBannerRoutes({ db }))
  app.use('/api/admin/posts', requireLogin, adminPostRoutes({ db }))
  app.use('/api/admin/games', requireLogin, adminGameRoutes({ db }))
  app.use('/api/admin/developers', requireLogin, adminDeveloperRoutes({ db }))
  app.use('/api/admin/accounts', requireLogin, requireAdmin, adminAccountRoutes({ db }))
  app.use('/api/admin/banners', requireLogin, requireAdmin, adminBannerRoutes({ db }))
  app.use('/api/admin/uploads', requireLogin, uploadRoutes({ config }))

  // Rota da API que não existe
  app.use('/api', (req, res) => res.status(404).json({ error: 'Rota não encontrada.' }))

  // ---------- Tratamento de erros ----------
  // eslint-disable-next-line no-unused-vars
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'Dados enviados em formato inválido.' })
    }
    if (error.type === 'entity.too.large') {
      return res.status(413).json({ error: 'Conteúdo grande demais.' })
    }
    if (error.status && error.status < 500) {
      return res.status(error.status).json({ error: error.message, details: error.details })
    }
    console.error(error) // erro inesperado: aparece no terminal/log da hospedagem
    res.status(500).json({ error: 'Erro no servidor. Tente de novo.' })
  })

  return app
}