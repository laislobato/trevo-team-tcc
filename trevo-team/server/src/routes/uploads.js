/**
 * ROTA: upload de imagens (só no painel, com login)
 * =================================================
 *   POST /api/admin/uploads   (formulário com o campo "image")
 *   => { url: "/uploads/<nome-aleatorio>.<ext>" }
 *
 * Regras de segurança:
 * - só aceita JPG, PNG, WEBP e GIF, conferindo o tipo e os primeiros bytes
 *   do arquivo (assim não dá para enviar outro arquivo com nome de imagem);
 * - no máximo 5 MB;
 * - o nome do arquivo é aleatório (o nome original é ignorado).
 */

import { Router } from 'express'
import multer from 'multer'
import { randomUUID } from 'node:crypto'
import { mkdirSync, openSync, readSync, closeSync, unlinkSync } from 'node:fs'
import { HttpError } from '../services/errors.js'

const TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

/** Confere a "assinatura" do arquivo (primeiros bytes) */
function looksLikeImage(path, mime) {
  const buffer = Buffer.alloc(12)
  const fd = openSync(path, 'r')
  readSync(fd, buffer, 0, 12, 0)
  closeSync(fd)
  const hex = buffer.toString('hex')
  if (mime === 'image/jpeg') return hex.startsWith('ffd8ff')
  if (mime === 'image/png') return hex.startsWith('89504e47')
  if (mime === 'image/gif') return hex.startsWith('47494638')
  if (mime === 'image/webp') return hex.startsWith('52494646') && buffer.toString('ascii', 8, 12) === 'WEBP'
  return false
}

export function uploadRoutes({ config }) {
  mkdirSync(config.uploadDir, { recursive: true })

  const upload = multer({
    storage: multer.diskStorage({
      destination: config.uploadDir,
      filename: (req, file, done) => done(null, `${randomUUID()}.${TYPES[file.mimetype]}`),
    }),
    limits: { fileSize: config.maxUploadMb * 1024 * 1024, files: 1 },
    fileFilter: (req, file, done) => {
      if (TYPES[file.mimetype]) done(null, true)
      else done(new HttpError(400, 'Envie uma imagem JPG, PNG, WEBP ou GIF.'))
    },
  })

  const router = Router()

  router.post('/', (req, res, next) => {
    upload.single('image')(req, res, (error) => {
      if (error?.code === 'LIMIT_FILE_SIZE') {
        return next(new HttpError(400, `A imagem pode ter no máximo ${config.maxUploadMb} MB.`))
      }
      if (error) return next(error)
      if (!req.file) return next(new HttpError(400, 'Nenhuma imagem enviada.'))

      if (!looksLikeImage(req.file.path, req.file.mimetype)) {
        unlinkSync(req.file.path)
        return next(new HttpError(400, 'O arquivo não é uma imagem válida.'))
      }
      res.status(201).json({ url: `/uploads/${req.file.filename}` })
    })
  })

  return router
}

