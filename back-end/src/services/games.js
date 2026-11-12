/**
 * SERVIÇO: jogos
 * ==============
 * Ler, criar, editar e apagar os jogos (vitrine /jogo e página /jogo/<slug>).
 *
 * Regras:
 * - O site público só mostra jogos com status "publicado".
 * - O endereço (slug) é criado a partir do título e não muda depois,
 *   para os links compartilhados continuarem funcionando.
 * - developerId = estúdio dono do jogo (quem pode editar: ver permissions.js).
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'
import { getDeveloper } from './developers.js'
import { slugify } from './posts.js'

// ===============================================
// OPÇÕES FIXAS
// ===============================================

export const GAME_STATUS = ['rascunho', 'publicado']
export const GAME_COLORS = ['green', 'cyan', 'orange']
/** Classificação indicativa (ClassInd) */
export const GAME_RATINGS = ['Livre', '10 anos', '12 anos', '14 anos', '16 anos', '18 anos']
export const GAME_PLATFORMS = ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile']

const toIso = (sql) => (sql ? `${sql.replace(' ', 'T')}Z` : null)

function uniqueSlug(db, title) {
  const base = slugify(title)
  let slug = base
  for (let n = 2; db.prepare('SELECT 1 FROM games WHERE slug = ?').get(slug); n += 1) {
    slug = `${base}-${n}`
  }
  return slug
}

// ===============================================
// FORMATO DA API
// ===============================================

/** Linha do banco -> objeto da API (com o estúdio junto) */
function toApi(db, row) {
  if (!row) return null
  const developer = row.developer_id ? getDeveloper(db, row.developer_id) : null
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    developerId: row.developer_id,
    developer: developer ? { id: developer.id, name: developer.name, logo: developer.logo } : null,
    character: row.character,
    characterImage: row.character_image,
    color: row.color,
    banner: row.banner,
    description: row.description,
    genre: row.genre,
    rating: row.rating,
    theme: row.theme,
    platforms: JSON.parse(row.platforms),
    quote: row.quote,
    screenshots: JSON.parse(row.screenshots),
    about: row.about,
    characters: JSON.parse(row.characters),
    status: row.status,
    updatedAt: toIso(row.updated_at),
  }
}

/** Resumo para "Outros projetos" na página de um jogo */
const toSummary = (row) => ({
  slug: row.slug,
  title: row.title,
  subtitle: row.subtitle,
  characterImage: row.character_image,
  color: row.color,
})

// ===============================================
// VALIDAÇÃO
// ===============================================

/** Confere os dados enviados pelo painel e devolve a versão limpa. */
export function validateGame(db, input = {}) {
  const errors = {}
  const platforms = v.list(input.platforms, 'platforms', errors, GAME_PLATFORMS.length)
  const screenshots = v.list(input.screenshots, 'screenshots', errors, 3)
  const characters = v.list(input.characters, 'characters', errors, 6)

  const data = {
    title: v.text(input.title, 'title', errors, { min: 2, max: 100, label: 'Nome do jogo' }),
    subtitle: v.text(input.subtitle, 'subtitle', errors, { max: 150, label: 'Subtítulo' }),
    developerId: null,
    character: v.text(input.character, 'character', errors, { max: 60, label: 'Personagem da vitrine' }),
    characterImage: v.image(input.characterImage, 'characterImage', errors),
    color: v.oneOf(input.color ?? 'green', GAME_COLORS, 'color', errors, 'Cor'),
    banner: v.image(input.banner, 'banner', errors),
    description: v.text(input.description, 'description', errors, { max: 300, label: 'Descrição curta' }),
    genre: v.text(input.genre, 'genre', errors, { max: 40, label: 'Gênero' }),
    rating: v.oneOf(input.rating ?? 'Livre', GAME_RATINGS, 'rating', errors, 'Classificação'),
    theme: v.text(input.theme, 'theme', errors, { max: 60, label: 'Tema' }),
    platforms: [...new Set(platforms)].filter((p, i) => {
      if (GAME_PLATFORMS.includes(p)) return true
      errors[`platforms.${i}`] = 'Plataforma inválida.'
      return false
    }),
    quote: v.text(input.quote, 'quote', errors, { max: 150, label: 'Frase' }),
    screenshots: screenshots.map((img, i) => v.image(img, `screenshots.${i}`, errors)),
    about: v.text(input.about, 'about', errors, { max: 3000, label: 'Sobre o jogo' }),
    characters: characters.map((c, i) => ({
      name: v.text(c?.name, `characters.${i}.name`, errors, { min: 1, max: 40, label: 'Nome do personagem' }),
      text: v.text(c?.text, `characters.${i}.text`, errors, { max: 300, label: 'Texto do personagem' }),
      image: v.image(c?.image, `characters.${i}.image`, errors),
    })),
    status: v.oneOf(input.status, GAME_STATUS, 'status', errors, 'Situação'),
  }

  if (input.developerId !== undefined && input.developerId !== null && input.developerId !== '') {
    data.developerId = Number(input.developerId)
    if (!getDeveloper(db, data.developerId)) errors.developerId = 'Desenvolvedora não encontrada.'
  }

  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)
  return data
}

function params(data) {
  return {
    title: data.title,
    subtitle: data.subtitle,
    developerId: data.developerId,
    character: data.character,
    characterImage: data.characterImage,
    color: data.color,
    banner: data.banner,
    description: data.description,
    genre: data.genre,
    rating: data.rating,
    theme: data.theme,
    platforms: JSON.stringify(data.platforms),
    quote: data.quote,
    screenshots: JSON.stringify(data.screenshots),
    about: data.about,
    characters: JSON.stringify(data.characters),
    status: data.status,
  }
}

// ===============================================
// LEITURA
// ===============================================

// Ordem da vitrine: do jogo mais antigo no site para o mais novo
const ORDER = 'ORDER BY created_at ASC, id ASC'

/** Jogos publicados (vitrine da página /jogo) */
export function listPublicGames(db) {
  return db.prepare(`SELECT * FROM games WHERE status = 'publicado' ${ORDER}`).all().map((row) => toApi(db, row))
}

/** Um jogo publicado pelo slug + os outros jogos publicados ("Outros projetos") */
export function getPublicGame(db, slug) {
  const row = db.prepare(`SELECT * FROM games WHERE slug = ? AND status = 'publicado'`).get(String(slug))
  if (!row) throw new HttpError(404, 'Jogo não encontrado.')
  const others = db.prepare(`SELECT * FROM games WHERE status = 'publicado' AND id != ? ${ORDER}`).all(row.id)
  return { game: toApi(db, row), others: others.map(toSummary) }
}

/**
 * Todos os jogos (inclusive rascunhos), para o painel.
 * Com { developerId }: só os jogos desse estúdio (login de estúdio).
 */
export function listAllGames(db, { developerId } = {}) {
  const rows = developerId
    ? db.prepare(`SELECT * FROM games WHERE developer_id = ? ${ORDER}`).all(Number(developerId))
    : db.prepare(`SELECT * FROM games ${ORDER}`).all()
  return rows.map((row) => toApi(db, row))
}

export function getGame(db, id) {
  return toApi(db, db.prepare('SELECT * FROM games WHERE id = ?').get(Number(id)))
}

// ===============================================
// ESCRITA (só pelo painel, com login)
// ===============================================

export function createGame(db, input) {
  const data = validateGame(db, input)
  const { lastInsertRowid } = db
    .prepare(`INSERT INTO games (slug, title, subtitle, developer_id, character, character_image, color, banner,
                description, genre, rating, theme, platforms, quote, screenshots, about, characters, status)
              VALUES (:slug, :title, :subtitle, :developerId, :character, :characterImage, :color, :banner,
                :description, :genre, :rating, :theme, :platforms, :quote, :screenshots, :about, :characters, :status)`)
    .run({ ...params(data), slug: uniqueSlug(db, data.title) })
  return getGame(db, lastInsertRowid)
}

export function updateGame(db, id, input) {
  if (!getGame(db, id)) throw new HttpError(404, 'Jogo não encontrado.')
  const data = validateGame(db, input)
  db.prepare(`UPDATE games SET title = :title, subtitle = :subtitle, developer_id = :developerId,
                character = :character, character_image = :characterImage, color = :color, banner = :banner,
                description = :description, genre = :genre, rating = :rating, theme = :theme,
                platforms = :platforms, quote = :quote, screenshots = :screenshots, about = :about,
                characters = :characters, status = :status, updated_at = CURRENT_TIMESTAMP
              WHERE id = :id`)
    .run({ ...params(data), id: Number(id) })
  return getGame(db, id)
}

export function deleteGame(db, id) {
  const { changes } = db.prepare('DELETE FROM games WHERE id = ?').run(Number(id))
  if (!changes) throw new HttpError(404, 'Jogo não encontrado.')
}
