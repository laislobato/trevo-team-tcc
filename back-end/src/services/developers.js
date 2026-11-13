/**
 * SERVIÇO: desenvolvedoras
 * ========================
 * Ler, criar, editar e apagar os estúdios mostrados em "Developed By".
 * Todas as funções recebem o banco (db) como primeiro parâmetro.
 *
 * A Trevo Team também é uma desenvolvedora (isTrevo = true):
 * - aparece sempre em primeiro na lista;
 * - não pode ser apagada;
 * - os integrantes dela formam a equipe da página About (getTeam).
 *
 * Integrante: { name, nickname, role, photo, description, socials: [até 3 { label, url }] }
 */

import { HttpError } from './errors.js'
import * as v from './validate.js'

/** Integrantes antigos (antes do apelido, descrição e redes) ganham os campos vazios */
const normalizeMember = (m) => ({ nickname: '', description: '', socials: [], role: '', photo: '', ...m })

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
    members: JSON.parse(row.members).map(normalizeMember),
    isTrevo: row.is_trevo === 1,
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
      nickname: v.text(m?.nickname, `members.${i}.nickname`, errors, { max: 30, label: 'Apelido' }),
      role: v.text(m?.role, `members.${i}.role`, errors, { max: 60, label: 'Cargo e função' }),
      photo: v.image(m?.photo, `members.${i}.photo`, errors),
      description: v.text(m?.description, `members.${i}.description`, errors, { max: 600, label: 'Descrição' }),
      socials: v.list(m?.socials, `members.${i}.socials`, errors, 3).map((s, j) => ({
        label: v.text(s?.label, `members.${i}.socials.${j}.label`, errors, { min: 1, max: 30, label: 'Nome da rede' }),
        url: v.link(s?.url, `members.${i}.socials.${j}.url`, errors),
      })),
    })),
  }
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)
  return data
}

/** Todas as desenvolvedoras: a Trevo Team primeiro, depois as outras em ordem alfabética */
export function listDevelopers(db) {
  return db.prepare('SELECT * FROM developers ORDER BY is_trevo DESC, name').all().map(toApi)
}

/** Equipe da página About: a Trevo Team (nome, descrição e integrantes) */
export function getTeam(db) {
  const team = toApi(db.prepare('SELECT * FROM developers WHERE is_trevo = 1').get())
  if (!team) throw new HttpError(404, 'Equipe não encontrada.')
  return { name: team.name, description: team.description, logo: team.logo, members: team.members }
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

/**
 * Apaga a desenvolvedora. Os posts dela continuam, só ficam sem "Developed By".
 * Os logins do estúdio são apagados junto (ON DELETE CASCADE no banco).
 */
export function deleteDeveloper(db, id) {
  const dev = getDeveloper(db, id)
  if (dev?.isTrevo) throw new HttpError(400, 'A Trevo Team não pode ser apagada.')
  const { changes } = db.prepare('DELETE FROM developers WHERE id = ?').run(Number(id))
  if (!changes) throw new HttpError(404, 'Desenvolvedora não encontrada.')
}