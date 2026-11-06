/**
 * SERVIÇO: conta da equipe
 * ========================
 * Login (e-mail + senha) e troca de senha.
 */

import { HttpError } from './errors.js'
import { hashPassword, verifyPassword } from './passwords.js'

const DUMMY_HASH = hashPassword('senha-que-nao-existe')

/** Devolve o usuário se e-mail e senha estiverem certos; senão, null. */
export function checkLogin(db, email, password) {
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email || '').trim().toLowerCase())
  // Mesmo sem usuário, compara com um hash qualquer: assim o tempo de resposta
  // não revela se o e-mail existe ou não.
  const ok = verifyPassword(String(password || ''), user ? user.password_hash : DUMMY_HASH)
  if (!user || !ok) return null
  return { id: user.id, email: user.email }
}

export function getUser(db, id) {
  const user = db.prepare('SELECT id, email FROM users WHERE id = ?').get(Number(id))
  return user ? { id: user.id, email: user.email } : null
}

export function changePassword(db, id, currentPassword, newPassword) {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(id))
  if (!user || !verifyPassword(String(currentPassword || ''), user.password_hash)) {
    throw new HttpError(400, 'A senha atual está errada.')
  }
  if (typeof newPassword !== 'string' || newPassword.length < 10) {
    throw new HttpError(400, 'A nova senha precisa ter pelo menos 10 caracteres.')
  }
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(hashPassword(newPassword), user.id)
}
