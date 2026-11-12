/**
 * SERVIÇO: logins do painel
 * =========================
 * Login (e-mail + senha), troca de senha e os logins dos estúdios.
 *
 * Tipos de login (role):
 * - 'admin'  -> equipe da Trevo: mexe em tudo e cria os logins dos estúdios
 * - 'studio' -> um estúdio: só mexe no que é dele (developerId)
 *
 * Formato do usuário devolvido pela API:
 *   { id, email, role, developerId, developer: { id, name } | null }
 */

import { HttpError } from './errors.js'
import { hashPassword, verifyPassword } from './passwords.js'
import { getDeveloper } from './developers.js'

const DUMMY_HASH = hashPassword('senha-que-nao-existe')
const MIN_PASSWORD = 10

// ===============================================
// FORMATO E VALIDAÇÃO
// ===============================================

/** Linha do banco -> usuário da API (nunca devolve o hash da senha) */
function toApi(db, row) {
  if (!row) return null
  const developer = row.developer_id ? getDeveloper(db, row.developer_id) : null
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    developerId: row.developer_id ?? null,
    developer: developer ? { id: developer.id, name: developer.name } : null,
  }
}

const cleanEmail = (email) => String(email || '').trim().toLowerCase()

function validateEmail(db, email, errors, ignoreId = null) {
  const clean = cleanEmail(email)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean) || clean.length > 120) {
    errors.email = 'E-mail inválido.'
  } else {
    const other = db.prepare('SELECT id FROM users WHERE email = ?').get(clean)
    if (other && other.id !== ignoreId) errors.email = 'Já existe um login com esse e-mail.'
  }
  return clean
}

function validatePassword(password, errors) {
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    errors.password = `A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`
  }
}

// ===============================================
// LOGIN E CONTA PRÓPRIA
// ===============================================

/** Devolve o usuário se e-mail e senha estiverem certos; senão, null. */
export function checkLogin(db, email, password) {
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail(email))
  // Mesmo sem usuário, compara com um hash qualquer: assim o tempo de resposta
  // não revela se o e-mail existe ou não.
  const ok = verifyPassword(String(password || ''), user ? user.password_hash : DUMMY_HASH)
  if (!user || !ok) return null
  return toApi(db, user)
}

export function getUser(db, id) {
  return toApi(db, db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id)))
}

export function changePassword(db, id, currentPassword, newPassword) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id))
  if (!user || !verifyPassword(String(currentPassword || ''), user.password_hash)) {
    throw new HttpError(400, 'A senha atual está errada.')
  }
  if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD) {
    throw new HttpError(400, `A nova senha precisa ter pelo menos ${MIN_PASSWORD} caracteres.`)
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), user.id)
}

// ===============================================
// LOGINS DOS ESTÚDIOS (só o admin usa)
// ===============================================

/** Logins dos estúdios (todos, ou só os de uma desenvolvedora) */
export function listStudioAccounts(db, developerId) {
  const rows = developerId
    ? db.prepare(`SELECT * FROM users WHERE role = 'studio' AND developer_id = ? ORDER BY email`).all(Number(developerId))
    : db.prepare(`SELECT * FROM users WHERE role = 'studio' ORDER BY email`).all()
  return rows.map((row) => toApi(db, row))
}

function getStudioRow(db, id) {
  const row = db.prepare(`SELECT * FROM users WHERE id = ? AND role = 'studio'`).get(Number(id))
  if (!row) throw new HttpError(404, 'Login de estúdio não encontrado.')
  return row
}

/** Cria o login de um estúdio: { email, password, developerId } */
export function createStudioAccount(db, input = {}) {
  const errors = {}
  const email = validateEmail(db, input.email, errors)
  validatePassword(input.password, errors)
  const developerId = Number(input.developerId)
  if (!developerId || !getDeveloper(db, developerId)) errors.developerId = 'Escolha a desenvolvedora do login.'
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)

  const { lastInsertRowid } = db
    .prepare(`INSERT INTO users (email, password_hash, role, developer_id) VALUES (?, ?, 'studio', ?)`)
    .run(email, hashPassword(input.password), developerId)
  return getUser(db, lastInsertRowid)
}

/**
 * Edita o login de um estúdio: { email, password }.
 * A senha é opcional: vazia = continua a mesma (preencher = trocar a senha).
 */
export function updateStudioAccount(db, id, input = {}) {
  const row = getStudioRow(db, id)
  const errors = {}
  const email = validateEmail(db, input.email, errors, row.id)
  const newPassword = input.password ? String(input.password) : ''
  if (newPassword) validatePassword(newPassword, errors)
  if (Object.keys(errors).length) throw new HttpError(400, 'Confira os campos destacados.', errors)

  db.prepare('UPDATE users SET email = ? WHERE id = ?').run(email, row.id)
  if (newPassword) {
    db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), row.id)
  }
  return getUser(db, row.id)
}

/** Apaga o login de um estúdio (os posts e jogos do estúdio continuam). */
export function deleteStudioAccount(db, id) {
  const row = getStudioRow(db, id)
  db.prepare('DELETE FROM users WHERE id = ?').run(row.id)
}
