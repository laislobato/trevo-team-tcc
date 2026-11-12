/**
 * SERVIÇO: posts
 * ==============
 * Ler, criar, editar e apagar posts do blog.
 *
 * Regras:
 * - O site público só mostra posts com status "publicado" e data de
 *   publicação já passada. Data no futuro = post agendado.
 * - O endereço (slug) é criado a partir do título e não muda depois,
 *   para os links compartilhados continuarem funcionando.
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'
import { getDeveloper } from './developers.js'

export const POST_TYPES = ['anuncio', 'patch', 'aviso']
export const POST_STATUS = ['rascunho', 'publicado']

// ---------------------------------------------------------------
// Datas: o banco guarda "AAAA-MM-DD HH:MM:SS" em UTC
// ---------------------------------------------------------------
const toSqlDate = (date) => date.toISOString().replace('T', ' ').slice(0, 19)
const toIso = (sql) => (sql ? `${sql.replace(' ', 'T')}Z` : null)

/** "Raízes de Vidro!" -> "raizes-de-vidro" */
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // tira acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'post'
}

function uniqueSlug(db, title) {
  const base = slugify(title)
  let slug = base
  for (let n = 2; db.prepare('SELECT 1 FROM posts WHERE slug = ?').get(slug); n += 1) {
    slug = `${base}-${n}`
  }
  return slug
}

/** Linha do banco -> objeto da API (com a desenvolvedora junto) */
function toApi(db, row) {
  if (!row) return null
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    title: row.title,
    excerpt: row.excerpt,
    subtitle: row.subtitle,
    body: row.body,
    cover: row.cover,
    gallery: JSON.parse(row.gallery),
    author: { name: row.author_name, photo: row.author_photo },
    developerId: row.developer_id,
    developer: row.developer_id ? getDeveloper(db, row.developer_id) : null,
    status: row.status,
    publishedAt: toIso(row.published_at),
    updatedAt: toIso(row.updated_at),
  }
}

/** Confere os dados enviados pelo painel e devolve a versão limpa. */
export function validatePost(db, input = {}) {
  const errors = {}
  const gallery = v.list(input.gallery, 'gallery', errors, 3)
  const data = {
    type: v.oneOf(input.type, POST_TYPES, 'type', errors, 'Tipo'),
    title: v.text(input.title, 'title', errors, { min: 3, max: 150, label: 'Título' }),
    excerpt: v.text(input.excerpt, 'excerpt', errors, { max: 300, label: 'Resumo' }),
    subtitle: v.text(input.subtitle, 'subtitle', errors, { max: 200, label: 'Subtítulo' }),
    body: v.text(input.body, 'body', errors, { max: 20000, label: 'Texto' }),
    cover: v.image(input.cover, 'cover', errors),
    gallery: gallery.map((img, i) => v.image(img, `gallery.${i}`, errors)),
    authorName: v.text(input.authorName, 'authorName', errors, { max: 80, label: 'Autor' }),
    authorPhoto: v.image(input.authorPhoto, 'authorPhoto', errors),
    developerId: null,
    status: v.oneOf(input.status, POST_STATUS, 'status', errors, 'Situação'),
    publishedAt: null,
  }

  if (input.developerId !== undefined && input.developerId !== null && input.developerId !== '') {
    data.developerId = Number(input.developerId)
    if (!getDeveloper(db, data.developerId)) errors.developerId = 'Desenvolvedora não encontrada.'
  }

  if (input.publishedAt) {
    const date = new Date(input.publishedAt)
    if (Number.isNaN(date.getTime())) errors.publishedAt = 'Data inválida.'
    else data.publishedAt = toSqlDate(date)
  }

  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)
  return data
}

function params(data) {
  return {
    type: data.type,
    title: data.title,
    excerpt: data.excerpt,
    subtitle: data.subtitle,
    body: data.body,
    cover: data.cover,
    gallery: JSON.stringify(data.gallery),
    authorName: data.authorName,
    authorPhoto: data.authorPhoto,
    developerId: data.developerId,
    status: data.status,
    // Publicado sem data escolhida = publica agora
    publishedAt: data.publishedAt ?? (data.status === 'publicado' ? toSqlDate(new Date()) : null),
  }
}

// ---------------------------------------------------------------
// Leitura
// ---------------------------------------------------------------
const VISIBLE = `status = 'publicado' AND published_at IS NOT NULL AND published_at <= datetime('now')`
const NEWEST_FIRST = 'ORDER BY published_at DESC, id DESC'

/** Posts visíveis no site, do mais novo para o mais antigo (filtro opcional por tipo). */
export function listPublicPosts(db, type) {
  if (type && !POST_TYPES.includes(type)) throw new HttpError(400, 'Tipo de post inválido.')
  const rows = type
    ? db.prepare(`SELECT * FROM posts WHERE ${VISIBLE} AND type = ? ${NEWEST_FIRST}`).all(type)
    : db.prepare(`SELECT * FROM posts WHERE ${VISIBLE} ${NEWEST_FIRST}`).all()
  return rows.map((row) => toApi(db, row))
}

/**
 * Um post visível pelo slug, com o anterior (mais antigo) e o próximo
 * (mais novo) para os botões do fim da página.
 */
export function getPublicPost(db, slug) {
  const visible = db.prepare(`SELECT * FROM posts WHERE ${VISIBLE} ${NEWEST_FIRST}`).all()
  const index = visible.findIndex((row) => row.slug === slug)
  if (index === -1) throw new HttpError(404, 'Post não encontrado.')
  const summary = (row) => (row ? { slug: row.slug, title: row.title, cover: row.cover } : null)
  return {
    post: toApi(db, visible[index]),
    previous: summary(visible[index + 1]),
    next: summary(visible[index - 1]),
  }
}

/**
 * Todos os posts (inclusive rascunhos e agendados), para o painel.
 * Com { developerId }: só os posts desse estúdio (login de estúdio).
 */
export function listAllPosts(db, { developerId } = {}) {
  const order = 'ORDER BY COALESCE(published_at, created_at) DESC, id DESC'
  const rows = developerId
    ? db.prepare(`SELECT * FROM posts WHERE developer_id = ? ${order}`).all(Number(developerId))
    : db.prepare(`SELECT * FROM posts ${order}`).all()
  return rows.map((row) => toApi(db, row))
}

export function getPost(db, id) {
  return toApi(db, db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(id)))
}

// ---------------------------------------------------------------
// Escrita (só pelo painel, com login)
// ---------------------------------------------------------------
export function createPost(db, input) {
  const data = validatePost(db, input)
  const { lastInsertRowid } = db
    .prepare(`INSERT INTO posts (slug, type, title, excerpt, subtitle, body, cover, gallery,
                author_name, author_photo, developer_id, status, published_at)
              VALUES (:slug, :type, :title, :excerpt, :subtitle, :body, :cover, :gallery,
                :authorName, :authorPhoto, :developerId, :status, :publishedAt)`)
    .run({ ...params(data), slug: uniqueSlug(db, data.title) })
  return getPost(db, lastInsertRowid)
}

export function updatePost(db, id, input) {
  const current = db.prepare('SELECT * FROM posts WHERE id = ?').get(Number(id))
  if (!current) throw new HttpError(404, 'Post não encontrado.')
  const data = validatePost(db, input)
  const values = params(data)
  // Já publicado e sem nova data: mantém a data original
  if (!data.publishedAt && current.published_at && data.status === 'publicado') {
    values.publishedAt = current.published_at
  }
  db.prepare(`UPDATE posts SET type = :type, title = :title, excerpt = :excerpt, subtitle = :subtitle,
                body = :body, cover = :cover, gallery = :gallery, author_name = :authorName,
                author_photo = :authorPhoto, developer_id = :developerId, status = :status,
                published_at = :publishedAt, updated_at = CURRENT_TIMESTAMP
              WHERE id = :id`)
    .run({ ...values, id: Number(id) })
  return getPost(db, id)
}

export function deletePost(db, id) {
  const { changes } = db.prepare('DELETE FROM posts WHERE id = ?').run(Number(id))
  if (!changes) throw new HttpError(404, 'Post não encontrado.')
}
