/**
 * SERVIÇO: banners
 * ================
 * Banners do carrossel do topo de duas páginas do site:
 *   'home'  -> página inicial (/)
 *   'jogos' -> página inicial dos jogos (/jogo)
 *
 * Só o admin da Trevo altera (a rota já bloqueia os estúdios).
 * O painel salva a LISTA INTEIRA de uma página de uma vez (com a ordem):
 * assim dá para adicionar, apagar e reordenar e clicar em salvar uma vez só.
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'

// ===============================================
// OPÇÕES E LIMITES
// ===============================================

export const BANNER_PAGES = ['home', 'jogos']
export const MAX_BANNERS = 8

function checkPage(page) {
  if (!BANNER_PAGES.includes(page)) throw new HttpError(404, 'Página de banners não encontrada.')
}

/**
 * Link do banner: vazio (banner sem link), página do site ("/jogo/meu-jogo")
 * ou endereço completo ("https://...").
 */
function bannerLink(value, field, errors) {
  const clean = typeof value === 'string' ? value.trim() : ''
  if (clean === '') return ''
  if (/^\/(?!\/)[^\s"'<>]*$/.test(clean) || /^https?:\/\/[^\s"'<>]+$/.test(clean)) return clean
  errors[field] = 'Link inválido: use uma página do site (/jogo/...) ou https://...'
  return ''
}

const toApi = (row) => ({ id: row.id, image: row.image, alt: row.alt, link: row.link })

// ===============================================
// LEITURA
// ===============================================

/** Banners de uma página, na ordem do carrossel */
export function listBanners(db, page) {
  checkPage(page)
  return db.prepare('SELECT * FROM banners WHERE page = ? ORDER BY position, id').all(page).map(toApi)
}

/** Banners das duas páginas, para o painel: { home: [...], jogos: [...] } */
export function listAllBanners(db) {
  return Object.fromEntries(BANNER_PAGES.map((page) => [page, listBanners(db, page)]))
}

// ===============================================
// ESCRITA (só admin)
// ===============================================

/**
 * Troca a lista de banners de uma página pela lista enviada.
 * banners = [{ image, alt, link }, ...] na ordem do carrossel.
 */
export function replaceBanners(db, page, banners) {
  checkPage(page)
  const errors = {}
  const list = v.list(banners, 'banners', errors, MAX_BANNERS)
  const clean = list.map((b, i) => ({
    image: v.image(b?.image, `banners.${i}.image`, errors),
    alt: v.text(b?.alt, `banners.${i}.alt`, errors, { min: 2, max: 120, label: 'Descrição' }),
    link: bannerLink(b?.link, `banners.${i}.link`, errors),
  }))
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)

  // Tudo ou nada: se algo der errado no meio, a lista antiga continua
  db.exec('BEGIN')
  try {
    db.prepare('DELETE FROM banners WHERE page = ?').run(page)
    const insert = db.prepare('INSERT INTO banners (page, position, image, alt, link) VALUES (?, ?, ?, ?, ?)')
    clean.forEach((b, i) => insert.run(page, i, b.image, b.alt, b.link))
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
  return listBanners(db, page)
}
