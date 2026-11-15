/**
 * SERVIÇO: about
 * ==============
 * Os 2 cards do topo da página About ("SOBRE NÓS"):
 *   imagem + título + subtítulo (laranja) + texto
 *
 * Só o admin da Trevo altera (a rota já bloqueia os estúdios).
 * O painel salva os cards juntos, de uma vez, na ordem da tela.
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'

// ===============================================
// LIMITES
// ===============================================

export const MAX_ABOUT_CARDS = 2

/** Conteúdo inicial (aparece até a equipe trocar pelo painel) */
export const DEFAULT_ABOUT_CARDS = [
  {
    image: '',
    title: 'QUEM SOMOS',
    subtitle: 'TREVO TEAM',
    text: 'Uma publisher indie que divulga e financia jogos independentes, do primeiro protótipo ao lançamento.',
  },
  {
    image: '',
    title: 'O QUE FAZEMOS',
    subtitle: 'JOGOS COM RAIZ',
    text: 'Ajudamos estúdios pequenos a crescer: divulgação, apoio no desenvolvimento e um lugar para mostrar cada projeto.',
  },
]

const toApi = (row) => ({ id: row.id, image: row.image, title: row.title, subtitle: row.subtitle, text: row.text })

// ===============================================
// LEITURA
// ===============================================

/** Cards do topo da página About, na ordem */
export function listAboutCards(db) {
  return db.prepare('SELECT * FROM about_cards ORDER BY position, id').all().map(toApi)
}

// ===============================================
// ESCRITA (só admin)
// ===============================================

/**
 * Troca os cards pelos enviados.
 * cards = [{ image, title, subtitle, text }, ...] (até 2), na ordem da tela.
 */
export function replaceAboutCards(db, cards) {
  const errors = {}
  const list = v.list(cards, 'cards', errors, MAX_ABOUT_CARDS)
  const clean = list.map((c, i) => ({
    image: v.image(c?.image, `cards.${i}.image`, errors),
    title: v.text(c?.title, `cards.${i}.title`, errors, { min: 1, max: 40, label: 'Título' }),
    subtitle: v.text(c?.subtitle, `cards.${i}.subtitle`, errors, { max: 40, label: 'Subtítulo' }),
    text: v.text(c?.text, `cards.${i}.text`, errors, { max: 400, label: 'Texto' }),
  }))
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)

  // Tudo ou nada: se algo der errado no meio, os cards antigos continuam
  db.exec('BEGIN')
  try {
    db.prepare('DELETE FROM about_cards').run()
    const insert = db.prepare('INSERT INTO about_cards (position, image, title, subtitle, text) VALUES (?, ?, ?, ?, ?)')
    clean.forEach((c, i) => insert.run(i, c.image, c.title, c.subtitle, c.text))
    db.exec('COMMIT')
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
  return listAboutCards(db)
}