/**
 * SERVIÇO: desenvolvedoras
 * ========================
 * Ler, criar, editar e apagar os estúdios mostrados em "Developed By".
 * Todas as funções recebem o banco (db) como primeiro parâmetro.
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'

/** Linha do banco -> objeto da API */
export function toApi(row) {
  if (!row) return null
  return {
    id: row.id,
    name: row.name,
    logo: row.logo,
    description: row.description,
    activeDevs: row.active_devs,
    socials: JSON.parse(row.socials),
    members: JSON.parse(row.members),
  }
}

/** Confere os dados enviados pelo painel e devolve a versão limpa. */
export function validateDeveloper(input = {}) {
  const errors = {}
  const data = {
    name: v.text(input.name, 'name', errors, { min: 2, max: 100, label: 'Nome' }),
    logo: v.image(input.logo, 'logo', errors),
    description: v.text(input.description, 'description', errors, { max: 600, label: 'Descrição' }),
    activeDevs: v.integer(input.activeDevs ?? 0, 'activeDevs', errors, { min: 0, max: 999, label: 'Devs ativos' }),
    socials: v.list(input.socials, 'socials', errors, 6).map((s, i) => ({
      label: v.text(s?.label, `socials.${i}.label`, errors, { min: 1, max: 30, label: 'Nome da rede' }),
      url: v.link(s?.url, `socials.${i}.url`, errors),
    })),
    members: v.list(input.members, 'members', errors, 12).map((m, i) => ({
      name: v.text(m?.name, `members.${i}.name`, errors, { min: 1, max: 60, label: 'Nome do integrante' }),
      role: v.text(m?.role, `members.${i}.role`, errors, { max: 60, label: 'Função' }),
      photo: v.image(m?.photo, `members.${i}.photo`, errors),
    })),
  }
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)
  return data
}

export function listDevelopers(db) {
  return db.prepare('SELECT * FROM developers ORDER BY name').all().map(toApi)
}

export function getDeveloper(db, id) {
  return toApi(db.prepare('SELECT * FROM developers WHERE id = ?').get(Number(id)))
}

function params(data) {
  return {
    name: data.name,
    logo: data.logo,
    description: data.description,
    activeDevs: data.activeDevs,
    socials: JSON.stringify(data.socials),
    members: JSON.stringify(data.members),
  }
}

export function createDeveloper(db, input) {
  const data = validateDeveloper(input)
  const { lastInsertRowid } = db
    .prepare(`INSERT INTO developers (name, logo, description, active_devs, socials, members)
              VALUES (:name, :logo, :description, :activeDevs, :socials, :members)`)
    .run(params(data))
  return getDeveloper(db, lastInsertRowid)
}

export function updateDeveloper(db, id, input) {
  if (!getDeveloper(db, id)) throw new HttpError(404, 'Desenvolvedora não encontrada.')
  const data = validateDeveloper(input)
  db.prepare(`UPDATE developers SET name = :name, logo = :logo, description = :description,
              active_devs = :activeDevs, socials = :socials, members = :members,
              updated_at = CURRENT_TIMESTAMP WHERE id = :id`)
    .run({ ...params(data), id: Number(id) })
  return getDeveloper(db, id)
}

/** Apaga a desenvolvedora. Os posts dela continuam, só ficam sem "Developed By". */
export function deleteDeveloper(db, id) {
  const { changes } = db.prepare('DELETE FROM developers WHERE id = ?').run(Number(id))
  if (!changes) throw new HttpError(404, 'Desenvolvedora não encontrada.')
}
